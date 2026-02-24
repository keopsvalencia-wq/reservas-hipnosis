'use client';

import { motion } from 'framer-motion';
import { Location } from '@/lib/types';
import { LOCATION_DESCRIPTIONS } from '@/lib/booking-rules';

interface LocationSelectorProps {
    onSelect: (location: Location) => void;
}

const locationCards: {
    id: Location;
    icon: string;
    color: string;
    title: string;
    subtitle: string;
    note?: string;
}[] = [
        {
            id: 'valencia',
            icon: 'apartment',
            color: '#0A2833',
            title: 'Presencial — Picanya (Valencia)',
            subtitle: 'C/ Torrent, 30, puerta 4',
        },
        {
            id: 'online',
            icon: 'videocam',
            color: '#39DCA8',
            title: 'Online — Videollamada',
            subtitle: 'Google Meet',
            note: 'No tienes que instalar nada. Te enviaré un enlace directo, solo tendrás que pulsar y entraremos a la sala.',
        },
        {
            id: 'motilla',
            icon: 'location_on',
            color: '#7C3AED',
            title: 'Presencial — Motilla del Palancar',
            subtitle: 'C/ San Isidro, 18',
        },
    ];

export function LocationSelector({ onSelect }: LocationSelectorProps) {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {locationCards.map((card, idx) => (
                    <motion.button
                        key={card.id}
                        onClick={() => onSelect(card.id)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.3 }}
                        className="group relative text-center p-8 rounded-2xl border-2 border-[var(--color-border)]
                            hover:border-[var(--color-primary)] hover:shadow-xl transition-all duration-300
                            bg-white flex flex-col items-center h-full"
                        whileHover={{ y: -5 }}
                    >
                        {/* Icon circle - Centered at top */}
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                            style={{ backgroundColor: card.color + '15' }}
                        >
                            <span
                                className="material-icons-outlined text-3xl"
                                style={{ color: card.color }}
                            >
                                {card.icon}
                            </span>
                        </div>

                        {/* Info - Full width vertical stack */}
                        <div className="flex-1 w-full space-y-2">
                            <h3 className="text-lg font-black text-[var(--color-secondary)] leading-tight">
                                {card.title}
                            </h3>
                            <p className="text-sm text-[var(--color-text-muted)] font-medium">
                                {card.subtitle}
                            </p>

                            {/* Google Meet note - Legible and wide */}
                            {card.note && (
                                <div className="mt-6 p-4 rounded-xl bg-[var(--color-primary-soft)] border border-[var(--color-primary)] border-opacity-10 text-left">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="material-icons-outlined text-[var(--color-primary)] text-lg">
                                            info
                                        </span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)]">Nota importante</span>
                                    </div>
                                    <p className="text-[13px] text-[var(--color-secondary)] leading-relaxed">
                                        {card.note}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Selection Indicator */}
                        <div className="mt-6 flex items-center gap-2 text-[var(--color-primary)] font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                            Seleccionar <span className="material-icons-outlined text-sm">arrow_forward</span>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
