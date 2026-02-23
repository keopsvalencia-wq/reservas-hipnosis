'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingData, Location, TriageAnswers, WizardStep } from '@/lib/types';
import { StepIndicator } from './StepIndicator';
import { TriageForm } from './TriageForm';
import { LocationSelector } from './LocationSelector';
import { CalendarPicker } from './CalendarPicker';
import { ConfirmationStep } from './ConfirmationStep';

export function BookingWizard() {
    const [step, setStep] = useState<WizardStep>(0);
    const [bookingData, setBookingData] = useState<Partial<BookingData>>({});
    const [direction, setDirection] = useState(1);

    const goTo = useCallback((newStep: WizardStep) => {
        setDirection(newStep > step ? 1 : -1);
        setStep(newStep);
    }, [step]);

    // ─── Step Handlers ────────────────────────────────

    const handleTriageComplete = (answers: TriageAnswers) => {
        setBookingData((prev) => ({ ...prev, triageAnswers: answers }));
        goTo(1);
    };

    const handleLocationSelect = (location: Location) => {
        setBookingData((prev) => ({ ...prev, location }));
        goTo(2);
    };

    const handleSlotSelect = (date: string, time: string) => {
        setBookingData((prev) => ({ ...prev, date, time }));
        goTo(3);
    };

    const handleSubmit = (data: BookingData) => {
        setBookingData(data);
    };

    // Get preselect from triage modalidad question
    const modalidadPreselect = bookingData.triageAnswers?.modalidad as
        | 'presencial'
        | 'online'
        | 'sin_preferencia'
        | undefined;

    // ─── Animation Variants ───────────────────────────
    const variants = {
        enter: (dir: number) => ({
            opacity: 0,
            x: dir > 0 ? 60 : -60,
        }),
        center: {
            opacity: 1,
            x: 0,
        },
        exit: (dir: number) => ({
            opacity: 0,
            x: dir > 0 ? -60 : 60,
        }),
    };

    return (
        <div className="stitch-card p-6 md:p-8">
            <StepIndicator currentStep={step} />

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
                    {step === 0 && (
                        <TriageForm onComplete={handleTriageComplete} />
                    )}

                    {step === 1 && (
                        <LocationSelector
                            onSelect={handleLocationSelect}
                            preselect={modalidadPreselect}
                        />
                    )}

                    {step === 2 && (
                        <CalendarPicker
                            location={bookingData.location!}
                            onSelectSlot={handleSlotSelect}
                            onBack={() => goTo(1)}
                        />
                    )}

                    {step === 3 && (
                        <ConfirmationStep
                            bookingData={bookingData}
                            onSubmit={handleSubmit}
                            onBack={() => goTo(2)}
                        />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
