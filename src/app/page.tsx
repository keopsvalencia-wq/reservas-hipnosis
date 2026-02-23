'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingWizard } from '@/components/BookingWizard';

type Slide = {
  id: string;
  title: string;
  content: React.ReactNode;
};

export default function Home() {
  const [step, setStep] = useState<'intro' | 'booking'>('intro');
  const [slideIndex, setSlideIndex] = useState(0);

  const slides: Slide[] = [
    {
      id: 'intro',
      title: 'Solicita tu Evaluación Diagnóstica',
      content: (
        <div className="space-y-6">
          <p className="text-base text-[var(--color-text-muted)] leading-relaxed text-center">
            Selecciona el día y la hora que mejor se adapten a ti.
            Recuerda que mi agenda es muy limitada y solo acepto entre <strong>3 y 5 casos nuevos al mes</strong>.
          </p>
          <div className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] p-6 space-y-4">
            <p className="text-sm font-semibold text-[var(--color-secondary)]">
              En esta sesión de <span className="text-[var(--color-primary)]">45 minutos</span>:
            </p>
            <ul className="space-y-3 text-sm text-[var(--color-text-muted)]">
              {[
                'Analizaremos la raíz exacta de tu problema.',
                'Veremos si tu caso es 100% apto para el Método Reset.',
                'Si lo es, te explicaré el plan exacto para solucionarlo definitivamente.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="material-icons-outlined text-[var(--color-primary)] text-[18px] mt-0.5 flex-shrink-0">
                    check_circle
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'regalo1',
      title: '🎁 Regalo 1: Paz Mental',
      content: (
        <div className="space-y-6 text-center">
          <div className="w-16 h-16 bg-[var(--color-primary-soft)] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-icons-outlined text-[var(--color-primary)] text-3xl">psychology</span>
          </div>
          <p className="text-lg text-[var(--color-secondary)] leading-relaxed">
            Entenderás de una vez por todas qué te pasa realmente.
          </p>
          <p className="text-sm text-[var(--color-text-muted)] italic">
            "Mis pacientes me dicen que esta revelación les ha dado más paz mental en 45 minutos que años de terapias convencionales."
          </p>
        </div>
      )
    },
    {
      id: 'regalo2',
      title: '🎁 Regalo 2: El Origen',
      content: (
        <div className="space-y-6 text-center">
          <div className="w-16 h-16 bg-[var(--color-primary-soft)] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-icons-outlined text-[var(--color-primary)] text-3xl">history</span>
          </div>
          <p className="text-lg text-[var(--color-secondary)] leading-relaxed">
            Verás exactamente por qué NO te ha funcionado nada de lo que has intentado hasta hoy.
          </p>
        </div>
      )
    },
    {
      id: 'regalo3',
      title: '🎁 Regalo 3: La Solución',
      content: (
        <div className="space-y-6 text-center">
          <div className="w-16 h-16 bg-[var(--color-primary-soft)] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-icons-outlined text-[var(--color-primary)] text-3xl">lightbulb</span>
          </div>
          <p className="text-lg text-[var(--color-secondary)] leading-relaxed">
            Descubrirás cuál es la verdadera y única solución a tu problema.
          </p>
          <div className="pt-4">
            <div className="flex items-start gap-3 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] text-left">
              <span className="text-2xl flex-shrink-0">🛡️</span>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                <strong className="text-[var(--color-secondary)]">Garantía:</strong> Si durante la sesión veo que no te puedo garantizar resultados, el coste será <strong className="text-[var(--color-primary)]">0€</strong>.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentSlide = slides[slideIndex];

  const handleNext = () => {
    if (slideIndex < slides.length - 1) {
      setSlideIndex(prev => prev + 1);
    } else {
      setStep('booking');
    }
  };

  const handleBack = () => {
    if (slideIndex > 0) {
      setSlideIndex(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {step === 'intro' ? (
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Slide Title */}
              <div className="text-center space-y-2">
                <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--color-secondary)]">
                  {currentSlide.title}
                </h1>
                <div className="flex justify-center gap-1 mt-4">
                  {slides.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === slideIndex ? 'w-8 bg-[var(--color-primary)]' : 'w-2 bg-gray-200'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Slide Content */}
              <div className="bg-white rounded-3xl p-2">
                {currentSlide.content}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-4 pt-4">
                <button
                  onClick={handleBack}
                  disabled={slideIndex === 0}
                  className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-secondary)] font-medium disabled:opacity-0 transition-all"
                >
                  <span className="material-icons-outlined text-xl">arrow_back</span>
                  Anterior
                </button>
                <button
                  onClick={handleNext}
                  className="btn-primary flex-1 max-w-[200px] py-4 rounded-2xl text-base shadow-lg shadow-[#39DCA822]"
                >
                  {slideIndex === slides.length - 1 ? 'Empezar ahora' : 'Siguiente'}
                  <span className="material-icons-outlined text-xl">arrow_forward</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-sm border border-[var(--color-border)] p-4 sm:p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <button
                  onClick={() => setStep('intro')}
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-secondary)] flex items-center gap-1 text-sm font-medium"
                >
                  <span className="material-icons-outlined text-base">arrow_back</span>
                  Ver introducción
                </button>
                <div className="text-center">
                  <span className="material-icons-outlined text-[var(--color-primary)] text-3xl">psychology</span>
                </div>
                <div className="w-20" /> {/* Spacer */}
              </div>
              <BookingWizard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
