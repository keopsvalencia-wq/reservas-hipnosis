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
const personalCalendarId = 'keopsvalencia@gmail.com';

// Agrega aquí los IDs de los otros calendarios (GVA, Médico) cuando los tengas
const extraCalendars: string[] = [
    // 'CALENDAR_ID_HERE',
];

/**
 * Verifica disponibilidad en Google Calendar (Precisión estricta).
 */
export async function checkAvailability(
    date: string,
    time: string
): Promise<boolean> {
    const auth = getAuthClient();
    const calendar = google.calendar({ version: 'v3', auth });

    const startDate = new Date(`${date}T${time}:00`);
    const endDate = new Date(startDate.getTime() + SESSION_DURATION_MINUTES * 60 * 1000);

    const items = [
        { id: calendarId },
        { id: personalCalendarId },
        ...extraCalendars.map(id => ({ id }))
    ];

    try {
        const response = await calendar.freebusy.query({
            requestBody: {
                timeMin: startDate.toISOString(),
                timeMax: endDate.toISOString(),
                items,
                timeZone: 'Europe/Madrid',
            },
        });

        const busy = response.data.calendars;
        if (!busy) return true;

        for (const id in busy) {
            if (busy[id].busy && busy[id].busy.length > 0) {
                return false;
            }
        }

        return true;
    } catch (error: any) {
        console.error('❌ Error checking availability:', error.message);
        return false;
    }
}

/**
 * Obtiene todos los huecos ocupados para un día dado.
 */
export async function getBusySlots(date: string): Promise<string[]> {
    const auth = getAuthClient();
    const calendar = google.calendar({ version: 'v3', auth });

    const timeMin = `${date}T00:00:00+01:00`;
    const timeMax = `${date}T23:59:59+01:00`;

    const items = [
        { id: calendarId },
        { id: personalCalendarId },
        ...extraCalendars.map(id => ({ id }))
    ];

    try {
        console.log(`🔍 [GCal] Consultando Agenda para ${date}. Calendarios vigilados:`, items.map(i => i.id));
        const response = await calendar.freebusy.query({
            requestBody: {
                timeMin,
                timeMax,
                items,
                timeZone: 'Europe/Madrid',
            },
        });

        const busySlots: string[] = [];
        const calendars = response.data.calendars;

        if (calendars) {
            for (const id in calendars) {
                const busyList = calendars[id].busy || [];
                if (busyList.length > 0) {
                    console.log(`📅 [${id}] tiene ${busyList.length} eventos.`);
                }
                busyList.forEach((period) => {
                    if (period.start && period.end) {
                        // Guardamos [inicio]|[fin]|[resumen] para depuración
                        const summary = (period as any).summary || '';
                        busySlots.push(`${period.start}|${period.end}|${summary}`);
                    }
                });
            }
        }
        return busySlots;
    } catch (error: any) {
        console.error('❌ Error getting busy slots:', error.message);
        throw error; // Throw so frontend knows API failed and doesn't assume all slots are free
    }
}

/**
 * Obtiene todos los huecos ocupados para un rango dado.
 */
export async function getBusyRange(startDate: string, endDate: string): Promise<string[]> {
    const auth = getAuthClient();
    const calendar = google.calendar({ version: 'v3', auth });

    const items = [
        { id: calendarId },
        { id: personalCalendarId },
        ...extraCalendars.map(id => ({ id }))
    ];

    try {
        const response = await calendar.freebusy.query({
            requestBody: {
                timeMin: `${startDate}T00:00:00Z`,
                timeMax: `${endDate}T23:59:59Z`,
                items,
                timeZone: 'Europe/Madrid',
            },
        });

        const busySlots: string[] = [];
        const calendars = response.data.calendars;

        if (calendars) {
            for (const id in calendars) {
                const busyList = calendars[id].busy || [];
                busyList.forEach((period) => {
                    if (period.start && period.end) {
                        busySlots.push(`${period.start}|${period.end}`);
                    }
                });
            }
        }
        return busySlots;
    } catch (error: any) {
        console.error('❌ Error getting busy range:', error.message);
        throw error;
    }
}

/**
 * Crea un evento en Google Calendar.
 */
export async function createCalendarEvent(data: {
    fullName: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    location: string;
    triageInfo?: {
        dedicacion?: string;
        motivo?: string;
        compromiso?: string;
        tiempo?: string;
        inversion?: string;
        ciudad?: string;
    };
}): Promise<string> {
    const auth = getAuthClient();
    const calendar = google.calendar({ version: 'v3', auth });

    const startDate = new Date(`${data.date}T${data.time}:00`);
    const endDate = new Date(startDate.getTime() + SESSION_DURATION_MINUTES * 60 * 1000);

    const locationLabel =
        data.location === 'valencia'
            ? 'Picanya (Sede Presencial)'
            : data.location === 'motilla'
                ? 'Motilla (Sede Presencial)'
                : 'Online (Videollamada)';

    try {
        const event = await calendar.events.insert({
            calendarId,
            requestBody: {
                summary: `Evaluación: ${data.fullName}`,
                description: [
                    `--- DATOS CLIENTE ---`,
                    `Nombre: ${data.fullName}`,
                    data.triageInfo?.ciudad ? `Ciudad: ${data.triageInfo.ciudad}` : '',
                    data.triageInfo?.dedicacion ? `Dedicación: ${data.triageInfo.dedicacion}` : '',
                    `Motivo: ${data.triageInfo?.motivo || 'No especificado'}`,
                    ``,
                    `--- TRIPLE INVERSION ---`,
                    `Compromiso: ${data.triageInfo?.compromiso || '—'}`,
                    `Tiempo: ${data.triageInfo?.tiempo || '—'}`,
                    `Dinero: ${data.triageInfo?.inversion || '—'}`,
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
                        { method: 'popup', minutes: 30 },      // Push notification en el movil 30 min antes
                        { method: 'email', minutes: 60 * 24 }, // 24h antes por email (al admin)
                        { method: 'email', minutes: 60 },      // 1h antes por email (al admin)
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
