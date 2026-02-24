'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingWizard } from '@/components/BookingWizard';
import { TriageForm } from '@/components/TriageForm';
import { GATE_INTRO_TEXT, GATE_BLOCKED_VALUE, GATE_BLOCKED_NOTE, GATE_QUESTION_ID } from '@/data/triage-questions';
import { TriageAnswers } from '@/lib/types';

// ──────────────────────────────────────────────────
// EMBUDO 8 PANTALLAS — Re-ingeniería
// P1: Bienvenida      P2: Regalos       P3: Datos+Motivo
// P4: Contraste       P5: Compromiso    P6: Inversión (gate)
// P7: Calendario      P8: Confirmación
// ──────────────────────────────────────────────────

export default function Home() {
  const [screen, setScreen] = useState(0);
  const [triageData, setTriageData] = useState<TriageAnswers>({});
  const [contactData, setContactData] = useState({ name: '', email: '', phone: '' });
  const [isBlocked, setIsBlocked] = useState(false);

  const TOTAL = 8;
  const progress = ((screen + 1) / TOTAL) * 100;

  const next = () => setScreen(s => s + 1);
  const back = () => setScreen(s => Math.max(0, s - 1));

  // P3: Datos de contacto + Motivo
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
    setContactData({ name, email, phone });
    // motivo handled separately by TriageForm subset rendered within same screen
    next();
  };

  // Triage steps handler
  const handleTriageStep = (answers: TriageAnswers) => {
    const merged = { ...triageData, ...answers };
    setTriageData(merged);

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
          <p className="text-[var(--color-text-muted)] max-w-md mx-auto leading-relaxed">{GATE_BLOCKED_NOTE}</p>
          <button onClick={() => { setIsBlocked(false); setScreen(5); }} className="text-sm text-[var(--color-primary)] underline">
            Cambiar mi respuesta
          </button>
        </motion.div>
      </Shell>
    );
  }

  // ─── Screen renderer ──────────────────────────────
  const renderScreen = () => {
    switch (screen) {
      // ─── P1: BIENVENIDA ──────────────────────
      case 0:
        return (
          <div className="text-center space-y-8 py-8">
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">Solo de 3 a 5 plazas al mes</p>
              <h1 className="text-3xl md:text-4xl font-black text-[var(--color-secondary)] leading-tight">
                Solicita tu Evaluación<br />
                <span className="text-[var(--color-primary)]">Diagnóstica</span>
              </h1>
              <p className="text-base text-[var(--color-text-muted)] max-w-xl mx-auto leading-relaxed">
                Cada mes solo acepto entre <strong>3 y 5 casos nuevos</strong> para garantizar la máxima atención.
                Descubre si el <strong>Método RESET</strong> puede ayudarte a resolver tu problema de raíz.
              </p>
            </div>
            <div className="grid gap-3 max-w-md mx-auto text-left">
              {[
                { icon: '🧠', text: 'Hipnosis Clínica de última generación' },
                { icon: '⚡', text: 'Resultados desde la primera sesión' },
                { icon: '🛡️', text: 'Garantía: si no te puedo ayudar, coste 0€' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                  <span className="text-lg">{item.icon}</span>
                  <p className="text-sm font-medium text-[var(--color-secondary)]">{item.text}</p>
                </div>
              ))}
            </div>
            <motion.button onClick={next} className="btn-primary text-lg py-5 px-10 mx-auto" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              Ver disponibilidad y reservar
              <span className="material-icons-outlined">arrow_forward</span>
            </motion.button>
          </div>
        );

      // ─── P2: REGALOS ─────────────────────────
      case 1:
        return (
          <div className="text-center space-y-8 py-8">
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary-soft)] flex items-center justify-center mx-auto">
              <span className="material-icons-outlined text-[var(--color-primary)] text-3xl">card_giftcard</span>
            </div>
            <div className="space-y-4 max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-black text-[var(--color-secondary)]">3 Regalos de Claridad</h2>
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
            <NavButtons onBack={back} onNext={next} />
          </div>
        );

      // ─── P3: DATOS + MOTIVO ──────────────────
      case 2:
        return (
          <div className="space-y-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] text-center">Paso 1 de 4</p>
            <h2 className="text-xl font-black text-[var(--color-secondary)] text-center">Cuéntanos sobre ti</h2>
            <DataAndMotivoForm
              contactData={contactData}
              triageData={triageData}
              onSubmit={(contact, motivo) => {
                setContactData(contact);
                setTriageData(prev => ({ ...prev, ...motivo }));
                next();
              }}
              onBack={back}
            />
          </div>
        );

      // ─── P4: CONTRASTE ───────────────────────
      case 3:
        return (
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] text-center">Paso 2 de 4</p>
            <h2 className="text-xl font-black text-[var(--color-secondary)] text-center">¿Dónde estás y a dónde quieres llegar?</h2>
            <TriageForm subset={['situacion_actual', 'situacion_deseada']} onComplete={handleTriageStep} onBack={back} buttonLabel="Siguiente" />
          </div>
        );

      // ─── P5: COMPROMISO ──────────────────────
      case 4:
        return (
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] text-center">Paso 3 de 4</p>
            <TriageForm subset={['compromiso_escala', 'disponibilidad_tiempo']} onComplete={handleTriageStep} onBack={back} buttonLabel="Siguiente" />
          </div>
        );

      // ─── P6: INVERSIÓN (Gate) ────────────────
      case 5:
        return (
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] text-center">Paso 4 de 4</p>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 max-w-xl mx-auto space-y-3">
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">{GATE_INTRO_TEXT}</p>
            </div>
            <TriageForm subset={['inversion']} onComplete={handleTriageStep} onBack={back} buttonLabel="Confirmar mi compromiso y ver agenda" />
          </div>
        );

      // ─── P7+P8: BOOKING ──────────────────────
      case 6:
        return (
          <BookingWizard
            preloadedData={{ triageAnswers: triageData, name: contactData.name, email: contactData.email, phone: contactData.phone }}
            onBack={back}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Shell progress={progress} showProgress={screen > 0 && screen < 6}>
      <AnimatePresence mode="wait">
        <motion.div
          key={screen + (isBlocked ? '_blocked' : '')}
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
// SHELL: White card + optional progress bar
// ──────────────────────────────────────────────────
function Shell({ children, progress, showProgress = true }: { children: React.ReactNode; progress: number; showProgress?: boolean }) {
  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl">
        {showProgress && (
          <div className="mb-6">
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div className="h-full bg-[var(--color-primary)] rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: 'easeOut' }} />
            </div>
          </div>
        )}
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-[var(--color-border)] p-6 md:p-14 lg:p-20 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────
// NAV BUTTONS
// ──────────────────────────────────────────────────
function NavButtons({ onBack, onNext, nextLabel = 'Siguiente' }: { onBack: () => void; onNext: () => void; nextLabel?: string }) {
  return (
    <div className="flex items-center justify-center gap-4">
      <button onClick={onBack} className="text-[var(--color-text-muted)] font-bold flex items-center gap-2 hover:text-[var(--color-secondary)]">
        <span className="material-icons-outlined">arrow_back</span> Atrás
      </button>
      <button onClick={onNext} className="btn-primary py-4 px-8 text-base">
        {nextLabel} <span className="material-icons-outlined">arrow_forward</span>
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────────
// P3: Combined Datos + Motivo form
// ──────────────────────────────────────────────────
function DataAndMotivoForm({
  contactData,
  triageData,
  onSubmit,
  onBack,
}: {
  contactData: { name: string; email: string; phone: string };
  triageData: TriageAnswers;
  onSubmit: (contact: { name: string; email: string; phone: string }, motivo: TriageAnswers) => void;
  onBack: () => void;
}) {
  const [name, setName] = useState(contactData.name);
  const [email, setEmail] = useState(contactData.email);
  const [phone, setPhone] = useState(contactData.phone);
  const [motivos, setMotivos] = useState<string[]>(
    Array.isArray(triageData.motivo_consulta) ? triageData.motivo_consulta as string[] : []
  );

  const motivoOptions = [
    { value: 'ansiedad_bloqueos', label: 'Ansiedad / Bloqueos' },
    { value: 'depresion', label: 'Depresión' },
    { value: 'traumas', label: 'Traumas' },
    { value: 'adicciones', label: 'Adicciones' },
    { value: 'fobias', label: 'Fobias' },
    { value: 'otros', label: 'Otros' },
  ];

  const toggleMotivo = (val: string) => {
    setMotivos(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  const isValid = name.trim() && email.trim() && phone.trim() && motivos.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onSubmit({ name, email, phone }, { motivo_consulta: motivos });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact fields */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[var(--color-secondary)]">Nombre *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons-outlined text-gray-400 text-lg">person</span>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre completo" required
              className="w-full pl-10 pr-4 py-3 text-sm border-2 border-[var(--color-border)] rounded-xl bg-gray-50 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-colors" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[var(--color-secondary)]">Email *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons-outlined text-gray-400 text-lg">email</span>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required
              className="w-full pl-10 pr-4 py-3 text-sm border-2 border-[var(--color-border)] rounded-xl bg-gray-50 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-colors" />
          </div>
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[var(--color-secondary)]">WhatsApp *</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons-outlined text-gray-400 text-lg">phone</span>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+34 600 000 000" required
            className="w-full pl-10 pr-4 py-3 text-sm border-2 border-[var(--color-border)] rounded-xl bg-gray-50 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-colors" />
        </div>
      </div>

      {/* Motivo multiselect */}
      <div className="space-y-3">
        <label className="block text-lg font-bold text-[var(--color-secondary)]">¿Cuál es tu principal motivo de consulta?</label>
        <div className="flex flex-wrap gap-3">
          {motivoOptions.map(opt => {
            const selected = motivos.includes(opt.value);
            return (
              <button key={opt.value} type="button" onClick={() => toggleMotivo(opt.value)}
                className={`px-5 py-3 rounded-2xl border-2 font-semibold transition-all text-sm ${selected
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-secondary)]'
                    : 'border-[var(--color-border)] bg-white text-[var(--color-text-muted)] hover:border-gray-400'
                  }`}>
                {selected && <span className="mr-1">✓</span>}
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between pt-4">
        <button type="button" onClick={onBack} className="text-[var(--color-text-muted)] font-bold flex items-center gap-2 hover:text-[var(--color-secondary)]">
          <span className="material-icons-outlined">arrow_back</span> Atrás
        </button>
        <button type="submit" disabled={!isValid} className="btn-primary py-4 px-8 text-base">
          Siguiente <span className="material-icons-outlined">arrow_forward</span>
        </button>
      </div>
    </form>
  );
}
