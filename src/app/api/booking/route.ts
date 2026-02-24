import { NextResponse } from 'next/server';
import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import { BookingData } from '@/lib/types';
import { LOCATION_LABELS } from '@/lib/booking-rules';
import { checkAvailability, createCalendarEvent } from '@/lib/google-calendar';
import { sendPatientConfirmation, sendTherapistNotification } from '@/lib/mailer';

export async function POST(request: Request) {
    try {
        const data: BookingData = await request.json();

        // ─── Validation ──────────────────────────────
        if (!data.name || !data.email || !data.phone || !data.date || !data.time || !data.location) {
            return NextResponse.json(
                { success: false, message: 'Faltan campos obligatorios' },
                { status: 400 }
            );
        }

        if (!data.acceptPrivacy) {
            return NextResponse.json(
                { success: false, message: 'Debes aceptar la política de privacidad' },
                { status: 400 }
            );
        }

        // Date validation: No agendar hoy, mínimo mañana
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const bookingDate = new Date(`${data.date}T00:00:00`);

        if (bookingDate <= today) {
            return NextResponse.json(
                { success: false, message: 'La reserva debe ser como mínimo con un día de antelación.' },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return NextResponse.json(
                { success: false, message: 'Email no válido' },
                { status: 400 }
            );
        }

        // ─── Check Google Calendar availability ──────
        let eventId = '';
        const hasGoogleCredentials =
            process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
            process.env.GOOGLE_PRIVATE_KEY &&
            process.env.GOOGLE_CALENDAR_ID;

        // ─── Extract triage data ────────────────────
        const triage = data.triageAnswers || {};
        const motivo = (triage.motivo_consulta || triage.motivo || '') as string;
        const situacion = (triage.situacion_actual || '') as string;

        if (hasGoogleCredentials) {
            try {
                const isAvailable = await checkAvailability(data.date, data.time);
                if (!isAvailable) {
                    return NextResponse.json(
                        { success: false, message: 'Lo sentimos, este horario ya no está disponible.' },
                        { status: 409 }
                    );
                }

                eventId = await createCalendarEvent({
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    date: data.date,
                    time: data.time,
                    location: data.location,
                    motivo: motivo || situacion,
                });
                console.log('✅ Evento creado en GCalendar:', eventId);
            } catch (calErr: any) {
                console.error('❌ Error en Google Calendar:', calErr.message);
                // Si falla el calendario, lanzamos error para que no parezca que se reservó si no hay hueco asegurado
                return NextResponse.json(
                    { success: false, message: 'Error al conectar con el calendario. Por favor, contacta por WhatsApp.' },
                    { status: 500 }
                );
            }
        } else {
            eventId = `mock_${Date.now()}`;
            console.log('⚠️ Modo mock activo (Calendar).');
        }

        // ─── Send emails ─────────────────────────────
        const dateFormatted = format(
            parse(data.date, 'yyyy-MM-dd', new Date()),
            "EEEE d 'de' MMMM 'de' yyyy",
            { locale: es }
        );

        const locationLabel = LOCATION_LABELS[data.location] || data.location;

        const emailData = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            date: dateFormatted,
            time: data.time,
            location: locationLabel,
            motivo: motivo || situacion,
        };

        const hasSmtpCredentials = process.env.SMTP_USER && process.env.SMTP_PASS;

        if (hasSmtpCredentials) {
            try {
                // Enviamos correos. Si fallan, logueamos pero NO bloqueamos al usuario si el evento ya se creó
                await Promise.all([
                    sendPatientConfirmation(emailData),
                    sendTherapistNotification(emailData),
                ]);
                console.log('📧 Emails enviados correctamente');
            } catch (mailErr: any) {
                console.error('⚠️ Error enviando emails (pero reserva creada):', mailErr.message);
            }
        }

        // ─── Success ─────────────────────────────────
        return NextResponse.json({
            success: true,
            eventId,
            message: 'Reserva confirmada correctamente',
        });
    } catch (error: any) {
        console.error('❌ ERROR TOTAL /api/booking:', error);
        return NextResponse.json(
            {
                success: false,
                message: `Error interno: ${error.message || 'Desconocido'}. Contacta por WhatsApp.`,
            },
            { status: 500 }
        );
    }
}
