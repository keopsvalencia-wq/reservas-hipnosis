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

// Native SVGs for 100% reliability
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

export function ConfirmationStep({ data, onSubmit, onBack }: ConfirmationStepProps) {
    const [name, setName] = useState(data.fullName || '');
    const [email, setEmail] = useState(data.email || '');
    const [phone, setPhone] = useState(data.phone || '');
    const [ciudad, setCiudad] = useState((data.triageAnswers?.ciudad as string) || '');
    const [acceptPrivacy, setAcceptPrivacy] = useState(false);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const dateFormatted = data.date
        ? format(parse(data.date, 'yyyy-MM-dd', new Date()), "EEEE d 'de' MMMM", { locale: es })
        : '';

    const getWhatsAppUrl = () => {
        const nombreComp = name;
        const ciudadRes = ciudad || 'no especificada';
        const motivo = (data.triageAnswers?.motivo_consulta || data.triageAnswers?.motivo || 'motivo de consulta') as string;
        const dia = dateFormatted;
        const hora = data.time || '—';
        const ubiKey = data.location || 'online';

        const labels: Record<string, string> = {
            valencia: 'Sede Picanya (Presencial)',
            motilla: 'Sede Motilla (Presencial)',
            online: 'Online (Videollamada)',
        };

        const triggers: Record<string, string> = {
            valencia: '#SedePicanya',
            motilla: '#SedeMotilla',
            online: '#SedeOnline',
        };

        const ubicacion = labels[ubiKey];
        const trigger = triggers[ubiKey];

        // Emojis passados como puntos unicode (escapados) garantizan decodifición infalible
        const text = `\u{1F6A8} *NUEVA SOLICITUD DE EVALUACIÓN* \u{1F6A8}\n\nHola Salva, soy *${nombreComp}* de *${ciudadRes}*.\n*He agendado una sesión de evaluación contigo.*\n\n\u{1F4C5} *Día:* ${dia}\n\u{1F552} *Hora:* ${hora}\n\u{1F4CD} *Ubicación:* ${ubicacion}\n\u{1F9E0} *Motivo:* ${motivo}\n\n${trigger}\n(Ahora pulsa enviar para confirmar)`;

        return `https://wa.me/34656839568?text=${encodeURIComponent(text)}`;
    };

    const handleSubmit = async () => {
        if (!name || !email || !phone || !ciudad || !acceptPrivacy) {
            setError('Por favor, completa todos los campos para poder confirmar.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const formData = {
                ...data,
                fullName: name,
                email,
                phone,
                acceptPrivacy,
                triageAnswers: {
                    ...(data.triageAnswers || {}),
                    ciudad // Merge city so it enters properly
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
                onSubmit({ fullName: name, email, phone, acceptPrivacy });
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

                <div className="bg-gray-50/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-100 max-w-sm mx-auto w-full space-y-4 shadow-sm">
                    <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pb-2 border-b border-gray-200">
                        <span>Resumen cita</span>
                        <span className="text-green-600 font-bold">Pendiente confirmación</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm font-black text-[var(--color-secondary)]">
                        <IconCalendar />
                        <span className="text-left capitalize">{dateFormatted} a las {data.time}h</span>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 bg-gradient-to-t from-white via-white to-transparent">
                    <a
                        href={getWhatsAppUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary w-full bg-[#25D366] hover:bg-[#128C7E] text-white border-none text-base font-black shadow-xl shadow-green-100 py-6 transform transition-transform hover:scale-[1.02]"
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
                                Finalizar Reserva
                            </h3>
                            <p className="text-[var(--color-text-muted)] text-sm font-medium">
                                Completa tus datos para confirmar tu plaza de evaluación. La información que aportes es 100% confidencial.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nombre Completo */}
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500" htmlFor="name">
                                        Nombre Completo
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <IconPerson />
                                        </div>
                                        <input
                                            type="text"
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Tu nombre y apellidos"
                                            className="block w-full pl-10 pr-3 py-3.5 text-sm font-medium border-2 border-gray-100
                                                rounded-xl bg-gray-50/30 text-[var(--color-secondary)]
                                                placeholder-gray-400
                                                focus:bg-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-primary/10
                                                transition-all"
                                        />
                                    </div>
                                </div>
                                {/* Ciudad */}
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500" htmlFor="ciudad">
                                        Ciudad
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <IconCity />
                                        </div>
                                        <input
                                            type="text"
                                            id="ciudad"
                                            value={ciudad}
                                            onChange={(e) => setCiudad(e.target.value)}
                                            placeholder="¿En qué ciudad vives?"
                                            className="block w-full pl-10 pr-3 py-3.5 text-sm font-medium border-2 border-gray-100
                                                rounded-xl bg-gray-50/30 text-[var(--color-secondary)]
                                                placeholder-gray-400
                                                focus:bg-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-primary/10
                                                transition-all"
                                        />
                                    </div>
                                </div>
                                {/* WhatsApp */}
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500" htmlFor="phone">
                                        Teléfono/WhatsApp
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <IconPhone />
                                        </div>
                                        <input
                                            type="tel"
                                            id="phone"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="Móvil con WhatsApp"
                                            className="block w-full pl-10 pr-3 py-3.5 text-sm font-medium border-2 border-gray-100
                                                rounded-xl bg-gray-50/30 text-[var(--color-secondary)]
                                                placeholder-gray-400
                                                focus:bg-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-primary/10
                                                transition-all"
                                        />
                                    </div>
                                    <p className="text-[10px] text-[var(--color-text-muted)] font-medium mt-1.5 ml-1">
                                        Confirmaremos tu cita por WhatsApp.
                                    </p>
                                </div>
                                {/* Email */}
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500" htmlFor="email">
                                        Correo Electrónico
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <IconMail />
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="ejemplo@correo.com"
                                            className="block w-full pl-10 pr-3 py-3.5 text-sm font-medium border-2 border-gray-100
                                                rounded-xl bg-gray-50/30 text-[var(--color-secondary)]
                                                placeholder-gray-400
                                                focus:bg-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-primary/10
                                                transition-all"
                                        />
                                    </div>
                                    <p className="text-[10px] text-[var(--color-text-muted)] font-medium mt-1.5 ml-1">
                                        Para enviar el justificante de la Cita.
                                    </p>
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
                                <label className="flex items-center gap-4 cursor-pointer group mt-2">
                                    <input
                                        type="checkbox"
                                        checked={acceptPrivacy}
                                        onChange={(e) => setAcceptPrivacy(e.target.checked)}
                                        className="h-5 w-5 rounded-md border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] transition-all cursor-pointer"
                                    />
                                    <span className="text-xs text-[var(--color-text-muted)] leading-relaxed font-bold group-hover:text-[var(--color-secondary)] cursor-pointer">
                                        Tus datos son 100% seguros y acepto su tratamiento para contactar conmigo acerca de mi reserva.*
                                    </span>
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
                            disabled={!name || !email || !phone || !ciudad || !acceptPrivacy || isSubmitting}
                            className={`w-full sm:w-auto text-sm uppercase tracking-wider font-black py-4 px-8 rounded-full flex items-center justify-center gap-2 transition-all shadow-xl
                                ${name && email && phone && ciudad && acceptPrivacy && !isSubmitting
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
