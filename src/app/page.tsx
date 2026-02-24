'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingWizard } from '@/components/BookingWizard';
import { TriageForm } from '@/components/TriageForm';
import { GATE_BLOCKED_VALUE, GATE_BLOCKED_NOTE } from '@/data/triage-questions';
import { TriageAnswers } from '@/lib/types';

// ──────────────────────────────────────────────────
// 8-SCREEN LINEAR FLOW
// P1: CTA        P2: Regalo      P3: Motivo (multi)
// P4: Miedo      P5: Datos       P6: Contraste
// P7: Filtros    P8: Booking
// ──────────────────────────────────────────────────

export default function Home() {
  const [screen, setScreen] = useState(0);
  const [triageData, setTriageData] = useState<TriageAnswers>({});
  const [isBlocked, setIsBlocked] = useState(false);

  const TOTAL = 8;
  const progress = ((screen + 1) / TOTAL) * 100;

  const next = () => setScreen(s => s + 1);
  const back = () => setScreen(s => Math.max(0, s - 1));

  const handleTriageStep = (answers: TriageAnswers) => {
    const merged = { ...triageData, ...answers };
    setTriageData(merged);

    // P7 gate check
    if (merged.inversion === GATE_BLOCKED_VALUE) {
      setIsBlocked(true);
      return;
    }
    next();
  };

  // ─── Blocked screen ───────────────────────────────
  if (isBlocked) {
    return (
      <Shell progress={100}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-6 py-10">
          <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto">
            <span className="material-icons-outlined text-amber-500 text-4xl">favorite</span>
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-secondary)]">Gracias por tu sinceridad</h2>
          <p className="text-[var(--color-text-muted)] max-w-md mx-auto leading-relaxed">
            {GATE_BLOCKED_NOTE}
          </p>
          <button onClick={() => { setIsBlocked(false); setScreen(6); }} className="text-sm text-[var(--color-primary)] underline">
            Cambiar mi respuesta
          </button>
        </motion.div>
      </Shell>
    );
  }

  // ─── Screen renderer ──────────────────────────────
  const renderScreen = () => {
    switch (screen) {
      // ─── P1: CTA ─────────────────────────────
      case 0:
        return (
          <div className="text-center space-y-8 py-10">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-black text-[var(--color-secondary)] leading-tight">
                Solicita tu Evaluación<br />
                <span className="text-[var(--color-primary)]">Diagnóstica</span>
              </h1>
              <p className="text-lg text-[var(--color-text-muted)] max-w-lg mx-auto">
                Descubre si la Hipnosis Clínica puede ayudarte a resolver tu problema de raíz en pocas sesiones.
              </p>
            </div>
            <motion.button
              onClick={next}
              className="btn-primary text-lg py-5 px-10 mx-auto"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Ver disponibilidad y reservar
              <span className="material-icons-outlined">arrow_forward</span>
            </motion.button>
            <p className="text-xs text-gray-400">Solo de 3 a 5 plazas disponibles al mes</p>
          </div>
        );

      // ─── P2: Regalo ──────────────────────────
      case 1:
        return (
          <div className="text-center space-y-8 py-8">
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary-soft)] flex items-center justify-center mx-auto">
              <span className="material-icons-outlined text-[var(--color-primary)] text-3xl">card_giftcard</span>
            </div>
            <div className="space-y-4 max-w-2xl mx-auto">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">Un regalo para ti</p>
              <h2 className="text-2xl md:text-3xl font-black text-[var(--color-secondary)]">
                3 Regalos de Claridad
              </h2>
              <p className="text-base text-[var(--color-text-muted)] leading-relaxed">
                Al asistir a tu evaluación, te llevarás <strong>3 regalos de claridad</strong> para liberar la presión de tu cabeza:
              </p>
              <div className="grid gap-4 text-left max-w-lg mx-auto">
                <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                  <span className="text-xl mt-0.5">🎁</span>
                  <p className="text-sm text-[var(--color-secondary)] font-medium">Entenderás por fin <strong>qué te pasa realmente</strong></p>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                  <span className="text-xl mt-0.5">🎁</span>
                  <p className="text-sm text-[var(--color-secondary)] font-medium">Sabrás <strong>por qué nada ha funcionado</strong> hasta hoy</p>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                  <span className="text-xl mt-0.5">🎁</span>
                  <p className="text-sm text-[var(--color-secondary)] font-medium">Descubrirás <strong>la verdadera solución definitiva</strong></p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <button onClick={back} className="text-[var(--color-text-muted)] font-bold flex items-center gap-2 hover:text-[var(--color-secondary)]">
                <span className="material-icons-outlined">arrow_back</span> Atrás
              </button>
              <button onClick={next} className="btn-primary py-4 px-8 text-base">
                Siguiente <span className="material-icons-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        );

      // ─── P3: Motivo (multiselect) ────────────
      case 2:
        return (
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] text-center">Paso 1 de 6</p>
            <TriageForm subset={['motivo_consulta']} onComplete={handleTriageStep} onBack={back} buttonLabel="Siguiente" />
          </div>
        );

      // ─── P4: Miedo ───────────────────────────
      case 3:
        return (
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] text-center">Paso 2 de 6</p>
            <TriageForm subset={['miedo_futuro']} onComplete={handleTriageStep} onBack={back} buttonLabel="Siguiente" />
          </div>
        );

      // ─── P5: Datos ───────────────────────────
      case 4:
        return (
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] text-center">Paso 3 de 6</p>
            <TriageForm subset={['dedicacion', 'ciudad', 'edad']} onComplete={handleTriageStep} onBack={back} buttonLabel="Siguiente" />
          </div>
        );

      // ─── P6: Contraste ───────────────────────
      case 5:
        return (
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] text-center">Paso 4 de 6</p>
            <h2 className="text-xl font-black text-[var(--color-secondary)] text-center">¿Dónde estás y a dónde quieres llegar?</h2>
            <TriageForm subset={['situacion_actual', 'situacion_deseada']} onComplete={handleTriageStep} onBack={back} buttonLabel="Siguiente" />
          </div>
        );

      // ─── P7: Filtros ─────────────────────────
      case 6:
        return (
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] text-center">Paso 5 de 6</p>
            <TriageForm subset={['compromiso_escala', 'inversion']} onComplete={handleTriageStep} onBack={back} buttonLabel="Confirmar mi compromiso y ver agenda" />
          </div>
        );

      // ─── P8: Booking ─────────────────────────
      case 7:
        return <BookingWizard preloadedData={{ triageAnswers: triageData }} onBack={back} />;

      default:
        return null;
    }
  };

  return (
    <Shell progress={progress} showProgress={screen > 0 && screen < 7}>
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </Shell>
  );
}

// ──────────────────────────────────────────────────
// SHELL: White card container + optional progress bar
// ──────────────────────────────────────────────────
function Shell({ children, progress, showProgress = true }: { children: React.ReactNode; progress: number; showProgress?: boolean }) {
  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl">
        {/* Progress bar */}
        {showProgress && (
          <div className="mb-6">
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[var(--color-primary)] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-[var(--color-border)] p-6 md:p-14 lg:p-20 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
