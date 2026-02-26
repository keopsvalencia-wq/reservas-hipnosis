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
    prefetchedBusySlots: string[];
}

export function BookingWizard({ preloadedData, onBack, prefetchedBusySlots }: BookingWizardProps) {
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

    const handleConfirmationSubmit = (info: { fullName: string; email: string; phone: string; acceptPrivacy: boolean }) => {
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
            {/* Header with step indicator + back button */}
            <div className="flex-shrink-0 px-6 md:px-14 lg:px-20 pt-4 pb-2">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => step === 1 ? onBack() : goTo((step - 1) as WizardStep)}
                        className="btn-back group"
                    >
                        <svg className="w-5 h-5 mr-1 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Atrás
                    </button>
                    <div className="flex gap-3">
                        {[1, 2, 3].map(s => (
                            <div
                                key={s}
                                className={`h-2 rounded-full transition-all duration-300 ${step === s
                                    ? 'w-8 bg-[var(--color-primary)]'
                                    : step > s
                                        ? 'w-2 bg-[var(--color-primary)] opacity-40'
                                        : 'w-2 bg-gray-200'
                                    }`}
                            />
                        ))}
                    </div>
                    <div className="w-16" />
                </div>
            </div>

            {/* Dynamic content area — flex-grow, centered */}
            <div className="step-layout__content">
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
                            <LocationSelector
                                onSelect={handleLocationSelect}
                            />
                        )}
                        {step === 2 && (
                            <CalendarPicker
                                location={bookingData.location!}
                                onSelectSlot={handleSlotSelect}
                                onBack={() => goTo(1)}
                                initialBusySlots={prefetchedBusySlots}
                            />
                        )}
                        {step === 3 && (
                            <ConfirmationStep
                                data={bookingData}
                                onSubmit={handleConfirmationSubmit}
                                onBack={() => goTo(2)}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
