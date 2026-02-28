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
        <form id={formId} onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 relative">
            {/* Scrollable questions area */}
            <div className="flex-1 overflow-y-auto space-y-4 md:space-y-8 px-1 md:px-2" style={{ scrollbarWidth: 'thin' }}>
                {filteredQuestions.map((q) => (
                    <div key={q.id} className="space-y-1.5 md:space-y-3">
                        <label className="block text-[13px] md:text-lg font-black text-[var(--color-secondary)] uppercase tracking-tight">
                            {q.text}
                        </label>

                        {q.id === GATE_QUESTION_ID && (
                            <p className="text-sm text-[var(--color-text-muted)] bg-white p-4 rounded-xl border border-gray-100 italic">
                                {GATE_INTRO_TEXT}
                            </p>
                        )}

                        {/* MULTISELECT (chips) */}
                        {q.type === 'multiselect' && (
                            <div className="flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-3">
                                {q.options?.map(opt => {
                                    const selected = Array.isArray(answers[q.id]) && (answers[q.id] as string[]).includes(opt.value);
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => handleMultiToggle(q.id, opt.value)}
                                            className={`px-4 py-3 rounded-xl border-2 font-semibold transition-all text-sm text-left flex items-start gap-2 ${selected
                                                ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-secondary)]'
                                                : 'border-[var(--color-border)] bg-white text-[var(--color-text-muted)] hover:border-[var(--color-primary)]'
                                                }`}
                                        >
                                            <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${selected ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white' : 'border-gray-300'}`}>
                                                {selected && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                            </div>
                                            <span>{opt.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* SELECT (Grid for Age or Scale) */}
                        {q.type === 'select' && (
                            <div className={`grid gap-2 md:gap-3 ${q.id === 'edad' ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-5 md:grid-cols-10'}`}>
                                {q.options?.map(opt => {
                                    const selected = answers[q.id] === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => handleAnswer(q.id, opt.value)}
                                            className={`p-3.5 rounded-xl border-2 font-bold transition-all text-sm md:text-base ${selected
                                                ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-secondary)]'
                                                : 'border-gray-100 bg-white text-[var(--color-text-muted)] hover:border-[var(--color-primary)]'
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
                            <div className="flex flex-col gap-3 md:gap-4">
                                {q.options?.map(opt => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => handleAnswer(q.id, opt.value)}
                                        className={`w-full flex items-center text-left gap-4 md:gap-5 p-5 rounded-xl border-2 transition-all group ${answers[q.id] === opt.value
                                            ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)]'
                                            : 'border-gray-50 hover:border-[var(--color-primary)] bg-white shadow-sm'
                                            }`}
                                    >
                                        <div className={`h-5 w-5 md:h-6 md:w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${answers[q.id] === opt.value ? 'border-[var(--color-primary)] bg-white' : 'border-gray-300'}`}>
                                            {answers[q.id] === opt.value && <div className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 rounded-full bg-[var(--color-primary)]" />}
                                        </div>
                                        <span className={`text-[13px] md:text-lg font-semibold transition-colors leading-tight ${answers[q.id] === opt.value ? 'text-[var(--color-secondary)]' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text)]'}`}>
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
                                className="w-full py-2.5 px-4 rounded-xl border border-[var(--color-border)] bg-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all box-border text-sm"
                                placeholder={q.placeholder}
                                onChange={(e) => handleAnswer(q.id, e.target.value)}
                                value={(answers[q.id] as string) || ''}
                                required
                            />
                        )}

                        {/* TEXTAREA */}
                        {q.type === 'textarea' && (
                            <textarea
                                className="w-full p-4 rounded-xl border border-[var(--color-border)] bg-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all h-32 resize-none box-border"
                                placeholder={q.placeholder}
                                onChange={(e) => handleAnswer(q.id, e.target.value)}
                                value={(answers[q.id] as string) || ''}
                                required
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* ── GATE BLOCKED MESSAGE MODAL ── */}
            {activeGate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => handleAnswer(activeGate.questionId, undefined)}></div>
                    <div className="relative bg-white border border-red-100 rounded-3xl p-6 md:p-8 text-center space-y-4 shadow-2xl w-full max-w-sm">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <p className="text-red-600 font-bold text-xl">Atención</p>
                        <p className="text-base text-gray-600 leading-relaxed font-medium">{activeGate.message}</p>
                        <button
                            type="button"
                            onClick={() => handleAnswer(activeGate.questionId, undefined)}
                            className="mt-6 w-full py-4 bg-[var(--color-primary)] hover:bg-[#2bc493] text-[var(--color-secondary)] font-bold rounded-xl transition-colors shadow-xl shadow-primary/30 uppercase tracking-widest text-sm"
                        >
                            Cambiar mi selección
                        </button>
                    </div>
                </div>
            )}
        </form>
    );
}
