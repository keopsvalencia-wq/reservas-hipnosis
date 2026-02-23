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
        <div className="space-y-5">
            <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-[var(--color-secondary)]">
                    ¿Dónde prefieres tu sesión?
                </h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                    Elige la modalidad que mejor se ajuste a ti
                </p>
            </div>

            <div className="grid gap-4">
                {locationCards.map((card, idx) => (
                    <motion.button
                        key={card.id}
                        onClick={() => onSelect(card.id)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.3 }}
                        className="group relative text-left p-5 rounded-xl border-2 border-[var(--color-border)]
                            hover:border-[var(--color-primary)] hover:shadow-lg transition-all duration-200
                            bg-[var(--color-bg-card)]"
                        whileHover={{ y: -2 }}
                    >
                        <div className="flex items-start gap-4">
                            {/* Icon circle */}
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: card.color + '18' }}
                            >
                                <span
                                    className="material-icons-outlined text-2xl"
                                    style={{ color: card.color }}
                                >
                                    {card.icon}
                                </span>
                            </div>
                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-[var(--color-secondary)]">
                                    {card.title}
                                </p>
                                <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
                                    {card.subtitle}
                                </p>
                                {/* Google Meet note */}
                                {card.note && (
                                    <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-[var(--color-primary-soft)] border border-[var(--color-primary)] border-opacity-20">
                                        <span className="material-icons-outlined text-[var(--color-primary)] text-[16px] mt-0.5 flex-shrink-0">
                                            info
                                        </span>
                                        <p className="text-xs text-[var(--color-secondary)] leading-relaxed">
                                            {card.note}
                                        </p>
                                    </div>
                                )}
                            </div>
                            {/* Arrow */}
                            <span className="material-icons-outlined text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity self-center">
                                arrow_forward
                            </span>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
