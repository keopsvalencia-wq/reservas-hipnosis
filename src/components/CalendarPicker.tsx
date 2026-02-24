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
    const [busySlots, setBusySlots] = useState<string[]>([]);
    const [loadingBusy, setLoadingBusy] = useState(false);

    const today = startOfDay(new Date());

    // Fecth busy slots when date changes
    const fetchBusySlots = async (date: Date) => {
        setLoadingBusy(true);
        try {
            const formattedDate = format(date, 'yyyy-MM-dd');
            const res = await fetch(`/api/availability?date=${formattedDate}`);
            const data = await res.json();
            if (data.success) {
                setBusySlots(data.busySlots);
            }
        } catch (error) {
            console.error('Error fetching busy slots:', error);
        } finally {
            setLoadingBusy(false);
        }
    };

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

    // Helper to check if a specific time is busy
    const isSlotBusy = (time: string) => {
        if (!selectedDate) return false;

        // Creamos los tiempos del slot (45 min de duración)
        const slotStart = new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${time}:00`).getTime();
        const slotEnd = slotStart + 45 * 60 * 1000;

        // Tolerancia de 1 minuto para evitar problemas con los bordes exactos
        const TOLERANCE = 60 * 1000;

        return busySlots.some(period => {
            const [pStartStr, pEndStr] = period.split('|');
            const pStart = new Date(pStartStr).getTime();
            const pEnd = new Date(pEndStr).getTime();

            // Solapamiento real: el slot termina después de que empiece el evento
            // Y el slot empieza antes de que termine el evento.
            // Aplicamos la tolerancia para permitir sesiones que empiezan justo al terminar la anterior.
            return (slotStart + TOLERANCE) < pEnd && (slotEnd - TOLERANCE) > pStart;
        });
    };

    // Get available slots for selected date
    const availableSlots: TimeSlot[] = useMemo(() => {
        if (!selectedDate) return [];
        const dayOfWeek = selectedDate.getDay();
        const occupiedValencia: string[] = [];
        const occupiedMotilla: string[] = [];

        const theoreticalSlots = getAvailableSlots(location, dayOfWeek, occupiedValencia, occupiedMotilla);

        // Filtrar por ocupación real de Google Calendar (FreeBusy)
        return theoreticalSlots.map(slot => ({
            ...slot,
            available: slot.available && !isSlotBusy(slot.time)
        }));
    }, [selectedDate, location, busySlots]);

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        setSelectedTime(null);
        fetchBusySlots(date);
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

            {/* Horizontal Layout for Calendar and Slots */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Calendar Column */}
                <div className="flex-1 w-full space-y-6">
                    {/* Month Navigator */}
                    <div className="flex items-center justify-between px-1">
                        <button
                            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                            className="w-10 h-10 rounded-full flex items-center justify-center
                                hover:bg-gray-100 transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                        >
                            <span className="material-icons-outlined">chevron_left</span>
                        </button>
                        <h4 className="text-base font-semibold capitalize text-[var(--color-secondary)]">
                            {format(currentMonth, 'MMMM yyyy', { locale: es })}
                        </h4>
                        <button
                            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                            className="w-10 h-10 rounded-full flex items-center justify-center
                                hover:bg-gray-100 transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                        >
                            <span className="material-icons-outlined">chevron_right</span>
                        </button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="bg-white rounded-2xl border border-[var(--color-border)] p-4 shadow-sm">
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {weekDays.map((day) => (
                                <div key={day} className="text-center text-xs text-[var(--color-text-muted)] font-semibold py-1 uppercase">{day}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((day) => {
                                const dayOfWeek = day.getDay();
                                const hasSlots = isDayAvailable(location, dayOfWeek);
                                // Modificado: No permitir hoy, solo a partir de mañana
                                const isPast = isBefore(day, startOfDay(addDays(today, 1)));
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
                                            ${!isCurrentMonth ? 'text-gray-300 cursor-default' : isPast ? 'text-gray-300 cursor-not-allowed' : isSelected ? 'bg-[var(--color-primary)] text-[var(--color-secondary)] font-bold shadow-md' : hasSlots ? 'text-[var(--color-text)] hover:bg-[var(--color-primary-soft)] cursor-pointer' : 'text-gray-300 cursor-not-allowed'}
                                        `}
                                    >
                                        {format(day, 'd')}
                                        {hasSlots && !isPast && isCurrentMonth && !isSelected && (
                                            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                                        )}
                                        {isTodayDate && !isSelected && isCurrentMonth && (
                                            <span className="absolute inset-0 rounded-lg border-2 border-[var(--color-primary)] opacity-40" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Slots Column */}
                <div className="w-full lg:w-80 h-full min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {selectedDate ? (
                            <motion.div
                                key={selectedDate.toISOString()}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white rounded-2xl border border-[var(--color-border)] p-6 space-y-4 shadow-sm h-full"
                            >
                                <p className="text-sm font-bold text-[var(--color-secondary)] uppercase tracking-wider">
                                    {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
                                </p>
                                <div className="h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {loadingBusy ? (
                                        <div className="h-full flex flex-col items-center justify-center space-y-3">
                                            <div className="w-8 h-8 border-4 border-[var(--color-primary-soft)] border-t-[var(--color-primary)] rounded-full animate-spin" />
                                            <p className="text-xs text-[var(--color-text-muted)] animate-pulse">Sincronizando agenda...</p>
                                        </div>
                                    ) : (
                                        <TimeSlotGrid
                                            slots={availableSlots}
                                            selectedTime={selectedTime}
                                            onSelectTime={handleTimeSelect}
                                        />
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-300 opacity-60">
                                <span className="material-icons-outlined text-4xl text-gray-400 mb-2">event</span>
                                <p className="text-sm text-gray-500">Selecciona un día para ver los horarios disponibles</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

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
