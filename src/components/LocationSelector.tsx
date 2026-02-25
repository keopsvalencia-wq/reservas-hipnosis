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
        <div className="max-w-2xl mx-auto space-y-4">
            {locationCards.map((card, idx) => (
                <motion.button
                    key={card.id}
                    onClick={() => onSelect(card.id)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.3 }}
                    className="group w-full text-left p-5 rounded-2xl border-2 border-[var(--color-border)]
                        hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] 
                        transition-all duration-300 bg-white relative overflow-hidden"
                    whileHover={{ x: 6 }}
                >
                    <div className="flex items-center gap-6">
                        {/* Icon - Circular like in Stitch's design */}
                        <div
                            className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                            style={{ backgroundColor: card.color + '15' }}
                        >
                            <span
                                className="material-icons-outlined text-2xl"
                                style={{ color: card.color }}
                            >
                                {card.icon}
                            </span>
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-black text-[var(--color-secondary)]">
                                {card.title}
                            </h3>
                            <p className="text-sm text-[var(--color-text-muted)] font-medium mt-0.5">
                                {card.subtitle}
                            </p>

                            {/* Note for Online - Integrated as a clean sub-text */}
                            {card.note && (
                                <div className="mt-3 flex items-start gap-2 text-left">
                                    <span className="material-icons-outlined text-[var(--color-primary)] text-sm mt-0.5">
                                        auto_awesome
                                    </span>
                                    <p className="text-[13px] text-[var(--color-secondary)] leading-tight opacity-80 italic">
                                        {card.note}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Arrow - Subtle indicator */}
                        <div className="hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                            <span className="material-icons-outlined text-[var(--color-primary)] text-2xl">
                                chevron_right
                            </span>
                        </div>
                    </div>
                </motion.button>
            ))}
        </div>
    );
}
