'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingWizard } from '@/components/BookingWizard';
import { TriageForm } from '@/components/TriageForm';
import { TriageAnswers, BookingData } from '@/lib/types';
import { GATE_BLOCKED_VALUE, GATE_QUESTION_ID } from '@/data/triage-questions';

export default function Home() {
  // 0-3: Intro/Regalos, 4: Triaje A, 5: Triaje B, 6: Triaje C, 7: Booking
  const [screenIndex, setScreenIndex] = useState(0);
  const [bookingData, setBookingData] = useState<Partial<BookingData>>({
    triageAnswers: {}
  });
  const [isBlocked, setIsBlocked] = useState(false);

  const handleNext = () => {
    setScreenIndex(prev => prev + 1);
  };

  const handleBack = () => {
    if (screenIndex > 0) setScreenIndex(prev => prev - 1);
  };

  const handleTriagePart = (answers: TriageAnswers) => {
    const newAnswers = { ...bookingData.triageAnswers, ...answers };
    setBookingData(prev => ({ ...prev, triageAnswers: newAnswers }));

    // Check blocking logic for Screen 7 (Triage C)
    if (screenIndex === 6 && answers[GATE_QUESTION_ID] === GATE_BLOCKED_VALUE) {
      setIsBlocked(true);
      return;
    }

    handleNext();
  };

  // ─── Renderers ────────────────────────────────────

  const renderScreen = () => {
    if (isBlocked) {
      return (
        <div className="flex flex-col items-center justify-center text-center space-y-6 py-12 px-4 max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
            <span className="material-icons-outlined text-red-500 text-4xl">block</span>
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-secondary)]">Gracias por tu sinceridad</h2>
          <p className="text-[var(--color-text-muted)] leading-relaxed">
            En este momento, mi método requiere un nivel de inversión y compromiso que no parece encajar con tu situación actual.
            No reserves la sesión ahora mismo para no quitarle la plaza a otra persona. Vuelve cuando sea tu momento adecuado. Podrás encontrar recursos gratuitos en mis redes sociales.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Volver al inicio
          </button>
        </div>
      );
    }

    switch (screenIndex) {
      case 0: // Intro
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-4">
              <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--color-secondary)] leading-tight">
                Solicita tu Evaluación Diagnóstica
              </h1>
              <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
                Estás a un paso de empezar a solucionar tu problema de raíz.
              </p>
            </div>
            <div className="bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border)] p-8 md:p-12">
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: 'psychology', title: 'Raíz del Problema', desc: 'Analizaremos qué te pasa realmente.' },
                  { icon: 'verified', title: 'Metodología Especial', desc: 'Veremos si tu caso es apto para Reset.' },
                  { icon: 'trending_up', title: 'Plan de Acción', desc: 'Saldrás con un camino claro.' }
                ].map((item, i) => (
                  <li key={i} className="flex flex-col items-center text-center space-y-3">
                    <span className="material-icons-outlined text-[var(--color-primary)] text-4xl">{item.icon}</span>
                    <h3 className="font-bold text-[var(--color-secondary)]">{item.title}</h3>
                    <p className="text-sm text-[var(--color-text-muted)]">{item.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center pt-4">
              <button onClick={handleNext} className="btn-primary min-w-[300px] text-lg py-5 shadow-2xl">
                Empezar Evaluación Gratis
                <span className="material-icons-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        );
      case 1: // Gift 1
      case 2: // Gift 2
      case 3: // Gift 3
        return <GiftSlide index={screenIndex} onNext={handleNext} onBack={handleBack} />;
      case 4: // Triage A
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--color-secondary)] text-center">Cuéntame sobre ti</h2>
            <TriageForm
              onComplete={handleTriagePart}
              subset={['motivo_consulta']}
              buttonLabel="Siguiente"
            />
          </div>
        );
      case 5: // Triage B
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--color-secondary)] text-center">Mirando al futuro</h2>
            <TriageForm
              onComplete={handleTriagePart}
              subset={['miedo_futuro']}
              buttonLabel="Siguiente"
            />
          </div>
        );
      case 6: // Triage C (Qualification)
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--color-secondary)] text-center">Compromiso y Situación</h2>
            <TriageForm
              onComplete={handleTriagePart}
              subset={['dedicacion', 'ciudad', 'edad', 'situacion_actual', 'situacion_deseada', 'compromiso_escala', 'tiempo', 'inversion']}
              buttonLabel="Finalizar Evaluación y Reservar"
            />
          </div>
        );
      case 7: // Booking
        return <BookingWizard preloadedData={bookingData} onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl">
        {/* Global Progress Bar (Top) */}
        {screenIndex < 7 && !isBlocked && (
          <div className="flex justify-center gap-2 mb-10 overflow-hidden">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 max-w-[40px] rounded-full transition-all duration-500 ${i <= screenIndex ? 'bg-[var(--color-primary)]' : 'bg-gray-100'
                  }`}
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={screenIndex + (isBlocked ? '_blocked' : '')}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-[var(--color-border)] p-6 md:p-14 lg:p-20 overflow-hidden"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Subcomponentes ───────────────────────────────────

function GiftSlide({ index, onNext, onBack }: { index: number; onNext: () => void; onBack: () => void }) {
  const gifts = [
    { title: 'Regalo 1: Paz Mental', icon: 'psychology', text: 'Entenderás de una vez por todas qué te pasa realmente.', subtext: '"Mis pacientes me dicen que esta revelación les ha dado más paz mental en 45 minutos que años de terapias convencionales."' },
    { title: 'Regalo 2: El Origen', icon: 'history', text: 'Verás exactamente por qué NO te ha funcionado nada de lo que has intentado hasta hoy.', subtext: 'Identificaremos el bloqueo inconsciente que te mantiene estancado.' },
    { title: 'Regalo 3: La Solución', icon: 'lightbulb', text: 'Descubrirás cuál es la verdadera y única solución a tu problema.', subtext: '🛡️ Garantía: Si veo que no te puedo ayudar, el coste de la sesión es 0€.' },
  ];
  const gift = gifts[index - 1];

  return (
    <div className="space-y-10 text-center py-4">
      <div className="w-24 h-24 bg-[var(--color-primary-soft)] rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
        <span className="material-icons-outlined text-[var(--color-primary)] text-5xl">{gift.icon}</span>
      </div>
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--color-primary)]">Reclama tu regalo</h3>
        <h2 className="text-3xl md:text-5xl font-black text-[var(--color-secondary)]">{gift.title}</h2>
        <p className="text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed">
          {gift.text}
        </p>
        {gift.subtext && (
          <div className="mt-8 p-6 bg-gray-50 rounded-2xl italic text-[var(--color-text-muted)] border-l-4 border-[var(--color-primary)] inline-block">
            {gift.subtext}
          </div>
        )}
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-10">
        <button onClick={onBack} className="text-[var(--color-text-muted)] font-bold flex items-center gap-2 hover:text-[var(--color-secondary)]">
          <span className="material-icons-outlined">arrow_back</span>
          Anterior
        </button>
        <button onClick={onNext} className="btn-primary min-w-[240px] py-5">
          Continuar
          <span className="material-icons-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
