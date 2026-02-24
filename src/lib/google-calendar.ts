import { google } from 'googleapis';
import { SESSION_DURATION_MINUTES } from './booking-rules';

// ───────────────────────────────────────────────────
// Google Calendar — Service Account Integration
// ───────────────────────────────────────────────────

function getAuthClient() {
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = (process.env.GOOGLE_PRIVATE_KEY || '')
        .replace(/^"(.*)"$/, '$1')
        .replace(/\\n/g, '\n');

    if (!email || !privateKey) {
        throw new Error('Google Calendar credentials not configured');
    }

    return new google.auth.JWT({
        email,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/calendar'],
    });
}

const calendarId = process.env.GOOGLE_CALENDAR_ID || '';

/**
 * Verifica disponibilidad en Google Calendar.
 * Usa freebusy para ser más preciso.
 */
export async function checkAvailability(
    date: string,
    time: string
): Promise<boolean> {
    const auth = getAuthClient();
    const calendar = google.calendar({ version: 'v3', auth });

    // Añadimos margen de seguridad de 15 min antes y después
    const BUFFER = 15;
    const startDate = new Date(`${date}T${time}:00`);
    const bufferedStart = new Date(startDate.getTime() - BUFFER * 60 * 1000);
    const bufferedEnd = new Date(startDate.getTime() + (SESSION_DURATION_MINUTES + BUFFER) * 60 * 1000);

    try {
        const response = await calendar.freebusy.query({
            requestBody: {
                timeMin: bufferedStart.toISOString(),
                timeMax: bufferedEnd.toISOString(),
                items: [{ id: 'primary' }, { id: calendarId }],
                timeZone: 'Europe/Madrid',
            },
        });

        const busy = response.data.calendars;
        if (!busy) return true;

        // Si hay algún intervalo ocupado en cualquiera de los calendarios
        for (const calId in busy) {
            if (busy[calId].busy && busy[calId].busy.length > 0) {
                return false;
            }
        }

        return true;
    } catch (error: any) {
        console.error('❌ Error checking availability:', error.message);
        throw new Error(`Google Calendar (FreeBusy): ${error.message}`);
    }
}

/**
 * Obtiene todos los huecos ocupados para un día dado.
 */
export async function getBusySlots(date: string): Promise<string[]> {
    const auth = getAuthClient();
    const calendar = google.calendar({ version: 'v3', auth });

    // Consultamos todo el día
    const timeMin = new Date(`${date}T00:00:00Z`).toISOString();
    const timeMax = new Date(`${date}T23:59:59Z`).toISOString();

    try {
        const response = await calendar.freebusy.query({
            requestBody: {
                timeMin,
                timeMax,
                items: [{ id: 'primary' }, { id: calendarId }],
                timeZone: 'Europe/Madrid',
            },
        });

        const busySlots: string[] = [];
        const calendars = response.data.calendars;

        if (calendars) {
            for (const calId in calendars) {
                const busyList = calendars[calId].busy || [];
                busyList.forEach((period) => {
                    if (period.start && period.end) {
                        const start = new Date(period.start);
                        const end = new Date(period.end);

                        // Añadimos buffer de 15 min al inicio y fin para el bloqueo
                        const bufferedStart = new Date(start.getTime() - 15 * 60 * 1000);
                        const bufferedEnd = new Date(end.getTime() + 15 * 60 * 1000);

                        // Marcamos como ocupados todos los slots que caigan dentro del periodo
                        // (esto se procesará en el frontend contra el horario predefinido)
                        busySlots.push(`${bufferedStart.toISOString()}|${bufferedEnd.toISOString()}`);
                    }
                });
            }
        }

        return busySlots;
    } catch (error: any) {
        console.error('❌ Error getting busy slots:', error.message);
        return [];
    }
}

/**
 * Crea un evento en Google Calendar.
 */
export async function createCalendarEvent(data: {
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    location: string;
    motivo?: string;
}): Promise<string> {
    const auth = getAuthClient();
    const calendar = google.calendar({ version: 'v3', auth });

    const startDate = new Date(`${data.date}T${data.time}:00`);
    const endDate = new Date(startDate.getTime() + SESSION_DURATION_MINUTES * 60 * 1000);

    const locationLabel =
        data.location === 'valencia'
            ? 'Valencia (Picanya)'
            : data.location === 'motilla'
                ? 'Motilla del Palancar'
                : 'Online';

    try {
        const event = await calendar.events.insert({
            calendarId,
            requestBody: {
                summary: `Valoración — ${data.name}`,
                description: [
                    `📋 Sesión de Valoración Diagnóstica`,
                    ``,
                    `👤 Nombre: ${data.name}`,
                    `📧 Email: ${data.email}`,
                    `📱 Teléfono: ${data.phone}`,
                    `📍 Ubicación: ${locationLabel}`,
                    data.motivo ? `🎯 Motivo: ${data.motivo}` : '',
                    ``,
                    `Reserva automática desde reservas.hipnosisenterapia.com`,
                ]
                    .filter(Boolean)
                    .join('\n'),
                start: {
                    dateTime: startDate.toISOString(),
                    timeZone: 'Europe/Madrid',
                },
                end: {
                    dateTime: endDate.toISOString(),
                    timeZone: 'Europe/Madrid',
                },
                location: locationLabel,
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'email', minutes: 60 * 24 }, // 24h antes
                        { method: 'email', minutes: 60 },      // 1h antes
                    ],
                },
            },
        });

        return event.data.id || '';
    } catch (error: any) {
        console.error('❌ Error creating calendar event:', {
            status: error.status,
            message: error.message,
            reason: error.errors?.[0]?.reason
        });
        throw new Error(`Google Calendar (Insert): ${error.message}`);
    }
}
