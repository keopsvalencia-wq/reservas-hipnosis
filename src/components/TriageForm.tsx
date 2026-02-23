'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TriageAnswers } from '@/lib/types';
import {
    triageQuestions,
    GATE_QUESTION_ID,
    GATE_BLOCKED_VALUE,
    GATE_INTRO_TEXT,
    GATE_BLOCKED_NOTE,
} from '@/data/triage-questions';

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
        if (questionId === GATE_QUESTION_ID && value === GATE_BLOCKED_VALUE) {
            setBlocked(true);
        } else if (questionId === GATE_QUESTION_ID) {
            setBlocked(false);
        }
    };

    const handleNext = () => {
        if (!currentQuestion || !answers[currentQuestion.id]?.trim()) return;

        if (currentQuestion.id === GATE_QUESTION_ID && answers[GATE_QUESTION_ID] === GATE_BLOCKED_VALUE) {
            setBlocked(true);
            return;
        }

        // If paired question (5A→5B), skip the second one only if we're on 5A
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

    const hasAnswer = !!answers[currentQuestion.id]?.trim();
    const isGateQuestion = currentQuestion.id === GATE_QUESTION_ID;
    const isPaired = currentQuestion.group === 'situacion';

    // ─── Render Input by Type ─────────────────────────

    const renderInput = () => {
        const q = currentQuestion;

        switch (q.type) {
            // ── SELECT (Dropdown) ──
            case 'select':
                return (
                    <div className="relative">
                        <select
                            value={answers[q.id] || ''}
                            onChange={(e) => setAnswer(q.id, e.target.value)}
                            className="block w-full px-4 py-3.5 text-sm border-2 border-[var(--color-border)]
                                rounded-xl bg-[var(--color-bg-card)] text-[var(--color-text)]
                                focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]
                                transition-colors appearance-none cursor-pointer"
                        >
                            <option value="" disabled>
                                Selecciona una opción...
                            </option>
                            {q.options?.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="material-icons-outlined text-[var(--color-text-muted)] text-lg">
                                expand_more
                            </span>
                        </div>
                    </div>
                );

            // ── TEXT (Short input) ──
            case 'text':
                return (
                    <input
                        type="text"
                        value={answers[q.id] || ''}
                        onChange={(e) => setAnswer(q.id, e.target.value)}
                        placeholder={q.placeholder || 'Escribe aquí...'}
                        className="block w-full px-4 py-3.5 text-sm border-2 border-[var(--color-border)]
                            rounded-xl bg-[var(--color-bg-card)] text-[var(--color-text)]
                            placeholder-gray-400
                            focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]
                            transition-colors"
                    />
                );

            // ── TEXTAREA (Long text) ──
            case 'textarea':
                return (
                    <textarea
                        value={answers[q.id] || ''}
                        onChange={(e) => setAnswer(q.id, e.target.value)}
                        placeholder={q.placeholder || 'Escribe aquí...'}
                        rows={4}
                        className="block w-full px-4 py-3.5 text-sm border-2 border-[var(--color-border)]
                            rounded-xl bg-[var(--color-bg-card)] text-[var(--color-text)]
                            placeholder-gray-400 resize-none
                            focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]
                            transition-colors"
                    />
                );

            // ── RADIO (Single select options) ──
            case 'radio':
                return (
                    <div className="grid gap-3">
                        {q.options?.map((option) => {
                            const isSelected = answers[q.id] === option.value;
                            const isRed = option.value === GATE_BLOCKED_VALUE && q.id === GATE_QUESTION_ID;

                            return (
                                <label key={option.value} className="group relative cursor-pointer">
                                    <input
                                        type="radio"
                                        name={q.id}
                                        value={option.value}
                                        checked={isSelected}
                                        onChange={() => setAnswer(q.id, option.value)}
                                        className="peer sr-only"
                                    />
                                    <div
                                        className={`
                                            p-4 rounded-xl border-2 transition-all duration-200
                                            ${isSelected
                                                ? isRed
                                                    ? 'border-[var(--color-error)] bg-red-50'
                                                    : 'border-[var(--color-primary)] bg-[var(--color-primary-soft)]'
                                                : 'border-[var(--color-border)] hover:border-[var(--color-primary)] hover:border-opacity-30'
                                            }
                                        `}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`
                                                    w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                                                    ${isSelected
                                                        ? isRed
                                                            ? 'border-[var(--color-error)] bg-[var(--color-error)]'
                                                            : 'border-[var(--color-primary)] bg-[var(--color-primary)]'
                                                        : 'border-gray-300'
                                                    }
                                                `}
                                            >
                                                {isSelected && (
                                                    <span className="material-icons-outlined text-white text-[14px]">check</span>
                                                )}
                                            </div>
                                            <span className="text-sm font-medium text-[var(--color-text)] leading-relaxed">
                                                {option.label}
                                            </span>
                                        </div>
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Progress bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs">
                    <span className="font-semibold tracking-wide uppercase text-[var(--color-primary)]">
                        Pregunta {currentIndex + 1} de {totalQuestions}
                    </span>
                    <span className="text-[var(--color-text-muted)]">
                        Formulario de Cualificación
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
                                Este no es tu momento, y está bien.
                            </h3>
                            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                                {GATE_BLOCKED_NOTE}
                            </p>
                            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                                Cuando tu situación cambie, aquí estaremos para ayudarte.
                                Tu bienestar es importante y mereces atenderlo cuando sea el momento adecuado.
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
                        className="space-y-4"
                    >
                        {/* Gate intro text for Q8 */}
                        {isGateQuestion && (
                            <div className="bg-[var(--color-bg)] rounded-xl p-4 border border-[var(--color-border)] text-sm text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                                {GATE_INTRO_TEXT}
                            </div>
                        )}

                        {/* Paired label (5A/5B) */}
                        {isPaired && (
                            <div className="flex items-center gap-2 text-xs text-[var(--color-primary)] font-semibold uppercase tracking-wider">
                                <span className="material-icons-outlined text-[14px]">compare_arrows</span>
                                {currentQuestion.id === 'situacion_actual' ? 'Parte A — Tu presente' : 'Parte B — Tu futuro'}
                            </div>
                        )}

                        {/* Question */}
                        <h3 className="text-lg font-bold text-[var(--color-secondary)]">
                            {currentQuestion.text}
                        </h3>

                        {/* Input */}
                        {renderInput()}
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
