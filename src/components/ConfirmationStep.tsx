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
            valencia: 'Picanya (Sede Presencial)',
            motilla: 'Motilla (Sede Presencial)',
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
            <div className="flex-1 flex flex-col justify-center text-center space-y-8 py-6">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto border-2 border-green-200"
                >
                    <span className="material-icons text-green-500 text-5xl">check_circle</span>
                </motion.div>

                <div className="space-y-3">
                    <h3 className="text-2xl md:text-3xl font-black text-[var(--color-secondary)]">¡Reserva Solicitada!</h3>
                    <p className="text-base text-[var(--color-text-muted)] font-medium max-w-sm mx-auto">
                        Para confirmar definitivamente, pulsa el botón de abajo y envíanos el mensaje por WhatsApp.
                    </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 max-w-sm mx-auto w-full space-y-3 shadow-sm">
                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <span>Cita agendada</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-black text-[var(--color-secondary)]">
                        <span className="material-icons-outlined text-[var(--color-primary)] text-lg">calendar_today</span>
                        <span>{formatDate(data.date)} a las {data.time}h</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-black text-[var(--color-secondary)]">
                        <span className="material-icons-outlined text-[var(--color-primary)] text-lg">location_on</span>
                        <span>{data.location ? LOCATION_LABELS[data.location] : '—'}</span>
                    </div>
                </div>

                <div className="step-layout__footer -mx-8 -mb-10">
                    <a
                        href={getWhatsAppUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary w-full bg-[#25D366] hover:bg-[#128C7E] text-white border-none text-base font-black shadow-lg shadow-green-200 py-5"
                    >
                        PASO FINAL: CONFIRMAR POR WHATSAPP
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-h-0">
            <div className="text-center space-y-2 mb-6">
                <h3 className="text-2xl font-black text-[var(--color-secondary)]">Resumen Final</h3>
                <p className="text-sm text-[var(--color-text-muted)]">Verifica que todos los datos son correctos.</p>
            </div>

            <div className="flex-1 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* COLUMNA IZQUIERDA: DATOS DE LA CITA */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)] mb-2">Datos de la Cita</h4>

                        <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex items-center gap-4 transition-all hover:bg-white hover:border-[var(--color-primary)] hover:shadow-md hover:shadow-primary/5">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                <span className="material-icons-outlined text-[var(--color-primary)]">calendar_month</span>
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] uppercase font-bold text-gray-400">Día y Hora</p>
                                <p className="text-sm font-black text-[var(--color-secondary)]">{formatDate(data.date)} — {data.time}h</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex items-center gap-4 transition-all hover:bg-white hover:border-[var(--color-primary)] hover:shadow-md hover:shadow-primary/5">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                <span className="material-icons-outlined text-[var(--color-primary)]">place</span>
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] uppercase font-bold text-gray-400">Ubicación</p>
                                <p className="text-sm font-black text-[var(--color-secondary)]">{data.location ? LOCATION_LABELS[data.location] : '—'}</p>
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: DATOS DEL CLIENTE */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)] mb-2">Tu Información</h4>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 border border-gray-100">
                                <span className="material-icons-outlined text-gray-400 text-sm">person</span>
                                <span className="text-sm font-bold text-[var(--color-secondary)]">{form.fullName}</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 border border-gray-100">
                                <span className="material-icons-outlined text-gray-400 text-sm">email</span>
                                <span className="text-sm font-bold text-[var(--color-secondary)]">{form.email}</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 border border-gray-100">
                                <span className="material-icons-outlined text-gray-400 text-sm">phone</span>
                                <span className="text-sm font-bold text-[var(--color-secondary)]">{form.phone}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 p-4 bg-amber-50/50 rounded-2xl border border-amber-100 flex gap-3 items-start">
                    <span className="material-icons text-amber-500 text-xl">info</span>
                    <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                        Al pulsar "Finalizar", recibirás un correo de confirmación. Tu cita quedará pendiente de validación vía WhatsApp en el siguiente paso.
                    </p>
                </div>

                <div className="mt-6 flex flex-col gap-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                checked={form.acceptPrivacy}
                                onChange={(e) => setForm((prev) => ({ ...prev, acceptPrivacy: e.target.checked }))}
                                className="h-5 w-5 rounded-md border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] transition-all cursor-pointer"
                            />
                        </div>
                        <span className="text-[11px] text-[var(--color-text-muted)] leading-relaxed font-bold group-hover:text-[var(--color-secondary)]">
                            He revisado mis datos y acepto la Política de Privacidad.*
                        </span>
                    </label>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-red-500 font-black text-center bg-red-50 p-3 rounded-xl border border-red-100"
                        >
                            {error}
                        </motion.p>
                    )}
                </div>
            </div>

            <div className="step-layout__footer -mx-8 -mb-10">
                <div className="flex items-center justify-between gap-4 w-full">
                    <button onClick={onBack} className="btn-back">Atrás</button>
                    <button
                        onClick={handleSubmit}
                        disabled={!form.acceptPrivacy || loading}
                        className="btn-primary flex-1 shadow-lg shadow-primary/20"
                    >
                        {loading ? 'SOLICITANDO...' : 'FINALIZAR RESERVA'}
                    </button>
                </div>
            </div>
        </div>
    );
}
