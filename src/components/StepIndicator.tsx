'use client';

import { WizardStep } from '@/lib/types';

interface StepIndicatorProps {
    currentStep: WizardStep;
}

const steps = [
    { label: 'Filtro', step: 0 as WizardStep },
    { label: 'Ubicación', step: 1 as WizardStep },
    { label: 'Fecha', step: 2 as WizardStep },
    { label: 'Datos', step: 3 as WizardStep },
];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
    return (
        <div className="mb-10">
            {/* Step circles + connector bars (Stitch style) */}
            <div className="flex items-center justify-between mb-4">
                {steps.map(({ label, step }, index) => {
                    const isActive = currentStep === step;
                    const isCompleted = currentStep > step;

                    return (
                        <div key={step} className="flex items-center flex-1 last:flex-none">
                            {/* Circle + Label */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`
                                        w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
                                        ${isCompleted
                                            ? 'bg-[var(--color-secondary)] text-white'
                                            : isActive
                                                ? 'bg-[var(--color-primary)] text-[var(--color-secondary)] ring-4 ring-[var(--color-primary-soft)]'
                                                : 'bg-gray-200 text-gray-500'
                                        }
                                    `}
                                >
                                    {isCompleted ? (
                                        <span className="material-icons-outlined text-[16px]">check</span>
                                    ) : (
                                        step + 1
                                    )}
                                </div>
                                <span
                                    className={`
                                        text-xs font-medium mt-2 whitespace-nowrap
                                        ${isActive
                                            ? 'text-[var(--color-primary)] font-bold'
                                            : isCompleted
                                                ? 'text-[var(--color-secondary)]'
                                                : 'text-gray-400'
                                        }
                                    `}
                                >
                                    {label}
                                </span>
                            </div>

                            {/* Connector bar */}
                            {index < steps.length - 1 && (
                                <div
                                    className={`
                                        flex-1 h-1 mx-4 mt-[-16px] rounded transition-colors duration-300
                                        ${isCompleted
                                            ? 'bg-[var(--color-secondary)]'
                                            : 'bg-gray-200'
                                        }
                                    `}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
