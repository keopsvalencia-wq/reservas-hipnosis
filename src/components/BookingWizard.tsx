'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingData, Location, WizardStep } from '@/lib/types';
import { StepIndicator } from './StepIndicator';
import { LocationSelector } from './LocationSelector';
import { CalendarPicker } from './CalendarPicker';
import { ConfirmationStep } from './ConfirmationStep';

interface BookingWizardProps {
    preloadedData: Partial<BookingData>;
    onBack: () => void;
}

export function BookingWizard({ preloadedData, onBack }: BookingWizardProps) {
    // Start from step 1 (Location Selection) since Triage is done in page.tsx
    const [step, setStep] = useState<WizardStep>(1);
    const [bookingData, setBookingData] = useState<Partial<BookingData>>(preloadedData);
    const [direction, setDirection] = useState(1);

    const goTo = useCallback((newStep: WizardStep) => {
        setDirection(newStep > step ? 1 : -1);
        setStep(newStep);
    }, [step]);

    // ─── Step Handlers ────────────────────────────────

    const handleLocationSelect = (location: Location) => {
        setBookingData((prev) => ({ ...prev, location }));
        goTo(2);
    };

    const handleSlotSelect = (date: string, time: string) => {
        setBookingData((prev) => ({ ...prev, date, time }));
        goTo(3);
    };

    const handleConfirmationSubmit = (info: { name: string; email: string; phone: string; acceptPrivacy: boolean }) => {
        setBookingData((prev) => ({ ...prev, ...info }));
    };

    // ─── Animation Variants ───────────────────────────
    const variants = {
        enter: (dir: number) => ({
            opacity: 0,
            x: dir > 0 ? 40 : -40,
        }),
        center: {
            opacity: 1,
            x: 0,
        },
        exit: (dir: number) => ({
            opacity: 0,
            x: dir > 0 ? -40 : 40,
        }),
    };

    return (
        <div className="space-y-10">
            {/* Minimal step indicator for the booking phase */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => step === 1 ? onBack() : goTo((step - 1) as WizardStep)}
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-secondary)] flex items-center gap-1 font-bold"
                >
                    <span className="material-icons-outlined">arrow_back</span>
                    Atrás
                </button>
                <div className="flex gap-4">
                    {[1, 2, 3].map(s => (
                        <div key={s} className={`h-2 w-2 rounded-full ${step === s ? 'bg-[var(--color-primary)]' : 'bg-gray-200'}`} />
                    ))}
                </div>
                <div className="w-10" />
            </div>

            <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                    key={step}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-3xl font-black text-[var(--color-secondary)] text-center">¿Dónde prefieres la sesión?</h2>
                            <LocationSelector onSelect={handleLocationSelect} />
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-3xl font-black text-[var(--color-secondary)] text-center">Elige tu horario</h2>
                            <CalendarPicker
                                location={bookingData.location!}
                                onSelectSlot={handleSlotSelect}
                                onBack={() => goTo(1)}
                            />
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-3xl font-black text-[var(--color-secondary)] text-center">Datos de contacto</h2>
                            <ConfirmationStep
                                data={bookingData}
                                onSubmit={handleConfirmationSubmit}
                                onBack={() => goTo(2)}
                            />
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
