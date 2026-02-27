'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookingData, Location } from '@/lib/types';
import { LOCATION_LABELS } from '@/lib/booking-rules';
import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';

interface ConfirmationStepProps {
    data: Partial<BookingData>;
    onSubmit: (info: { fullName: string; email: string; phone: string; acceptPrivacy: boolean }) => void;
    onBack: () => void;
}

const IconCheck = () => (
    <svg className="w-12 h-12 text-[#25D366]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
    </svg>
);

const IconCalendar = () => (
    <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const IconLocation = () => (
    <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const IconPerson = () => (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const IconMail = () => (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const IconPhone = () => (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);

const IconCity = () => (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
);

import { triageQuestions } from '@/data/triage-questions';

const getTriageLabel = (questionId: string, value: string | undefined): string => {
    if (!value) return '---';
    const q = triageQuestions.find(q => q.id === questionId);
    if (q && q.options) {
        const option = q.options.find(o => o.value === String(value));
        return option ? option.label : String(value);
    }
    return String(value);
};

export function ConfirmationStep({ data, onSubmit, onBack }: ConfirmationStepProps) {
    const [acceptPrivacy, setAcceptPrivacy] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const dateFormatted = format(
        parse(data.date as string, 'yyyy-MM-dd', new Date()),
        "EEEE d 'de' MMMM",
        { locale: es }
    );

    const getWhatsAppUrl = () => {
        const adminPhone = process.env.NEXT_PUBLIC_ADMIN_PHONE || '34656839568';

        let mot = data.triageAnswers?.motivo_consulta || data.triageAnswers?.motivo || 'No especificado';
        if (typeof mot === 'string' && mot.includes('Otros') && data.triageAnswers?.motivo_otro) {
            mot = mot.replace('Otros', `Otros (${data.triageAnswers.motivo_otro})`);
        } else if (Array.isArray(mot)) {
            mot = mot.map(m => m === 'Otros' && data.triageAnswers?.motivo_otro ? `Otros (${data.triageAnswers.motivo_otro})` : m).join(', ');
        }

        const loc = LOCATION_LABELS[data.location as Location] || 'No especificada';
        const city = data.triageAnswers?.ciudad || '---';

        let hashtag = '';
        if (data.location === 'valencia') {
            hashtag = '#SedePicanya';
        } else if (data.location === 'motilla') {
            hashtag = '#SedeMotilla';
        } else if (data.location === 'online') {
            hashtag = '#SedeOnline';
        }

        const rawText = `NUEVA SOLICITUD DE EVALUACIÓN\n\nHola Salva, soy *${data.fullName}* de *${city}*.\n*He agendado una sesión de evaluación contigo.*\n\n- Día: ${dateFormatted}\n- Hora: ${data.time}\n- Ubicación: ${loc}\n- Motivo: ${mot}\n\n${hashtag}\n(Ahora pulsa enviar para confirmar)`;

        return `https://wa.me/${adminPhone}?text=${encodeURIComponent(rawText)}`;
    };

    const handleSubmit = async () => {
        if (!data.fullName || !data.email || !data.phone || !data.triageAnswers?.ciudad || !acceptPrivacy) {
            setError('Por favor, acepta la política de privacidad para poder confirmar.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const formData = {
                ...data, // includes fullName, email, phone from Step 8
                acceptPrivacy,
                triageAnswers: {
                    ...(data.triageAnswers || {})
                }
            };

            const res = await fetch('/api/booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await res.json();

            if (result.success) {
                setIsSuccess(true);
                onSubmit({ fullName: data.fullName!, email: data.email!, phone: data.phone!, acceptPrivacy });
            } else {
                setError(result.message || 'Error al procesar la reserva. Intenta de nuevo.');
            }
        } catch {
            setError('Error de conexión. Revisa tu internet y vuelve a intentarlo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ─── Success State (Paso Whatsapp Final) ──────────────────────────────
    if (isSuccess) {
        return (
            <div className="flex-1 flex flex-col justify-center text-center space-y-8 py-4 px-4 h-full relative">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 12 }}
                    className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mx-auto border-2 border-green-200 shadow-sm"
                >
                    <IconCheck />
                </motion.div>

                <div className="space-y-3">
                    <h3 className="text-2xl md:text-3xl font-black text-[var(--color-secondary)]">¡Reserva Solicitada!</h3>
                    <p className="text-base text-[var(--color-text-muted)] font-medium max-w-sm mx-auto leading-relaxed">
                        Para confirmar definitivamente, pulsa el botón de abajo y envíanos el mensaje por WhatsApp.
                    </p>
                </div>

                <div className="bg-gray-50/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-100 max-w-sm mx-auto w-full space-y-4 shadow-sm z-10 relative">
                    <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pb-2 border-b border-gray-200">
                        <span>Resumen cita</span>
                        <span className="text-green-600 font-bold">Pendiente confirmación</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm font-black text-[var(--color-secondary)]">
                        <IconCalendar />
                        <span className="text-left capitalize">{dateFormatted} a las {data.time}h</span>
                    </div>
                </div>

                <div className="mt-6">
                    <a
                        href={getWhatsAppUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary w-full max-w-sm mx-auto flex items-center justify-center bg-[#25D366] hover:bg-[#128C7E] text-white border-none text-base font-black shadow-xl shadow-green-100 py-6 transform transition-transform hover:scale-[1.02] z-20 relative"
                    >
                        PASO FINAL: ENVIAR WHATSAPP
                    </a>
                </div>
            </div>
        );
    }

    // ─── Stitch 2-Column Layout (Input fields directly here) ────────────
    return (
        <div className="flex-1 flex flex-col min-h-0 pl-1 pr-1 custom-scrollbar overflow-y-auto pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ─── Izquierda: Resumen de Cita ─── */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 lg:sticky lg:top-2">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)] flex items-center gap-2 mb-6">
                            <span className="w-4 h-[2px] bg-[var(--color-primary)] opacity-30" />
                            Resumen
                        </h3>
                        <div className="space-y-4">
                            <div className="pb-4 border-b border-[var(--color-border)]">
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Servicio</p>
                                <p className="text-[var(--color-secondary)] font-bold text-sm mt-1">Valoración Diagnóstica</p>
                                <span className="inline-block mt-1.5 text-[10px] px-2.5 py-1 bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-bold uppercase tracking-wider rounded-lg">
                                    45 MINUTOS
                                </span>
                            </div>
                            <div className="pb-4 border-b border-[var(--color-border)]">
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Profesional</p>
                                <p className="text-[var(--color-secondary)] font-bold text-sm mt-1">Salva Vera</p>
                                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Hipnoterapeuta Clínico</p>
                            </div>
                            <div className="pb-4 border-b border-[var(--color-border)]">
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Fecha y Hora</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <IconCalendar />
                                    <p className="text-[var(--color-secondary)] font-bold text-sm capitalize">{dateFormatted}</p>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <p className="text-[var(--color-secondary)] font-bold text-sm">{data.time}h</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Ubicación</p>
                                <div className="flex items-start gap-2 mt-2">
                                    <div className="shrink-0 mt-0.5"><IconLocation /></div>
                                    <p className="text-[var(--color-secondary)] font-bold text-sm leading-tight">
                                        {LOCATION_LABELS[data.location as Location] || 'No especificada'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── Derecha: Formulario Final ─── */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 md:p-8">
                        <div className="mb-8">
                            <h3 className="text-xl md:text-2xl font-black text-[var(--color-secondary)] mb-2">
                                Tus Datos
                            </h3>
                            <p className="text-[var(--color-text-muted)] text-sm font-medium">
                                Por favor, revisa que tus datos sean correctos antes de confirmar la cita.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nombre Completo */}
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Nombre Completo</label>
                                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-[var(--color-secondary)] flex items-center gap-3">
                                        <IconPerson />
                                        {data.fullName}
                                    </div>
                                </div>
                                {/* Ciudad */}
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Ciudad</label>
                                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-[var(--color-secondary)] flex items-center gap-3">
                                        <IconCity />
                                        {data.triageAnswers?.ciudad || 'No especificada'}
                                    </div>
                                </div>
                                {/* WhatsApp */}
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Teléfono/WhatsApp</label>
                                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-[var(--color-secondary)] flex items-center gap-3">
                                        <IconPhone />
                                        {data.phone}
                                    </div>
                                </div>
                                {/* Email */}
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Correo Electrónico</label>
                                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-[var(--color-secondary)] flex items-center gap-3">
                                        <IconMail />
                                        {data.email}
                                    </div>
                                </div>
                            </div>

                            {/* Alerta SMTP / Prev */}
                            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100 flex gap-3 items-start">
                                <span className="text-xl leading-none pt-0.5">📨</span>
                                <p className="text-[11px] text-amber-900 font-semibold leading-relaxed">
                                    Al pulsar "Confirmar Reserva", recibirás un correo y el paso final será la validación manual por WhatsApp obligatoria.
                                </p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <label className="flex items-start gap-4 cursor-pointer group mt-2 p-4 bg-red-50 hover:bg-red-100/50 border border-red-100 rounded-xl transition-colors">
                                    <div className="pt-0.5">
                                        <input
                                            type="checkbox"
                                            checked={acceptPrivacy}
                                            onChange={(e) => setAcceptPrivacy(e.target.checked)}
                                            className="h-6 w-6 rounded-md border-red-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] shadow-sm transition-all cursor-pointer"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-red-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            Paso Obligatorio
                                        </span>
                                        <span className="text-xs text-[var(--color-text-muted)] leading-relaxed font-bold group-hover:text-[var(--color-secondary)]">
                                            Marca esta casilla para aceptar la política de privacidad y poder pulsar el botón de continuar.*
                                        </span>
                                    </div>
                                </label>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 mt-2 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-600 flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        {error}
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-4">
                        <button
                            onClick={onBack}
                            disabled={isSubmitting}
                            className="flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-secondary)] font-bold transition-colors disabled:opacity-30 p-2"
                        >
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Volver atrás
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!data.fullName || !data.email || !data.phone || !data.triageAnswers?.ciudad || !acceptPrivacy || isSubmitting}
                            className={`w-full sm:w-auto text-sm uppercase tracking-wider font-black py-4 px-8 rounded-full flex items-center justify-center gap-2 transition-all shadow-xl
                                ${data.fullName && data.email && data.phone && data.triageAnswers?.ciudad && acceptPrivacy && !isSubmitting
                                    ? 'bg-[var(--color-primary)] hover:bg-[#2bc493] hover:scale-105 hover:shadow-primary/30 text-[var(--color-secondary)] border-none'
                                    : 'bg-gray-200 text-gray-400 shadow-none cursor-not-allowed border-none'}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-[var(--color-secondary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Procesando...
                                </>
                            ) : (
                                'Confirmar Reserva'
                            )}
                        </button>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-8 grid grid-cols-3 gap-2 opacity-60">
                        <div className="flex flex-col items-center gap-1 text-center">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            <span className="text-[9px] uppercase font-bold text-gray-400">Datos Seguros 100%</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-center border-l border-r border-gray-200">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                            <span className="text-[9px] uppercase font-bold text-gray-400">Verificado</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-center">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
                            <span className="text-[9px] uppercase font-bold text-gray-400">Garantía total</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
