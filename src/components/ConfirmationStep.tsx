'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookingData } from '@/lib/types';
import { LOCATION_LABELS } from '@/lib/booking-rules';

interface ConfirmationStepProps {
    data: Partial<BookingData>;
    onSubmit: (info: { name: string; lastName: string; email: string; phone: string; acceptPrivacy: boolean }) => void;
    onBack: () => void;
}

export function ConfirmationStep({ data, onSubmit, onBack }: ConfirmationStepProps) {
    const [form, setForm] = useState({
        name: data.name || '',
        lastName: data.lastName || '',
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
        const nombre = form.name;
        const apellido = form.lastName || '';
        const ciudad = data.triageAnswers?.ciudad || 'tu ciudad';
        const motivo = data.triageAnswers?.motivo_consulta || 'mi motivo de consulta';
        const dia = formatDate(data.date);
        const hora = data.time || '—';
        const ubiKey = data.location || 'online';

        const labels: Record<string, string> = {
            valencia: 'Picanya',
            motilla: 'Motilla',
            online: 'Online',
        };

        const triggers: Record<string, string> = {
            valencia: '#SedePicanya',
            motilla: '#SedeMotilla',
            online: '#SedeOnline',
        };

        const ubicacion = labels[ubiKey];
        const trigger = triggers[ubiKey];

        const text = `🚨 *NUEVA SOLICITUD DE EVALUACIÓN* 🚨\n\nHola Salva, soy *${nombre} ${apellido}* de *${ciudad}*.\n*He agendado una sesión de evaluación contigo.*\n\n📍 *Ubicación:* ${ubicacion}\n🧠 *Motivo:* ${motivo}\n📅 *Cita:* ${dia} a las ${hora}\n\n${trigger}\n(Ahora pulsa enviar para confirmar)`;

        // encodeURIComponent handles \n correctly as %0A
        return `https://wa.me/34656839568?text=${encodeURIComponent(text)}`;
    };

    const handleSubmit = async () => {
        if (!form.name || !form.email || !form.phone || !form.acceptPrivacy) return;
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
                <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto border-2 border-green-100">
                    <span className="material-icons-outlined text-green-500 text-5xl">verified</span>
                </div>

                <div className="space-y-2">
                    <h3 className="text-2xl font-black text-[var(--color-secondary)]">¡Reserva Solicitada!</h3>
                    <p className="text-sm text-[var(--color-text-muted)] font-medium max-w-xs mx-auto">
                        Para confirmar definitivamente, pulsa el botón de abajo y envíanos el mensaje por WhatsApp.
                    </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 max-w-sm mx-auto w-full space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-[var(--color-secondary)]">
                        <span>Cita:</span>
                        <span>{formatDate(data.date)} a las {data.time}h</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-[var(--color-secondary)]">
                        <span>Sede:</span>
                        <span>{data.location ? LOCATION_LABELS[data.location] : '—'}</span>
                    </div>
                </div>

                <div className="step-layout__footer -mx-8 -mb-10">
                    <a
                        href={getWhatsAppUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary w-full bg-[#25D366] hover:bg-[#128C7E] text-white border-none text-base"
                    >
                        PULSAR AQUÍ PARA CONFIRMAR
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col justify-center space-y-6">
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-black text-[var(--color-secondary)]">Resumen Final</h3>
                <p className="text-sm text-[var(--color-text-muted)]">Verifica tu cita y finaliza el proceso.</p>
            </div>

            <div className="space-y-3">
                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex items-center gap-4">
                    <span className="material-icons-outlined text-[var(--color-primary)]">calendar_today</span>
                    <div className="text-left">
                        <p className="text-[10px] uppercase font-bold text-gray-400">Fecha y Hora</p>
                        <p className="text-sm font-bold text-[var(--color-secondary)]">{formatDate(data.date)} — {data.time}h</p>
                    </div>
                </div>
                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex items-center gap-4">
                    <span className="material-icons-outlined text-[var(--color-primary)]">location_on</span>
                    <div className="text-left">
                        <p className="text-[10px] uppercase font-bold text-gray-400">Ubicación</p>
                        <p className="text-sm font-bold text-[var(--color-secondary)]">{data.location ? LOCATION_LABELS[data.location] : '—'}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4 pt-4">
                <label className="flex items-start gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={form.acceptPrivacy}
                        onChange={(e) => setForm((prev) => ({ ...prev, acceptPrivacy: e.target.checked }))}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    />
                    <span className="text-[10px] text-[var(--color-text-muted)] leading-relaxed font-medium">
                        Acepto la Política de Privacidad y consiento el tratamiento de mis datos.*
                    </span>
                </label>

                {error && <p className="text-xs text-red-500 font-bold text-center">{error}</p>}
            </div>

            <div className="step-layout__footer -mx-8 -mb-10">
                <div className="flex items-center justify-between gap-4 w-full">
                    <button onClick={onBack} className="btn-back">Atrás</button>
                    <button
                        onClick={handleSubmit}
                        disabled={!form.acceptPrivacy || loading}
                        className="btn-primary flex-1"
                    >
                        {loading ? 'RESERVANDO...' : 'FINALIZAR RESERVA'}
                    </button>
                </div>
            </div>
        </div>
    );
}
