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

        if (hasGoogleCredentials) {
            console.log('📅 Reintentando Google Calendar para:', data.date, data.time);
            const isAvailable = await checkAvailability(data.date, data.time);
            if (!isAvailable) {
                return NextResponse.json(
                    { success: false, message: 'Lo sentimos, este horario ya no está disponible. Por favor, elige otro.' },
                    { status: 409 }
                );
            }

            // Create calendar event
            eventId = await createCalendarEvent({
                name: data.name,
                email: data.email,
                phone: data.phone,
                date: data.date,
                time: data.time,
                location: data.location,
                motivo: data.triageAnswers?.motivo as string,
            });
        } else {
            // Mock mode: generate fake event ID
            eventId = `mock_${Date.now()}`;
            console.log('⚠️  Google Calendar no configurado. Modo mock activo.');
            console.log('📋 Datos de la reserva:', JSON.stringify(data, null, 2));
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
            motivo: data.triageAnswers?.motivo as string,
        };

        const hasSmtpCredentials = process.env.SMTP_USER && process.env.SMTP_PASS;

        if (hasSmtpCredentials) {
            await Promise.all([
                sendPatientConfirmation(emailData),
                sendTherapistNotification(emailData),
            ]);
        } else {
            console.log('⚠️  SMTP no configurado. Emails no enviados.');
            console.log('📧 Email al paciente:', data.email);
            console.log('📧 Email al terapeuta:', process.env.NOTIFICATION_EMAIL || 'no configurado');
        }

        // ─── Success ─────────────────────────────────
        return NextResponse.json({
            success: true,
            eventId,
            message: 'Reserva confirmada correctamente',
        });
    } catch (error: any) {
        console.error('❌ ERROR CRÍTICO EN /api/booking:', {
            message: error.message,
            stack: error.stack,
            cause: error.cause
        });
        return NextResponse.json(
            {
                success: false,
                message: 'Error interno del servidor. Inténtalo de nuevo o contacta por WhatsApp.',
            },
            { status: 500 }
        );
    }
}
