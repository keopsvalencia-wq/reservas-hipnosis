'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TriageAnswers } from '@/lib/types';
import { triageQuestions, GATE_QUESTION_ID, GATE_BLOCKED_VALUE } from '@/data/triage-questions';

interface TriageFormProps {
    onComplete: (answers: TriageAnswers) => void;
}

export function TriageForm({ onComplete }: TriageFormProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<TriageAnswers>({});
    const [direction, setDirection] = useState(1);
    const [blocked, setBlocked] = useState(false);

    // Filter questions based on conditional logic
    const visibleQuestions = triageQuestions.filter((q) => {
        if (!q.showIf) return true;
        return q.showIf(answers);
    });

    const currentQuestion = visibleQuestions[currentIndex];
    const totalQuestions = visibleQuestions.length;
    const progress = ((currentIndex + 1) / totalQuestions) * 100;

    const setAnswer = (questionId: string, value: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
        // Gate check
        if (questionId === GATE_QUESTION_ID && value === GATE_BLOCKED_VALUE) {
            setBlocked(true);
        } else if (questionId === GATE_QUESTION_ID) {
            setBlocked(false);
        }
    };

    const handleNext = () => {
        if (!currentQuestion || !answers[currentQuestion.id]) return;

        // Gate: block if selecting red option
        if (currentQuestion.id === GATE_QUESTION_ID && answers[GATE_QUESTION_ID] === GATE_BLOCKED_VALUE) {
            setBlocked(true);
            return;
        }

        if (currentIndex < totalQuestions - 1) {
            setDirection(1);
            setCurrentIndex((prev) => prev + 1);
        } else {
            onComplete(answers);
        }
    };

    const handleBack = () => {
        if (blocked) {
            setBlocked(false);
            return;
        }
        if (currentIndex > 0) {
            setDirection(-1);
            setCurrentIndex((prev) => prev - 1);
        }
    };

    if (!currentQuestion) return null;

    const hasAnswer = !!answers[currentQuestion.id];
    const isGateQuestion = currentQuestion.id === GATE_QUESTION_ID;

    return (
        <div className="space-y-6">
            {/* Progress bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs">
                    <span className="font-semibold tracking-wide uppercase text-[var(--color-primary)]">
                        Pregunta {currentIndex + 1} de {totalQuestions}
                    </span>
                    <span className="text-[var(--color-text-muted)]">
                        Filtro de Cualificación
                    </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-[var(--color-primary)] rounded-full mint-glow"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                </div>
            </div>

            {/* Blocked state (gate) */}
            <AnimatePresence mode="wait">
                {blocked ? (
                    <motion.div
                        key="blocked"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="text-center py-8 space-y-6"
                    >
                        <div className="w-20 h-20 rounded-full bg-[var(--color-primary-soft)] flex items-center justify-center mx-auto">
                            <span className="material-icons-outlined text-[var(--color-primary)] text-4xl">
                                favorite
                            </span>
                        </div>
                        <div className="space-y-3 max-w-md mx-auto">
                            <h3 className="text-xl font-bold text-[var(--color-secondary)]">
                                Gracias por tu sinceridad
                            </h3>
                            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                                Entendemos que las circunstancias económicas pueden ser un obstáculo.
                                Te recomendamos explorar los recursos gratuitos de salud mental
                                disponibles en tu comunidad autónoma.
                            </p>
                            <p className="text-xs text-[var(--color-text-muted)]">
                                Si tu situación cambia, estaremos encantados de acompañarte.
                            </p>
                        </div>
                        <button
                            onClick={handleBack}
                            className="text-sm text-[var(--color-primary)] hover:underline font-medium flex items-center gap-1 mx-auto"
                        >
                            <span className="material-icons-outlined text-[16px]">arrow_back</span>
                            Volver y modificar respuesta
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key={currentQuestion.id}
                        initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="space-y-5"
                    >
                        {/* Question */}
                        <h3 className="text-lg font-bold text-[var(--color-secondary)]">
                            {currentQuestion.text}
                        </h3>

                        {/* Options */}
                        <div className={`grid gap-2 ${isGateQuestion ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
                            {currentQuestion.options.map((option) => {
                                const isSelected = answers[currentQuestion.id] === option.value;

                                return (
                                    <label
                                        key={option.value}
                                        className="group relative cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name={currentQuestion.id}
                                            value={option.value}
                                            checked={isSelected}
                                            onChange={() => setAnswer(currentQuestion.id, option.value)}
                                            className="peer sr-only"
                                        />
                                        <div
                                            className={`
                                                p-4 rounded-xl border-2 transition-all duration-200
                                                ${isSelected
                                                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)]'
                                                    : 'border-[var(--color-border)] hover:border-[var(--color-primary)] hover:border-opacity-30'
                                                }
                                            `}
                                        >
                                            <div className="flex items-center gap-3">
                                                {/* Radio circle */}
                                                <div
                                                    className={`
                                                        w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                                                        ${isSelected
                                                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]'
                                                            : 'border-gray-300'
                                                        }
                                                    `}
                                                >
                                                    {isSelected && (
                                                        <span className="material-icons-outlined text-white text-[14px]">check</span>
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium text-[var(--color-text)]">
                                                    {option.label}
                                                </span>
                                            </div>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation */}
            {!blocked && (
                <div className="flex items-center justify-between pt-4">
                    <button
                        onClick={handleBack}
                        disabled={currentIndex === 0}
                        className="flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-secondary)] transition-colors font-medium disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <span className="material-icons-outlined mr-1 text-[18px]">arrow_back</span>
                        Anterior
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={!hasAnswer}
                        className="btn-primary text-sm"
                    >
                        {currentIndex === totalQuestions - 1 ? 'Continuar' : 'Siguiente'}
                        <span className="material-icons-outlined text-[18px]">arrow_forward</span>
                    </button>
                </div>
            )}
        </div>
    );
}
