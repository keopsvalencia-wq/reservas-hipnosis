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
                <span className="material-icons-outlined text-gray-300 text-4xl">event_busy</span>
                <p className="text-sm text-[var(--color-text-muted)]">
                    No hay horarios disponibles para este día
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide font-semibold flex items-center gap-1">
                <span className="material-icons-outlined text-[14px]">schedule</span>
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
                                    <span className="material-icons-outlined text-[16px]">check_circle</span>
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
