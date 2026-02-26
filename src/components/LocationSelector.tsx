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
                            <div className="text-2xl transition-all" style={{ color: card.color }}>
                                {card.id === 'valencia' && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                                {card.id === 'online' && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
                                {card.id === 'motilla' && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                            </div>
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
                                    <svg className="w-4 h-4 text-[var(--color-primary)] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
                                    </svg>
                                    <p className="text-[13px] text-[var(--color-secondary)] leading-tight opacity-80 italic">
                                        {card.note}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Arrow - Subtle indicator */}
                        <div className="hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                            <svg className="w-6 h-6 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </motion.button>
            ))}
        </div>
    );
}
