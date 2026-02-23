'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookingData, Location } from '@/lib/types';
import { LOCATION_LABELS } from '@/lib/booking-rules';
import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';

interface ConfirmationStepProps {
    bookingData: Partial<BookingData>;
    onSubmit: (data: BookingData) => void;
    onBack: () => void;
}

export function ConfirmationStep({ bookingData, onSubmit, onBack }: ConfirmationStepProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [acceptPrivacy, setAcceptPrivacy] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const dateFormatted = bookingData.date
        ? format(parse(bookingData.date!, 'yyyy-MM-dd', new Date()), "EEEE d 'de' MMMM 'de' yyyy", { locale: es })
        : '';

    const handleSubmit = async () => {
        if (!name || !email || !phone || !acceptPrivacy) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const fullData: BookingData = {
                ...(bookingData as BookingData),
                name,
                email,
                phone,
                acceptPrivacy,
            };

            const res = await fetch('/api/booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fullData),
            });

            const result = await res.json();

            if (result.success) {
                setIsSuccess(true);
                onSubmit(fullData);
            } else {
                setError(result.message || 'Error al procesar la reserva');
            }
        } catch {
            setError('Error de conexión. Inténtalo de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ─── Success State ─────────────────────────────────
    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-8"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto"
                >
                    <span className="material-icons-outlined text-[var(--color-success)] text-5xl">check_circle</span>
                </motion.div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-[var(--color-secondary)]">¡Reserva confirmada!</h3>
                    <p className="text-sm text-[var(--color-text-muted)]">
                        Hemos enviado un email de confirmación a{' '}
                        <strong className="text-[var(--color-text)]">{email}</strong>
                    </p>
                </div>
                <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-5 text-left space-y-3 max-w-sm mx-auto shadow-sm">
                    <div className="flex items-center gap-3 text-sm">
                        <span className="material-icons-outlined text-[var(--color-primary)] text-lg">calendar_today</span>
                        <span className="capitalize">{dateFormatted}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <span className="material-icons-outlined text-[var(--color-primary)] text-lg">schedule</span>
                        <span>{bookingData.time}h (45 min)</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <span className="material-icons-outlined text-[var(--color-primary)] text-lg">location_on</span>
                        <span>{LOCATION_LABELS[bookingData.location as Location]}</span>
                    </div>
                </div>
                <p className="text-xs text-[var(--color-text-muted)]">
                    Si necesitas cancelar o modificar, contacta por{' '}
                    <a
                        href="https://wa.me/34600000000"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-primary)] hover:underline font-medium"
                    >
                        WhatsApp
                    </a>
                </p>
            </motion.div>
        );
    }

    // ─── Stitch 2-Column Layout ──────────────────────────
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ─── Left sidebar: Booking Summary ─── */}
                <div className="lg:col-span-1">
                    <div className="bg-[var(--color-bg-card)] rounded-xl shadow-lg border-t-4 border-[var(--color-primary)] p-6 lg:sticky lg:top-24">
                        <h3 className="text-lg font-bold text-[var(--color-secondary)] mb-4 flex items-center gap-2">
                            <span className="material-icons-outlined text-[var(--color-primary)]">receipt_long</span>
                            Resumen
                        </h3>
                        <div className="space-y-4">
                            <div className="pb-4 border-b border-[var(--color-border)]">
                                <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">Servicio</p>
                                <p className="text-[var(--color-text)] font-medium mt-1">Valoración Diagnóstica</p>
                                <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-[var(--color-primary-soft)] text-[var(--color-primary)] rounded-full font-medium">
                                    45 min
                                </span>
                            </div>
                            <div className="pb-4 border-b border-[var(--color-border)]">
                                <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">Profesional</p>
                                <p className="text-[var(--color-text)] font-medium mt-1">Salva Vera</p>
                                <p className="text-xs text-[var(--color-text-muted)]">Hipnoterapeuta Clínico</p>
                            </div>
                            <div className="pb-4 border-b border-[var(--color-border)]">
                                <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">Fecha y Hora</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="material-icons-outlined text-[var(--color-primary)] text-sm">calendar_today</span>
                                    <p className="text-[var(--color-text)] font-medium capitalize">{dateFormatted}</p>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="material-icons-outlined text-[var(--color-primary)] text-sm">schedule</span>
                                    <p className="text-[var(--color-text)] font-medium">{bookingData.time}h</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">Ubicación</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="material-icons-outlined text-[var(--color-primary)] text-sm">location_on</span>
                                    <p className="text-[var(--color-text)] font-medium">
                                        {LOCATION_LABELS[bookingData.location as Location]}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── Right: Form ─── */}
                <div className="lg:col-span-2">
                    <div className="bg-[var(--color-bg-card)] rounded-xl shadow-lg p-6 md:p-8">
                        <div className="mb-6">
                            <h3 className="text-xl md:text-2xl font-bold text-[var(--color-secondary)] mb-2">
                                Finalizar Reserva
                            </h3>
                            <p className="text-[var(--color-text-muted)] text-sm">
                                Completa tus datos para confirmar la cita. Tu información es confidencial.
                            </p>
                        </div>

                        <div className="space-y-5">
                            {/* Name + Phone Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-[var(--color-text)]" htmlFor="name">
                                        Nombre Completo
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="material-icons-outlined text-gray-400 text-lg">person</span>
                                        </div>
                                        <input
                                            type="text"
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Ej. Juan Pérez"
                                            className="block w-full pl-10 pr-3 py-3 text-sm border border-[var(--color-border)]
                                                rounded-lg bg-[var(--color-bg)] text-[var(--color-text)]
                                                placeholder-gray-400
                                                focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]
                                                transition-colors"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-[var(--color-text)]" htmlFor="phone">
                                        Teléfono
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="material-icons-outlined text-gray-400 text-lg">phone</span>
                                        </div>
                                        <input
                                            type="tel"
                                            id="phone"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+34 600 000 000"
                                            className="block w-full pl-10 pr-3 py-3 text-sm border border-[var(--color-border)]
                                                rounded-lg bg-[var(--color-bg)] text-[var(--color-text)]
                                                placeholder-gray-400
                                                focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]
                                                transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-[var(--color-text)]" htmlFor="email">
                                    Correo Electrónico
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-icons-outlined text-gray-400 text-lg">email</span>
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="ejemplo@correo.com"
                                        className="block w-full pl-10 pr-3 py-3 text-sm border border-[var(--color-border)]
                                            rounded-lg bg-[var(--color-bg)] text-[var(--color-text)]
                                            placeholder-gray-400
                                            focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]
                                            transition-colors"
                                    />
                                </div>
                                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                                    Te enviaremos la confirmación a este correo.
                                </p>
                            </div>

                            {/* Privacy Checkbox */}
                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    id="privacy"
                                    checked={acceptPrivacy}
                                    onChange={(e) => setAcceptPrivacy(e.target.checked)}
                                    className="mt-1 h-4 w-4 text-[var(--color-primary)] border-gray-300 rounded cursor-pointer
                                        focus:ring-[var(--color-primary)]"
                                />
                                <label htmlFor="privacy" className="text-sm text-[var(--color-text-muted)] cursor-pointer">
                                    <span className="font-medium text-[var(--color-text)]">Acepto la política de privacidad</span>
                                    <br />
                                    <span className="text-xs">
                                        Tus datos serán tratados con estricta confidencialidad según nuestra política de protección de datos.
                                    </span>
                                </label>
                            </div>

                            {/* Error */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-[var(--color-error)]"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {/* Navigation */}
                            <div className="pt-4 flex flex-col-reverse sm:flex-row justify-between items-center gap-4 border-t border-[var(--color-border)]">
                                <button
                                    onClick={onBack}
                                    disabled={isSubmitting}
                                    className="flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-secondary)] font-medium transition-colors disabled:opacity-30"
                                >
                                    <span className="material-icons-outlined text-sm mr-1">arrow_back</span>
                                    Volver atrás
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!name || !email || !phone || !acceptPrivacy || isSubmitting}
                                    className="btn-primary w-full sm:w-auto text-base"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="material-icons-outlined animate-spin text-lg">refresh</span>
                                            Procesando...
                                        </>
                                    ) : (
                                        <>
                                            Confirmar Reserva
                                            <span className="material-icons-outlined text-lg">check_circle</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Trust Badges (Stitch style) */}
                    <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                        <div className="flex flex-col items-center gap-2">
                            <span className="material-icons-outlined text-gray-400 text-3xl">lock</span>
                            <span className="text-xs text-[var(--color-text-muted)] font-medium">Datos Seguros 100%</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="material-icons-outlined text-gray-400 text-3xl">verified</span>
                            <span className="text-xs text-[var(--color-text-muted)] font-medium">Profesional Certificado</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="material-icons-outlined text-gray-400 text-3xl">thumb_up</span>
                            <span className="text-xs text-[var(--color-text-muted)] font-medium">Satisfacción Garantizada</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
