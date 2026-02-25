'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingData, Location, WizardStep } from '@/lib/types';
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

    const handleConfirmationSubmit = (info: { name: string; lastName: string; email: string; phone: string; acceptPrivacy: boolean }) => {
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
        <div className="step-layout">
            <div className={`step-layout__content ${step === 3 ? 'step-layout__content--fill' : ''}`}>
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={step}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="w-full"
                    >
                        {step === 1 && (
                            <div className="space-y-10 w-full mb-10 text-center">
                                <div className="space-y-3">
                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">Sede</p>
                                    <h2 className="text-2xl md:text-4xl font-black text-[var(--color-secondary)]">¿Dónde prefieres la sesión?</h2>
                                </div>
                                <LocationSelector onSelect={handleLocationSelect} />
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-10 w-full mb-10 text-center">
                                <div className="space-y-3">
                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">Disponibilidad</p>
                                    <h2 className="text-2xl md:text-3xl font-black text-[var(--color-secondary)]">Elige tu horario</h2>
                                </div>
                                <CalendarPicker
                                    location={bookingData.location!}
                                    onSelectSlot={handleSlotSelect}
                                    onBack={() => goTo(1)}
                                />
                            </div>
                        )}

                        {step === 3 && (
                            <div className="w-full">
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

            {/* FIXED FOOTER NAVIGATION */}
            {step < 3 && (
                <div className="step-layout__footer">
                    <div className="step-layout__nav">
                        <button
                            onClick={() => step === 1 ? onBack() : goTo((step - 1) as WizardStep)}
                            className="btn-back"
                        >
                            <span className="material-icons-outlined">arrow_back</span>
                            Atrás
                        </button>
                        <div className="flex gap-2">
                            {[1, 2, 3].map(s => (
                                <div
                                    key={s}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${step === s
                                        ? 'w-6 bg-[var(--color-primary)]'
                                        : 'w-1.5 bg-gray-200'
                                        }`}
                                />
                            ))}
                        </div>
                        <div className="w-16" />
                    </div>
                </div>
            )}
        </div>
    );
}
