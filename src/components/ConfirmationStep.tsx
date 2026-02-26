'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookingData } from '@/lib/types';
import { LOCATION_LABELS } from '@/lib/booking-rules';

interface ConfirmationStepProps {
    data: Partial<BookingData>;
    onSubmit: (info: { fullName: string; email: string; phone: string; acceptPrivacy: boolean }) => void;
    onBack: () => void;
}

// Native SVGs for 100% reliability
const IconCheck = () => (
    <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
    </svg>
);

const IconCalendar = () => (
    <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const IconLocation = () => (
    <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const IconPerson = () => (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const IconMail = () => (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const IconPhone = () => (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);

export function ConfirmationStep({ data, onSubmit, onBack }: ConfirmationStepProps) {
    const [form, setForm] = useState({
        fullName: data.fullName || '',
        email: data.email || '',
        phone: data.phone || '',
        acceptPrivacy: false,
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '—';
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        });
    };

    const getWhatsAppUrl = () => {
        const nombreComp = form.fullName;
        const ciudad = (data.triageAnswers?.ciudad || 'tu ciudad') as string;
        const motivo = (data.triageAnswers?.motivo_consulta || data.triageAnswers?.motivo || 'mi motivo de consulta') as string;
        const dia = formatDate(data.date);
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

        const text = `🚨 *NUEVA SOLICITUD DE EVALUACIÓN* 🚨\n\nHola Salva, soy *${nombreComp}* de *${ciudad}*.\n*He agendado una sesión de evaluación contigo.*\n\n📅 *Día:* ${dia}\n🕒 *Hora:* ${hora}\n📍 *Ubicación:* ${ubicacion}\n🧠 *Motivo:* ${motivo}\n\n${trigger}\n(Ahora pulsa enviar para confirmar)`;

        return `https://wa.me/34656839568?text=${encodeURIComponent(text)}`;
    };

    const handleSubmit = async () => {
        if (!form.fullName || !form.email || !form.phone || !form.acceptPrivacy) return;
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, ...form }),
            });
            const result = await res.json();
            if (result.success) {
                setSubmitted(true);
            } else {
                setError(result.message || 'Error al crear la reserva');
            }
        } catch {
            setError('Error de conexión. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="flex-1 flex flex-col justify-center text-center space-y-8 py-4">
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
                        <span className="text-left">{formatDate(data.date)} a las {data.time}h</span>
                    </div>
                </div>

                <div className="step-layout__footer -mx-8 -mb-10">
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

    return (
        <div className="flex-1 flex flex-col min-h-0">
            <div className="text-center space-y-2 mb-8">
                <h3 className="text-2xl font-black text-[var(--color-secondary)]">Resumen Final</h3>
                <p className="text-sm text-[var(--color-text-muted)] font-medium">Verifica tu cita antes de solicitar la reserva.</p>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar pb-6">
                <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8 mx-auto w-full border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                        {/* CITA (IZQUIERDA) */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)] flex items-center gap-2">
                                <span className="w-4 h-[2px] bg-[var(--color-primary)] opacity-30" />
                                Tu Cita
                            </h4>

                            <div className="space-y-3">
                                <div className="p-5 rounded-3xl border-2 border-transparent bg-gray-50/50 flex items-center gap-4 transition-all hover:bg-white hover:border-[var(--color-primary)] hover:shadow-lg hover:shadow-primary/5 group">
                                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <IconCalendar />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Fecha y Hora</p>
                                        <p className="text-sm font-black text-[var(--color-secondary)] leading-tight">{formatDate(data.date)}<br />{data.time}h</p>
                                    </div>
                                </div>

                                <div className="p-5 rounded-3xl border-2 border-transparent bg-gray-50/50 flex items-center gap-4 transition-all hover:bg-white hover:border-[var(--color-primary)] hover:shadow-lg hover:shadow-primary/5 group">
                                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <IconLocation />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Lugar</p>
                                        <p className="text-sm font-black text-[var(--color-secondary)] leading-tight">{data.location ? LOCATION_LABELS[data.location] : '—'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* DATOS (DERECHA) */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)] flex items-center gap-2">
                                <span className="w-4 h-[2px] bg-[var(--color-primary)] opacity-30" />
                                Tus Datos
                            </h4>

                            <div className="space-y-2.5">
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm transition-all hover:border-gray-200">
                                    <div className="shrink-0"><IconPerson /></div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] uppercase font-bold text-gray-400">Nombre Completo</span>
                                        <span className="text-sm font-bold text-[var(--color-secondary)]">{form.fullName}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm transition-all hover:border-gray-200">
                                    <div className="shrink-0">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] uppercase font-bold text-gray-400">Ciudad</span>
                                        <span className="text-sm font-bold text-[var(--color-secondary)]">{(data.triageAnswers?.ciudad as string) || 'No especificada'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm transition-all hover:border-gray-200">
                                    <div className="shrink-0"><IconMail /></div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] uppercase font-bold text-gray-400">Email</span>
                                        <span className="text-sm font-bold text-[var(--color-secondary)]">{form.email}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm transition-all hover:border-gray-200">
                                    <div className="shrink-0"><IconPhone /></div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] uppercase font-bold text-gray-400">Teléfono/WhatsApp</span>
                                        <span className="text-sm font-bold text-[var(--color-secondary)]">{form.phone}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-5 bg-amber-50/40 rounded-3xl border border-amber-100/50 flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                            <span className="text-xl">📧</span>
                        </div>
                        <p className="text-[11px] text-amber-900 leading-relaxed font-semibold text-left">
                            Al pulsar "Finalizar", recibirás una confirmación inmediata por email. Asegúrate de tener acceso a {form.email}.
                        </p>
                    </div>

                    <div className="mt-8 flex flex-col gap-5 pb-4">
                        <label className="flex items-center gap-4 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={form.acceptPrivacy}
                                onChange={(e) => setForm((prev) => ({ ...prev, acceptPrivacy: e.target.checked }))}
                                className="h-6 w-6 rounded-lg border-2 border-gray-200 text-[var(--color-primary)] focus:ring-[var(--color-primary)] transition-all cursor-pointer"
                            />
                            <span className="text-[11px] md:text-xs text-[var(--color-text-muted)] leading-relaxed font-bold group-hover:text-[var(--color-secondary)] text-left transition-colors">
                                Confirmo que mis datos son correctos y acepto la Política de Privacidad.*
                            </span>
                        </label>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-red-50 text-red-600 text-xs font-black p-4 rounded-2xl border-2 border-red-100 flex items-center gap-3"
                            >
                                <span className="material-icons-outlined text-sm">error</span>
                                {error}
                            </motion.div>
                        )}
                    </div>
                </div>

                <div className="step-layout__footer -mx-8 -mb-10">
                    <div className="flex items-center justify-between gap-4 w-full">
                        <button onClick={onBack} className="btn-back">Atrás</button>
                        <button
                            onClick={handleSubmit}
                            disabled={!form.acceptPrivacy || loading}
                            className="btn-primary flex-1 shadow-2xl shadow-primary/20 hover:shadow-primary/30 py-5"
                        >
                            {loading ? 'RESERVANDO...' : 'SOLICITAR SESIÓN'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
