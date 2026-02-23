'use client';

import { motion } from 'framer-motion';
import { Location } from '@/lib/types';
import { LOCATION_LABELS, LOCATION_DESCRIPTIONS } from '@/lib/booking-rules';

interface LocationSelectorProps {
    onSelect: (location: Location) => void;
    preselect?: 'presencial' | 'online' | 'sin_preferencia';
}

const locationConfig: {
    id: Location;
    icon: string; // Material icon name
    color: string;
}[] = [
        {
            id: 'valencia',
            icon: 'apartment',
            color: 'var(--color-primary)',
        },
        {
            id: 'motilla',
            icon: 'location_on',
            color: '#F59E0B',
        },
        {
            id: 'online',
            icon: 'videocam',
            color: '#8B5CF6',
        },
    ];

export function LocationSelector({ onSelect, preselect }: LocationSelectorProps) {
    // Filter locations based on preselection
    const filteredLocations =
        preselect === 'online'
            ? locationConfig.filter((l) => l.id === 'online')
            : preselect === 'presencial'
                ? locationConfig.filter((l) => l.id !== 'online')
                : locationConfig;

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h3 className="text-xl md:text-2xl font-bold text-[var(--color-secondary)]">
                    ¿Dónde prefieres tu sesión?
                </h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                    Selecciona la modalidad que mejor se adapte a ti
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {filteredLocations.map(({ id, icon, color }, index) => (
                    <motion.button
                        key={id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4, ease: 'easeOut' }}
                        onClick={() => onSelect(id)}
                        className="group cursor-pointer"
                    >
                        <div className="h-full bg-[var(--color-bg-card)] rounded-xl p-6 border-2 border-transparent
                            hover:border-[var(--color-primary)] hover:border-opacity-30
                            shadow-lg transition-all duration-300 flex flex-col items-center text-center
                            transform hover:-translate-y-1">
                            {/* Icon circle */}
                            <div
                                className="w-16 h-16 rounded-full flex items-center justify-center mb-4
                                    group-hover:text-white transition-colors duration-300"
                                style={{
                                    backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)`,
                                    color: color,
                                }}
                            >
                                <span
                                    className="material-icons-outlined text-3xl group-hover:text-white transition-colors"
                                    style={{ fontSize: '2rem' }}
                                >
                                    {icon}
                                </span>
                            </div>
                            <h4 className="text-lg font-bold text-[var(--color-secondary)] mb-1">
                                {LOCATION_LABELS[id]}
                            </h4>
                            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                                {LOCATION_DESCRIPTIONS[id]}
                            </p>
                            {/* Check circle (hidden by default, shown on hover) */}
                            <div className="mt-4 opacity-0 group-hover:opacity-100 text-[var(--color-primary)] transition-opacity duration-300">
                                <span className="material-icons-outlined">arrow_forward</span>
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>

            {preselect && preselect !== 'sin_preferencia' && (
                <p className="text-xs text-center text-[var(--color-text-muted)]">
                    Pre-seleccionado según tu preferencia del triaje
                </p>
            )}
        </div>
    );
}
