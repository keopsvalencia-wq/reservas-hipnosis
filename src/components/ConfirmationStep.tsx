'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingData, Location } from '@/lib/types';
import { LOCATION_LABELS, LOCATION_DESCRIPTIONS } from '@/lib/booking-rules';

interface ConfirmationStepProps {
    data: Partial<BookingData>;
    onSubmit: (info: { name: string; email: string; phone: string; acceptPrivacy: boolean }) => void;
    onBack: () => void;
}

export function ConfirmationStep({ data, onSubmit, onBack }: ConfirmationStepProps) {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
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
            year: 'numeric',
        });
    };

    const handleSubmit = async () => {
        if (!form.name || !form.email || !form.phone || !form.acceptPrivacy) return;
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                }),
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
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-6"
            >
                <div className="w-20 h-20 rounded-full bg-[var(--color-primary-soft)] flex items-center justify-center mx-auto">
                    <span className="material-icons-outlined text-[var(--color-primary)] text-4xl">
                        check_circle
                    </span>
                </div>
                <div className="space-y-3 max-w-md mx-auto">
                    <h3 className="text-2xl font-bold text-[var(--color-secondary)]">
                        ¡Reserva Confirmada!
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                        Te he enviado un email de confirmación a <strong>{form.email}</strong> con todos los detalles.
                        Recibirás recordatorios 24h y 1h antes de tu sesión.
                    </p>
                </div>
                <div className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] p-5 max-w-sm mx-auto text-left space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="material-icons-outlined text-[var(--color-primary)] text-lg">event</span>
                        <span className="text-[var(--color-secondary)] font-medium">{formatDate(data.date)} — {data.time}h</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="material-icons-outlined text-[var(--color-primary)] text-lg">location_on</span>
                        <span className="text-[var(--color-text-muted)]">{data.location ? LOCATION_LABELS[data.location] : '—'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="material-icons-outlined text-[var(--color-primary)] text-lg">timer</span>
                        <span className="text-[var(--color-text-muted)]">45 minutos — Evaluación Diagnóstica</span>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="grid lg:grid-cols-5 gap-6">
            {/* ── Sidebar: resumen de reserva ── */}
            <div className="lg:col-span-2 order-2 lg:order-1">
                <div className="sticky top-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-hidden">
                    {/* Accent bar */}
                    <div className="h-1.5 bg-[var(--color-primary)]" />
                    <div className="p-5 space-y-5">
                        <h4 className="font-bold text-[var(--color-secondary)] text-sm uppercase tracking-wider">
                            Tu Reserva
                        </h4>

                        {/* Service */}
                        <div className="space-y-1">
                            <span className="text-xs text-[var(--color-text-muted)]">Servicio</span>
                            <div className="flex items-center gap-2">
                                <span className="material-icons-outlined text-[var(--color-primary)] text-lg">psychology</span>
                                <p className="text-sm font-medium text-[var(--color-secondary)]">
                                    Evaluación Diagnóstica
                                </p>
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="space-y-1">
                            <span className="text-xs text-[var(--color-text-muted)]">Duración</span>
                            <div className="flex items-center gap-2">
                                <span className="material-icons-outlined text-[var(--color-primary)] text-lg">timer</span>
                                <span className="text-sm font-medium text-[var(--color-secondary)]">45 minutos</span>
                            </div>
                        </div>

                        {/* Professional */}
                        <div className="space-y-1">
                            <span className="text-xs text-[var(--color-text-muted)]">Profesional</span>
                            <div className="flex items-center gap-2">
                                <span className="material-icons-outlined text-[var(--color-primary)] text-lg">person</span>
                                <span className="text-sm font-medium text-[var(--color-secondary)]">Salva Vera</span>
                            </div>
                        </div>

                        <hr className="border-[var(--color-border)]" />

                        {/* Date */}
                        <div className="space-y-1">
                            <span className="text-xs text-[var(--color-text-muted)]">Fecha y hora</span>
                            <div className="flex items-center gap-2">
                                <span className="material-icons-outlined text-[var(--color-primary)] text-lg">calendar_today</span>
                                <div>
                                    <p className="text-sm font-medium text-[var(--color-secondary)]">{formatDate(data.date)}</p>
                                    <p className="text-xs text-[var(--color-text-muted)]">{data.time}h</p>
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-1">
                            <span className="text-xs text-[var(--color-text-muted)]">Ubicación</span>
                            <div className="flex items-center gap-2">
                                <span className="material-icons-outlined text-[var(--color-primary)] text-lg">
                                    {data.location === 'online' ? 'videocam' : 'location_on'}
                                </span>
                                <div>
                                    <p className="text-sm font-medium text-[var(--color-secondary)]">
                                        {data.location ? LOCATION_LABELS[data.location] : '—'}
                                    </p>
                                    <p className="text-xs text-[var(--color-text-muted)]">
                                        {data.location ? LOCATION_DESCRIPTIONS[data.location] : ''}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Shield badge */}
                        <div className="bg-[var(--color-primary-soft)] rounded-lg p-3 flex items-start gap-2">
                            <span className="material-icons-outlined text-[var(--color-primary)] text-lg flex-shrink-0">
                                shield
                            </span>
                            <p className="text-xs text-[var(--color-secondary)] leading-relaxed">
                                Si no te puedo garantizar resultados, el coste de la visita será <strong>0€</strong>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Form: datos de contacto ── */}
            <div className="lg:col-span-3 order-1 lg:order-2 space-y-5">
                <div>
                    <h3 className="text-lg font-bold text-[var(--color-secondary)]">
                        Datos de contacto
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">
                        Completa tus datos para confirmar la reserva
                    </p>
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[var(--color-secondary)]">
                        Nombre y Apellidos *
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons-outlined text-[var(--color-text-muted)] text-lg">
                            person
                        </span>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Tu nombre completo"
                            className="w-full pl-10 pr-4 py-3 text-sm border-2 border-[var(--color-border)] rounded-xl
                                bg-[var(--color-bg-card)] text-[var(--color-text)] placeholder-gray-400
                                focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]
                                transition-colors"
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[var(--color-secondary)]">
                        Email *
                    </label>
                    <p className="text-xs text-[var(--color-text-muted)]">
                        Para enviarte la confirmación y el enlace si es online
                    </p>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons-outlined text-[var(--color-text-muted)] text-lg">
                            email
                        </span>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                            placeholder="tu@email.com"
                            className="w-full pl-10 pr-4 py-3 text-sm border-2 border-[var(--color-border)] rounded-xl
                                bg-[var(--color-bg-card)] text-[var(--color-text)] placeholder-gray-400
                                focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]
                                transition-colors"
                        />
                    </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[var(--color-secondary)]">
                        Teléfono (WhatsApp) *
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons-outlined text-[var(--color-text-muted)] text-lg">
                            phone
                        </span>
                        <input
                            type="tel"
                            value={form.phone}
                            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                            placeholder="+34 600 000 000"
                            className="w-full pl-10 pr-4 py-3 text-sm border-2 border-[var(--color-border)] rounded-xl
                                bg-[var(--color-bg-card)] text-[var(--color-text)] placeholder-gray-400
                                focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]
                                transition-colors"
                        />
                    </div>
                </div>

                {/* Privacy */}
                <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex-shrink-0 mt-0.5">
                        <input
                            type="checkbox"
                            checked={form.acceptPrivacy}
                            onChange={(e) => setForm((prev) => ({ ...prev, acceptPrivacy: e.target.checked }))}
                            className="sr-only peer"
                        />
                        <div className="w-5 h-5 rounded border-2 border-[var(--color-border)]
                            peer-checked:bg-[var(--color-primary)] peer-checked:border-[var(--color-primary)]
                            flex items-center justify-center transition-colors">
                            {form.acceptPrivacy && (
                                <span className="material-icons-outlined text-white text-[14px]">check</span>
                            )}
                        </div>
                    </div>
                    <span className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                        Acepto la <a href="#" className="text-[var(--color-primary)] hover:underline">Política de Privacidad</a> y
                        consiento el tratamiento de mis datos para gestionar mi reserva.*
                    </span>
                </label>

                {/* Error */}
                {error && (
                    <div className="flex items-center gap-2 text-sm text-[var(--color-error)] bg-red-50 border border-red-200 rounded-xl p-3">
                        <span className="material-icons-outlined text-lg">error</span>
                        {error}
                    </div>
                )}

                {/* Submit */}
                <motion.button
                    onClick={handleSubmit}
                    disabled={!form.name || !form.email || !form.phone || !form.acceptPrivacy || loading}
                    className="btn-primary w-full text-base py-4 justify-center"
                    whileTap={{ scale: 0.98 }}
                >
                    {loading ? (
                        <>
                            <span className="material-icons-outlined animate-spin text-lg">hourglass_empty</span>
                            Confirmando...
                        </>
                    ) : (
                        <>
                            <span className="material-icons-outlined text-lg">lock</span>
                            Finalizar y Reservar mi Plaza
                        </>
                    )}
                </motion.button>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-6 pt-2">
                    {[
                        { icon: 'verified_user', text: 'Datos protegidos' },
                        { icon: 'schedule', text: 'Cancela gratis' },
                        { icon: 'shield', text: 'Garantía 0€' },
                    ].map((badge) => (
                        <div key={badge.icon} className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
                            <span className="material-icons-outlined text-[var(--color-primary)] text-[14px]">
                                {badge.icon}
                            </span>
                            {badge.text}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
