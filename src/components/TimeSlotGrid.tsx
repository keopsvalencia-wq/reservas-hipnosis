'use client';

import { motion } from 'framer-motion';
import { TimeSlot } from '@/lib/types';

interface TimeSlotGridProps {
    slots: TimeSlot[];
    selectedTime: string | null;
    onSelectTime: (time: string) => void;
}

export function TimeSlotGrid({ slots, selectedTime, onSelectTime }: TimeSlotGridProps) {
    if (slots.length === 0) {
        return (
            <div className="text-center py-8 space-y-2">
                <svg className="w-10 h-10 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zM10 14l4 4m0-4l-4 4" /></svg>
                <p className="text-sm text-[var(--color-text-muted)]">
                    No hay horarios disponibles para este día
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide font-semibold flex items-center gap-1">
                <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Horarios disponibles
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {slots.map((slot, index) => {
                    const isSelected = selectedTime === slot.time;
                    const isDisabled = !slot.available;

                    return (
                        <motion.button
                            key={slot.time}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05, duration: 0.2 }}
                            onClick={() => !isDisabled && onSelectTime(slot.time)}
                            disabled={isDisabled}
                            className={`
                                p-3 rounded-xl text-center transition-all duration-200 border-2 font-medium
                                ${isDisabled
                                    ? 'border-[var(--color-border)] bg-[var(--color-bg)] text-gray-300 cursor-not-allowed line-through'
                                    : isSelected
                                        ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)] shadow-md mint-glow font-bold'
                                        : 'border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text)] hover:border-[var(--color-primary)] cursor-pointer'
                                }
                            `}
                        >
                            <div className="flex items-center justify-center gap-2">
                                {isSelected && (
                                    <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                )}
                                <span className="text-base">{slot.time}</span>
                            </div>
                            <span className="text-[10px] text-[var(--color-text-muted)] mt-0.5 block">
                                45 min
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
