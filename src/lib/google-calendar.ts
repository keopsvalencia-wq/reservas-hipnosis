import { google } from 'googleapis';
import { SESSION_DURATION_MINUTES } from './booking-rules';

// ───────────────────────────────────────────────────
// Google Calendar — Service Account Integration
// ───────────────────────────────────────────────────
// Env vars:
//   GOOGLE_SERVICE_ACCOUNT_EMAIL — service account email
//   GOOGLE_PRIVATE_KEY           — private key (PEM format)
//   GOOGLE_CALENDAR_ID           — calendar ID
// ───────────────────────────────────────────────────

function getAuthClient() {
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    // Replace escaped newlines with actual newlines
    const privateKey = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

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
 * Busca eventos que se solapen con el slot solicitado.
 */
export async function checkAvailability(
    date: string,
    time: string
): Promise<boolean> {
    try {
        const auth = getAuthClient();
        const calendar = google.calendar({ version: 'v3', auth });

        const startDate = new Date(`${date}T${time}:00`);
        const endDate = new Date(startDate.getTime() + SESSION_DURATION_MINUTES * 60 * 1000);

        const response = await calendar.events.list({
            calendarId,
            timeMin: startDate.toISOString(),
            timeMax: endDate.toISOString(),
            singleEvents: true,
        });

        // If no events overlap → slot is available
        return (response.data.items?.length || 0) === 0;
    } catch (error) {
        console.error('Error checking availability:', error);
        throw new Error('No se pudo verificar la disponibilidad');
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
    try {
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
                attendees: [
                    { email: data.email, displayName: data.name },
                ],
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
    } catch (error) {
        console.error('Error creating calendar event:', error);
        throw new Error('No se pudo crear el evento en el calendario');
    }
}
