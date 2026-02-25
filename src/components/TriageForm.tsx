'use client';

import { useState, useEffect } from 'react';
import { triageQuestions, GATES, GATE_INTRO_TEXT, GATE_QUESTION_ID } from '@/data/triage-questions';
import { TriageAnswers } from '@/lib/types';

interface TriageFormProps {
    onComplete: (answers: TriageAnswers) => void;
    subset?: string[];
    buttonLabel?: string;
    onBack?: () => void;
    formId?: string;
    onValidationChange?: (isValid: boolean) => void;
}

export function TriageForm({ onComplete, subset, buttonLabel = 'Siguiente', onBack, formId, onValidationChange }: TriageFormProps) {
    const [answers, setAnswers] = useState<TriageAnswers>({});

    const filteredQuestions = subset
        ? triageQuestions.filter(q => subset.includes(q.id))
        : triageQuestions;

    const handleAnswer = (id: string, value: any) => {
        setAnswers(prev => ({ ...prev, [id]: value }));
    };

    const handleMultiToggle = (id: string, value: string) => {
        setAnswers(prev => {
            const current: string[] = Array.isArray(prev[id]) ? prev[id] as string[] : [];
            const next = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value];
            return { ...prev, [id]: next };
        });
    };

    // Check if any gate is triggered (blocked value selected)
    const activeGate = GATES.find(g => {
        const val = answers[g.questionId];
        return val === g.blockedValue;
    });

    const isComplete = filteredQuestions.every(q => {
        const val = answers[q.id];
        if (q.type === 'multiselect') return Array.isArray(val) && val.length > 0;
        return val !== undefined && val !== '';
    });

    const canSubmit = isComplete && !activeGate;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (canSubmit) onComplete(answers);
    };

    // Notify parent about validation status
    useEffect(() => {
        onValidationChange?.(canSubmit);
    }, [canSubmit, onValidationChange]);

    return (
        <form id={formId} onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            {/* Scrollable questions area */}
            <div className="flex-1 overflow-y-auto space-y-8 pr-1" style={{ scrollbarWidth: 'thin' }}>
                {filteredQuestions.map((q) => (
                    <div key={q.id} className="space-y-3">
                        <label className="block text-lg font-bold text-[var(--color-secondary)]">
                            {q.text}
                        </label>

                        {q.id === GATE_QUESTION_ID && (
                            <p className="text-sm text-[var(--color-text-muted)] bg-white p-4 rounded-xl border border-gray-100 italic">
                                {GATE_INTRO_TEXT}
                            </p>
                        )}

                        {/* MULTISELECT (chips) */}
                        {q.type === 'multiselect' && (
                            <div className="flex flex-wrap gap-3">
                                {q.options?.map(opt => {
                                    const selected = Array.isArray(answers[q.id]) && (answers[q.id] as string[]).includes(opt.value);
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => handleMultiToggle(q.id, opt.value)}
                                            className={`px-5 py-3 rounded-2xl border-2 font-semibold transition-all text-sm ${selected
                                                ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-secondary)]'
                                                : 'border-[var(--color-border)] bg-white text-[var(--color-text-muted)] hover:border-gray-400'
                                                }`}
                                        >
                                            {selected && <span className="mr-1">✓</span>}
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* SELECT (Grid for Age or Scale) */}
                        {q.type === 'select' && (
                            <div className={`grid gap-3 ${q.id === 'edad' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-5 md:grid-cols-10'}`}>
                                {q.options?.map(opt => {
                                    const selected = answers[q.id] === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => handleAnswer(q.id, opt.value)}
                                            className={`p-3 md:p-4 rounded-xl border-2 font-bold transition-all text-sm md:text-base ${selected
                                                ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-secondary)]'
                                                : 'border-gray-100 bg-white text-[var(--color-text-muted)] hover:border-gray-300'
                                                }`}
                                        >
                                            {opt.label.split(' — ')[0]}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* RADIO (Big Buttons) */}
                        {q.type === 'radio' && (
                            <div className="space-y-3">
                                {q.options?.map(opt => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => handleAnswer(q.id, opt.value)}
                                        className={`w-full flex items-center text-left gap-4 p-5 rounded-2xl border-2 transition-all group ${answers[q.id] === opt.value
                                            ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)]'
                                            : 'border-gray-50 hover:border-gray-300 bg-white shadow-sm'
                                            }`}
                                    >
                                        <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${answers[q.id] === opt.value ? 'border-[var(--color-primary)] bg-white' : 'border-gray-200'}`}>
                                            {answers[q.id] === opt.value && <div className="h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />}
                                        </div>
                                        <span className={`text-base font-bold transition-colors ${answers[q.id] === opt.value ? 'text-[var(--color-secondary)]' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text)]'}`}>
                                            {opt.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* TEXT */}
                        {q.type === 'text' && (
                            <input
                                type="text"
                                className="w-full p-4 rounded-xl border border-[var(--color-border)] bg-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                                placeholder={q.placeholder}
                                onChange={(e) => handleAnswer(q.id, e.target.value)}
                                value={(answers[q.id] as string) || ''}
                                required
                            />
                        )}

                        {/* TEXTAREA */}
                        {q.type === 'textarea' && (
                            <textarea
                                className="w-full p-4 rounded-xl border border-[var(--color-border)] bg-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all h-32 resize-none"
                                placeholder={q.placeholder}
                                onChange={(e) => handleAnswer(q.id, e.target.value)}
                                value={(answers[q.id] as string) || ''}
                                required
                            />
                        )}
                    </div>
                ))}

                {/* ── GATE BLOCKED MESSAGE ── */}
                {activeGate && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center space-y-2">
                        <p className="text-red-600 font-semibold text-base">⚠️ No puedes continuar</p>
                        <p className="text-sm text-red-500 leading-relaxed">{activeGate.message}</p>
                    </div>
                )}
            </div>
        </form>
    );
}
