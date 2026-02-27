import { NextResponse } from 'next/server';
import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import { BookingData } from '@/lib/types';
import { LOCATION_LABELS } from '@/lib/booking-rules';
import { checkAvailability, createCalendarEvent } from '@/lib/google-calendar';
import { sendPatientConfirmation, sendTherapistNotification } from '@/lib/mailer';
import { triageQuestions } from '@/data/triage-questions';

export async function POST(request: Request) {
    try {
        const data: BookingData = await request.json();

        // ─── Validation ──────────────────────────────
        if (!data.fullName || !data.email || !data.phone || !data.date || !data.time || !data.location) {
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

        const parseTriageValue = (val: any) => Array.isArray(val) ? val.join(', ') : String(val || '');

        const parseTriageLabel = (questionId: string, val: any) => {
            const raw = parseTriageValue(val);
            if (!raw) return '';
            const q = triageQuestions.find(q => q.id === questionId);
            if (!q || !q.options) return raw;

            if (Array.isArray(val)) {
                return val.map(v => {
                    const opt = q.options?.find(o => o.value === String(v));
                    return opt ? opt.label : String(v);
                }).join(', ');
            } else {
                const opt = q.options.find(o => o.value === String(val));
                return opt ? opt.label : raw;
            }
        };

        const dedicacion = parseTriageValue(triage.dedicacion);
        const edad = parseTriageLabel('edad', triage.edad);

        // Handling 'motivo_otro' 
        let rawMotivo = parseTriageValue(triage.motivo_consulta || triage.motivo);
        if (rawMotivo.includes('Otros') && triage.motivo_otro) {
            rawMotivo = rawMotivo.replace('Otros', `Otros (${triage.motivo_otro})`);
        }
        const motivo = rawMotivo;

        // Handling 'impacto_otro'
        let rawImpacto = parseTriageValue(triage.impacto_emocional);
        if (rawImpacto.includes('Otro miedo diferente') && triage.impacto_otro) {
            rawImpacto = rawImpacto.replace('Otro miedo diferente', `Otro (${triage.impacto_otro})`);
        }
        const impacto_emocional = rawImpacto;

        const compromiso = parseTriageLabel('compromiso_escala', triage.compromiso_escala || triage.compromiso);
        const tiempo = parseTriageLabel('disponibilidad_tiempo', triage.disponibilidad_tiempo);
        const inversion = parseTriageLabel('inversion', triage.inversion);
        const ciudad = parseTriageValue(triage.ciudad);

        // Handling Tags & text for situacion_actual and deseada
        const actTags = parseTriageValue(triage.situacion_tags);
        const actText = parseTriageValue(triage.situacion_actual);
        const situacion_actual = [actTags, actText].filter(Boolean).join('.\nAmpliación: ');

        const desTags = parseTriageValue(triage.situacion_deseada_tags);
        const desText = parseTriageValue(triage.situacion_deseada);
        const situacion_deseada = [desTags, desText].filter(Boolean).join('.\nAmpliación: ');

        if (!hasGoogleCredentials) {
            return NextResponse.json(
                { success: false, message: 'Falta configurar las variables de entorno de Google Calendar en Vercel (GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_CALENDAR_ID).' },
                { status: 500 }
            );
        }

        try {
            const isAvailable = await checkAvailability(data.date, data.time);
            if (!isAvailable) {
                return NextResponse.json(
                    { success: false, message: 'Lo sentimos, este horario ya no está disponible.' },
                    { status: 409 }
                );
            }

            eventId = await createCalendarEvent({
                fullName: data.fullName,
                email: data.email,
                phone: data.phone,
                date: data.date,
                time: data.time,
                location: data.location,
                triageInfo: {
                    dedicacion,
                    edad,
                    motivo,
                    impacto_emocional,
                    compromiso,
                    tiempo,
                    inversion,
                    ciudad,
                    situacion_actual,
                    situacion_deseada
                }
            });
            console.log('✅ Evento creado en GCalendar:', eventId);
        } catch (calErr: any) {
            console.error('❌ Error en Google Calendar:', calErr.message);
            return NextResponse.json(
                { success: false, message: `Error GCalendar: ${calErr.message}. Verifica los permisos y el formato de la Private Key en Vercel.` },
                { status: 500 }
            );
        }

        // ─── Send emails ─────────────────────────────
        const dateFormatted = format(
            parse(data.date, 'yyyy-MM-dd', new Date()),
            "EEEE d 'de' MMMM 'de' yyyy",
            { locale: es }
        );

        const locationLabel = LOCATION_LABELS[data.location] || data.location;

        const emailData = {
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            date: dateFormatted,
            time: data.time,
            location: locationLabel,
            dedicacion,
            edad,
            motivo,
            impacto_emocional,
            compromiso,
            tiempo,
            inversion,
            ciudad,
            situacion_actual,
            situacion_deseada
        };

        try {
            // Enviamos correos sin chequear env (están hardcodeados en mailer.ts para este proyecto)
            await Promise.all([
                sendPatientConfirmation(emailData),
                sendTherapistNotification(emailData),
            ]);
            console.log('📧 Emails enviados correctamente');
        } catch (mailErr: any) {
            console.error('⚠️ Error enviando emails (pero reserva creada):', mailErr.message);
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
