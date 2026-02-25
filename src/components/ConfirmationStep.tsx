'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingData, Location } from '@/lib/types';
import { LOCATION_LABELS, LOCATION_DESCRIPTIONS } from '@/lib/booking-rules';

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
            year: 'numeric',
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

        const text = `Hola Salva, soy ${nombre} ${apellido} de ${ciudad}. Mi motivo de consulta es: ${motivo}. He reservado para el ${dia} a las ${hora} en ${ubicacion}. ${trigger} (Ahora pulsa enviar para confirmar)`;
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
                body: JSON.stringify({
                    ...data,
                    ...form
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col flex-1 min-h-0 text-center"
            >
                <div className="flex-1 overflow-y-auto space-y-8 py-6 pr-1" style={{ scrollbarWidth: 'thin' }}>
                    <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4 border-2 border-green-100">
                        <span className="material-icons-outlined text-green-500 text-5xl">
                            verified
                        </span>
                    </div>

                    <div className="space-y-3 max-w-md mx-auto px-4">
                        <h3 className="text-3xl font-black text-[var(--color-secondary)] leading-tight">
                            Evaluación Completada con Éxito
                        </h3>
                        <div className="h-1.5 w-16 bg-green-500 mx-auto rounded-full" />
                    </div>

                    <div className="bg-white rounded-2xl border-2 border-gray-50 p-6 max-w-sm mx-auto shadow-sm space-y-4">
                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-full bg-[var(--color-primary-soft)] flex items-center justify-center">
                                <span className="material-icons-outlined text-[var(--color-primary)] text-sm">event</span>
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] uppercase font-bold text-gray-400">Fecha y Hora</p>
                                <p className="text-[var(--color-secondary)] font-bold">{formatDate(data.date)} — {data.time}h</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-full bg-[var(--color-primary-soft)] flex items-center justify-center">
                                <span className="material-icons-outlined text-[var(--color-primary)] text-sm">location_on</span>
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] uppercase font-bold text-gray-400">Ubicación</p>
                                <p className="text-[var(--color-secondary)] font-bold">{data.location ? LOCATION_LABELS[data.location] : '—'}</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-base text-[var(--color-text-muted)] leading-relaxed max-w-sm mx-auto px-4 font-medium">
                        Al pulsar, se abrirá tu WhatsApp con los datos de tu cita. <strong className="text-[var(--color-secondary)] font-bold">Solo tendrás que darle a enviar</strong> para que el sistema te envíe la ubicación y pasos a seguir automáticamente.
                    </p>
                </div>

                {/* ANCHORED FINAL ACTION */}
                <div className="flex-shrink-0 pt-6 pb-4">
                    <motion.a
                        href={getWhatsAppUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white py-5 px-6 rounded-2xl text-lg font-black uppercase tracking-wider shadow-lg shadow-green-200 transition-all w-full max-w-md mx-auto"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                            <path d="M12.031 6.172c-2.435 0-4.63 1.066-6.131 2.766-.151.171-.247.391-.252.628-.004.234.079.444.223.633l1.821 2.396-1.127 4.116c-.053.193.003.4.155.538.152.138.375.179.569.1l4.032-1.639 2.712 1.956c.171.124.385.181.599.16.214-.021.411-.122.553-.284l1.341-1.53c0 0 .16-.183.16-.482 0-.3-.16-.484-.16-.484l-2.022-2.316 1.765-2.016c.142-.162.22-.37.218-.588-.002-.19-.068-.37-.189-.512-1.501-1.761-3.696-2.827-6.131-2.827zm7.505 2.137c.36.452.569 1.02.571 1.636 0 1.25-.873 2.144-1.928 2.502l-1.048.354 1.18 1.353c.473.541.722 1.258.683 1.972-.038.711-.357 1.36-.889 1.815l-1.342 1.53c-.502.573-1.217.925-1.996.985-.145.011-.29.016-.434.016-.641 0-1.275-.233-1.78-.621l-2.735-1.973-2.313.94c-.459.186-.967.248-1.465.176-.499-.071-.973-.289-1.365-.623-.53-.453-.889-1.076-1.01-1.764l-.234-.855-.86.349c-.456.185-.96.246-1.455.175-.494-.07-.965-.285-1.353-.615a2.536 2.536 0 0 1-.955-1.999c0-.641.233-1.275.621-1.78l1.355-1.545c.162-.185.347-.361.55-.526-.065-.24-.099-.492-.099-.751 0-1.25.751-2.144 1.928-2.502l1.048-.354-1.18-1.353a2.535 2.535 0 0 1-.683-1.972c.038-.711.357-1.36.889-1.815l1.342-1.53a2.534 2.534 0 0 1 1.996-.985c.145-.011.29-.016.434-.016.643 0 1.277.234 1.782.622l2.735 1.973 2.313-.94c.459-.186.967-.248 1.465-.176.499.071.973.289 1.365.623.53.453.889 1.076 1.01 1.764l.234.855.86-.349c.456-.185.96-.246 1.455-.175.494-.07.965-.285 1.353-.615.361-.31.812-.477 1.276-.477.251 0 .504.05.744.151.725.305 1.284.876 1.574 1.606.289.728.293 1.535.013 2.269-.162.185-.347.361-.55.526.065.24.099.492.099.751z" />
                        </svg>
                        PULSA AQUÍ PARA CONFIRMAR Y RECIBIR LA INFO
                    </motion.a>
                    <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest font-bold">Reserva Segura • Salva Hipnosis</p>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="grid lg:grid-cols-5 gap-6">
            {/* ── Sidebar: resumen de reserva ── */}
            <div className="lg:col-span-2 order-2 lg:order-1">
                <div className="sticky top-6 rounded-xl border border-[var(--color-border)] bg-white overflow-hidden">
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
                                bg-white text-[var(--color-text)] placeholder-gray-400
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
                                bg-white text-[var(--color-text)] placeholder-gray-400
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
                                bg-white text-[var(--color-text)] placeholder-gray-400
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
