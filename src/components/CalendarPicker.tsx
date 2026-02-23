'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    addMonths,
    subMonths,
    isSameMonth,
    isSameDay,
    isToday,
    isBefore,
    startOfDay,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { Location, TimeSlot } from '@/lib/types';
import { getAvailableSlots, isDayAvailable } from '@/lib/booking-rules';
import { TimeSlotGrid } from './TimeSlotGrid';

interface CalendarPickerProps {
    location: Location;
    onSelectSlot: (date: string, time: string) => void;
    onBack: () => void;
}

export function CalendarPicker({ location, onSelectSlot, onBack }: CalendarPickerProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const today = startOfDay(new Date());

    // Build calendar grid
    const calendarDays = useMemo(() => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const calStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
        const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

        const days: Date[] = [];
        let day = calStart;
        while (day <= calEnd) {
            days.push(day);
            day = addDays(day, 1);
        }
        return days;
    }, [currentMonth]);

    // Get available slots for selected date
    const availableSlots: TimeSlot[] = useMemo(() => {
        if (!selectedDate) return [];
        const dayOfWeek = selectedDate.getDay();
        const occupiedValencia: string[] = [];
        const occupiedMotilla: string[] = [];
        return getAvailableSlots(location, dayOfWeek, occupiedValencia, occupiedMotilla);
    }, [selectedDate, location]);

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        setSelectedTime(null);
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
    };

    const handleConfirm = () => {
        if (selectedDate && selectedTime) {
            onSelectSlot(format(selectedDate, 'yyyy-MM-dd'), selectedTime);
        }
    };

    const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h3 className="text-xl md:text-2xl font-bold text-[var(--color-secondary)]">
                    Elige fecha y hora
                </h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                    Sesión de 45 minutos · Los días resaltados tienen horarios disponibles
                </p>
            </div>

            {/* Month Navigator */}
            <div className="flex items-center justify-between px-1">
                <button
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="w-10 h-10 rounded-full flex items-center justify-center
                        hover:bg-[var(--color-bg-card-hover)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                    <span className="material-icons-outlined">chevron_left</span>
                </button>
                <h4 className="text-base font-semibold capitalize text-[var(--color-secondary)]">
                    {format(currentMonth, 'MMMM yyyy', { locale: es })}
                </h4>
                <button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="w-10 h-10 rounded-full flex items-center justify-center
                        hover:bg-[var(--color-bg-card-hover)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                    <span className="material-icons-outlined">chevron_right</span>
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] p-4 shadow-sm">
                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekDays.map((day) => (
                        <div
                            key={day}
                            className="text-center text-xs text-[var(--color-text-muted)] font-semibold py-1 uppercase"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day) => {
                        const dayOfWeek = day.getDay();
                        const hasSlots = isDayAvailable(location, dayOfWeek);
                        const isPast = isBefore(day, today);
                        const isCurrentMonth = isSameMonth(day, currentMonth);
                        const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                        const isTodayDate = isToday(day);
                        const isClickable = hasSlots && !isPast && isCurrentMonth;

                        return (
                            <button
                                key={day.toISOString()}
                                onClick={() => isClickable && handleDateClick(day)}
                                disabled={!isClickable}
                                className={`
                                    relative aspect-square flex items-center justify-center text-sm rounded-lg
                                    transition-all duration-200 font-medium
                                    ${!isCurrentMonth
                                        ? 'text-gray-300 cursor-default'
                                        : isPast
                                            ? 'text-gray-300 cursor-not-allowed'
                                            : isSelected
                                                ? 'bg-[var(--color-primary)] text-[var(--color-secondary)] font-bold shadow-md'
                                                : hasSlots
                                                    ? 'text-[var(--color-text)] hover:bg-[var(--color-primary-soft)] cursor-pointer'
                                                    : 'text-gray-300 cursor-not-allowed'
                                    }
                                `}
                            >
                                {format(day, 'd')}
                                {/* Dot indicator for available days */}
                                {hasSlots && !isPast && isCurrentMonth && !isSelected && (
                                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                                )}
                                {/* Today ring */}
                                {isTodayDate && !isSelected && isCurrentMonth && (
                                    <span className="absolute inset-0 rounded-lg border-2 border-[var(--color-primary)] opacity-40" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Time Slots */}
            <AnimatePresence>
                {selectedDate && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] p-5 space-y-3 shadow-sm">
                            <p className="text-sm font-medium text-[var(--color-secondary)] capitalize">
                                {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
                            </p>
                            <TimeSlotGrid
                                slots={availableSlots}
                                selectedTime={selectedTime}
                                onSelectTime={handleTimeSelect}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-2">
                <button
                    onClick={onBack}
                    className="flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-secondary)] transition-colors font-medium"
                >
                    <span className="material-icons-outlined mr-1 text-[18px]">arrow_back</span>
                    Anterior
                </button>
                <button
                    onClick={handleConfirm}
                    disabled={!selectedDate || !selectedTime}
                    className="btn-primary text-sm"
                >
                    Siguiente Paso
                    <span className="material-icons-outlined text-[18px]">arrow_forward</span>
                </button>
            </div>
        </div>
    );
}
