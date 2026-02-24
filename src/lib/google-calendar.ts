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
 */
export async function checkAvailability(
    date: string,
    time: string
): Promise<boolean> {
    const auth = getAuthClient();
    const calendar = google.calendar({ version: 'v3', auth });

    const startDate = new Date(`${date}T${time}:00`);
    const endDate = new Date(startDate.getTime() + SESSION_DURATION_MINUTES * 60 * 1000);

    try {
        const response = await calendar.events.list({
            calendarId,
            timeMin: startDate.toISOString(),
            timeMax: endDate.toISOString(),
            singleEvents: true,
        });

        const events = response.data.items || [];
        return events.length === 0;
    } catch (error: any) {
        console.error('❌ Error checking availability:', {
            status: error.status,
            message: error.message,
            reason: error.errors?.[0]?.reason
        });
        throw new Error(`Google Calendar (List): ${error.message}`);
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
