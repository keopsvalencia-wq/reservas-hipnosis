'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { triageQuestions, GATE_INTRO_TEXT, GATE_QUESTION_ID } from '@/data/triage-questions';
import { TriageAnswers } from '@/lib/types';

interface TriageFormProps {
    onComplete: (answers: TriageAnswers) => void;
    /** Subset of question IDs to render in this instance */
    subset?: string[];
    buttonLabel?: string;
}

export function TriageForm({ onComplete, subset, buttonLabel = 'Siguiente' }: TriageFormProps) {
    const [answers, setAnswers] = useState<TriageAnswers>({});

    const filteredQuestions = subset
        ? triageQuestions.filter(q => subset.includes(q.id))
        : triageQuestions;

    const handleAnswer = (id: string, value: any) => {
        setAnswers(prev => ({ ...prev, [id]: value }));
    };

    const isComplete = filteredQuestions.every(q => answers[q.id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isComplete) {
            onComplete(answers);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-10">
                {filteredQuestions.map((q) => (
                    <div key={q.id} className="space-y-4">
                        <label className="block text-lg font-bold text-[var(--color-secondary)]">
                            {q.text}
                        </label>

                        {q.id === GATE_QUESTION_ID && (
                            <p className="text-sm text-[var(--color-text-muted)] bg-gray-50 p-4 rounded-xl border border-gray-100 italic mb-4">
                                {GATE_INTRO_TEXT}
                            </p>
                        )}

                        {q.type === 'select' && (
                            <select
                                className="w-full p-4 rounded-xl border border-[var(--color-border)] bg-gray-50 focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all appearance-none cursor-pointer"
                                onChange={(e) => handleAnswer(q.id, e.target.value)}
                                value={answers[q.id] || ''}
                                required
                            >
                                <option value="" disabled>Selecciona una opción...</option>
                                {q.options?.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        )}

                        {q.type === 'radio' && (
                            <div className="space-y-3">
                                {q.options?.map(opt => (
                                    <label
                                        key={opt.value}
                                        className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${answers[q.id] === opt.value
                                                ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)]'
                                                : 'border-[var(--color-border)] hover:border-gray-400 bg-white'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name={q.id}
                                            value={opt.value}
                                            checked={answers[q.id] === opt.value}
                                            onChange={() => handleAnswer(q.id, opt.value)}
                                            className="hidden"
                                            required
                                        />
                                        <div className={`mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${answers[q.id] === opt.value ? 'border-[var(--color-primary)]' : 'border-gray-300'
                                            }`}>
                                            {answers[q.id] === opt.value && <div className="h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />}
                                        </div>
                                        <span className="text-base font-medium">{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {q.type === 'text' && (
                            <input
                                type="text"
                                className="w-full p-4 rounded-xl border border-[var(--color-border)] bg-gray-50 focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                                placeholder={q.placeholder}
                                onChange={(e) => handleAnswer(q.id, e.target.value)}
                                value={answers[q.id] || ''}
                                required
                            />
                        )}

                        {q.type === 'textarea' && (
                            <textarea
                                className="w-full p-4 rounded-xl border border-[var(--color-border)] bg-gray-50 focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all h-32"
                                placeholder={q.placeholder}
                                onChange={(e) => handleAnswer(q.id, e.target.value)}
                                value={answers[q.id] || ''}
                                required
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="pt-6">
                <button
                    type="submit"
                    disabled={!isComplete}
                    className="btn-primary w-full py-5 text-lg"
                >
                    {buttonLabel}
                    <span className="material-icons-outlined">arrow_forward</span>
                </button>
            </div>
        </form>
    );
}
