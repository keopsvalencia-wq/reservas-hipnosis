'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingWizard } from '../components/BookingWizard';
import { TriageForm } from '@/components/TriageForm';
import { GATE_BLOCKED_VALUE, GATE_BLOCKED_NOTE } from '@/data/triage-questions';
import { TriageAnswers } from '@/lib/types';

// ──────────────────────────────────────────────────
// EMBUDO 10 PANTALLAS — REVERSIÓN A DISEÑO ORIGINAL
// Centrado, una columna, botones fijos abajo.
// ──────────────────────────────────────────────────

const MOTIVO_OPTIONS = [
  'Ansiedad',
  'Estrés',
  'Depresión',
  'Bloqueos Emocionales',
  'Adicciones (Tabaco, Alcohol, etc.)',
  'Fobias y Miedos específicos',
  'Tristeza, Duelo y Pérdida',
  'Trastornos del Sueño',
  'Otros',
];

const IMPACTO_OPTIONS = [
  'Enfermar físicamente por el estrés',
  'Perder a mi familia o pareja',
  'Arruinarme o perder mi trabajo',
  'Quedarme solo/a para siempre',
  'No volver a ser yo mismo/a nunca',
  'Otro miedo diferente',
];

export default function Home() {
  const [screen, setScreen] = useState(0);
  const [triageData, setTriageData] = useState<TriageAnswers>({});
  const [contactData, setContactData] = useState({ name: '', lastName: '', email: '', phone: '' });
  const [isBlocked, setIsBlocked] = useState(false);

  const next = () => setScreen(s => s + 1);
  const back = () => setScreen(s => Math.max(0, s - 1));

  const handleTriageStep = (answers: TriageAnswers) => {
    const merged = { ...triageData, ...answers };
    setTriageData(merged);
    if (merged.inversion === GATE_BLOCKED_VALUE) {
      setIsBlocked(true);
      return;
    }
    next();
  };

  const handleChoice = (key: keyof TriageAnswers, value: string | string[]) => {
    setTriageData(prev => ({ ...prev, [key]: value } as TriageAnswers));
    next();
  };

  // ─── Blocked screen ───────────────────────────────
  if (isBlocked) {
    return (
      <MasterScreen>
        <StepLayout>
          <div className="flex-1 flex flex-col justify-center text-center space-y-6 px-4">
            <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto">
              <span className="material-icons-outlined text-amber-500 text-4xl">favorite</span>
            </div>
            <h2 className="text-2xl font-black text-[var(--color-secondary)]">Gracias por tu sinceridad</h2>
            <p className="text-[var(--color-text-muted)] leading-relaxed font-medium">{GATE_BLOCKED_NOTE}</p>
            <button onClick={() => { setIsBlocked(false); setScreen(7); }} className="text-sm text-[var(--color-primary)] font-bold underline">
              Cambiar mi respuesta
            </button>
          </div>
        </StepLayout>
      </MasterScreen>
    );
  }

  const renderScreen = () => {
    switch (screen) {
      case 0:
        return (
          <StepLayout
            footer={
              <button
                onClick={next}
                className="btn-primary w-full"
              >
                RESERVAR MI PLAZA AHORA
              </button>
            }
          >
            <div className="flex-1 flex flex-col justify-center space-y-8">
              <div className="space-y-4 text-center">
                <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto border-2 border-[var(--color-primary-soft)] shadow-sm">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SALVA-HIPNOSIS-P-2-6-q3Q6B3Z9Z6Z6Z6Z6Z6Z6Z6Z6Z6Z.png"
                    alt="Salva Vera"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'top' }}
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-[var(--color-secondary)] leading-tight tracking-tight">Evaluación Diagnóstica</h1>
                  <p className="text-[var(--color-primary)] font-bold uppercase tracking-[0.2em] text-[10px] mt-1">Salva Vera • Hipnosis Profesional</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-base text-center text-[var(--color-text-muted)] leading-relaxed font-medium">
                  Analizaremos la raíz de tu problema en 45 min y trazaremos el plan exacto para arrancarlo definitivamente.
                </p>
                <div className="bg-[var(--color-primary-soft)] rounded-2xl p-5 border border-emerald-50 text-center">
                  <p className="text-xs text-[var(--color-secondary)] font-bold leading-relaxed">
                    🛡️ Garantía: Si veo que no puedo garantizarte resultados, la sesión será gratuita.
                  </p>
                </div>
              </div>
            </div>
          </StepLayout>
        );

      case 1:
        return (
          <StepLayout footer={<StepNav onBack={back} onNext={next} />}>
            <div className="flex-1 flex flex-col justify-center space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-black text-[var(--color-secondary)]">3 Regalos de Claridad</h2>
                <div className="h-1.5 w-12 bg-[var(--color-primary)] mx-auto rounded-full" />
              </div>
              <div className="space-y-3">
                {[
                  { id: '01', text: 'Nueva perspectiva sobre tu problema.' },
                  { id: '02', text: 'Por qué lo anterior no ha funcionado.' },
                  { id: '03', text: 'La única solución definitiva real.' }
                ].map(card => (
                  <div key={card.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4 items-center">
                    <span className="text-xl font-black text-[var(--color-primary)] opacity-30">{card.id}</span>
                    <p className="text-sm font-bold text-[var(--color-secondary)]">{card.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </StepLayout>
        );

      case 2:
        return (
          <ChoiceCardScreen
            title="¿Motivo de consulta?"
            options={MOTIVO_OPTIONS}
            selected={triageData.motivo_consulta as string | string[]}
            onSelect={(val) => handleChoice('motivo_consulta', val)}
            onBack={back}
            multi
          />
        );

      case 3:
        return (
          <StepLayout>
            <div className="flex-1 flex flex-col min-h-0">
              <div className="text-center mb-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] mb-1">Paso 2 de 7</p>
                <h2 className="text-2xl font-black text-[var(--color-secondary)]">Tu perfil</h2>
              </div>
              <TriageForm subset={['dedicacion', 'ciudad', 'edad']} onComplete={handleTriageStep} onBack={back} buttonLabel="SIGUIENTE PASO" />
            </div>
          </StepLayout>
        );

      case 4:
        return (
          <ChoiceCardScreen
            title="¿Qué miedo te da el no solucionar esto?"
            options={IMPACTO_OPTIONS}
            selected={triageData.impacto_emocional as string | string[]}
            onSelect={(val) => handleChoice('impacto_emocional', val)}
            onBack={back}
            multi
          />
        );

      case 5:
        return (
          <ContrastScreen
            triageData={triageData}
            onComplete={(answers: Partial<TriageAnswers>) => { setTriageData(prev => ({ ...prev, ...answers } as TriageAnswers)); next(); }}
            onBack={back}
          />
        );

      case 6:
        return (
          <StepLayout>
            <div className="flex-1 flex flex-col min-h-0">
              <div className="text-center mb-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] mb-1">Paso 5 de 7</p>
                <h2 className="text-2xl font-black text-[var(--color-secondary)]">Tu compromiso</h2>
              </div>
              <TriageForm subset={['compromiso_escala', 'disponibilidad_tiempo']} onComplete={handleTriageStep} onBack={back} buttonLabel="SIGUIENTE PASO" />
            </div>
          </StepLayout>
        );

      case 7:
        return (
          <StepLayout>
            <div className="flex-1 flex flex-col min-h-0">
              <div className="text-center mb-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] mb-1">Paso 6 de 7</p>
                <h2 className="text-2xl font-black text-[var(--color-secondary)]">La Inversión</h2>
              </div>
              <TriageForm subset={['inversion']} onComplete={handleTriageStep} onBack={back} buttonLabel="CONFIRMAR Y VER AGENDA" />
            </div>
          </StepLayout>
        );

      case 8:
        return (
          <StepLayout>
            <div className="flex-1 flex flex-col min-h-0">
              <div className="text-center mb-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] mb-1">Paso 7 de 7</p>
                <h2 className="text-2xl font-black text-[var(--color-secondary)]">Datos de contacto</h2>
              </div>
              <ContactForm
                contactData={contactData}
                onSubmit={(data) => { setContactData(data); next(); }}
                onBack={back}
              />
            </div>
          </StepLayout>
        );

      case 9:
        return (
          <BookingWizard
            preloadedData={{
              triageAnswers: triageData,
              name: contactData.name,
              lastName: contactData.lastName,
              email: contactData.email,
              phone: contactData.phone
            }}
            onBack={back}
          />
        );

      default:
        return null;
    }
  };

  return (
    <MasterScreen>
      <AnimatePresence mode="wait">
        <motion.div
          key={screen + (isBlocked ? '_blocked' : '')}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="flex-1 flex flex-col min-h-0"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </MasterScreen>
  );
}

// ──────────────────────────────────────────────────
// SHARED UI COMPONENTS
// ──────────────────────────────────────────────────

function MasterScreen({ children }: { children: React.ReactNode }) {
  return (
    <div className="master-screen">
      <div className="master-screen__container">
        {children}
      </div>
    </div>
  );
}

function StepLayout({ children, footer }: { children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div className="step-layout">
      <div className="step-layout__content">
        {children}
      </div>
      {footer && (
        <div className="step-layout__footer">
          {footer}
        </div>
      )}
    </div>
  );
}

function StepNav({ onBack, onNext, nextLabel = 'SIGUIENTE PASO' }: { onBack: () => void, onNext: () => void, nextLabel?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 w-full">
      <button onClick={onBack} className="btn-back">
        <span className="material-icons-outlined">arrow_back</span>
        Atrás
      </button>
      <button onClick={onNext} className="btn-primary flex-1">
        {nextLabel}
      </button>
    </div>
  );
}

function ChoiceCardScreen({ title, options, selected, onSelect, onBack, multi }: {
  title: string;
  options: string[];
  selected: string | string[];
  onSelect: (val: string | string[]) => void;
  onBack: () => void;
  multi?: boolean;
}) {
  const [current, setCurrent] = useState<string[]>(Array.isArray(selected) ? selected : selected ? [selected] : []);
  const toggle = (opt: string) => {
    if (multi) {
      const next = current.includes(opt) ? current.filter(o => o !== opt) : [...current, opt];
      setCurrent(next);
    } else {
      onSelect(opt);
    }
  };

  return (
    <StepLayout footer={<StepNav onBack={onBack} onNext={() => onSelect(current)} />}>
      <div className="flex-1 flex flex-col justify-center space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-[var(--color-secondary)] leading-tight">{title}</h2>
          <p className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest">{multi ? 'Selección múltiple' : 'Selecciona una opción'}</p>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {options.map((opt: string) => (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              className={`p-4 rounded-xl border-2 text-left transition-all duration-200 font-bold text-sm ${current.includes(opt)
                ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-secondary)]'
                : 'border-gray-50 bg-gray-50 text-gray-500 hover:border-gray-200'
                }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </StepLayout>
  );
}

function ContrastScreen({ triageData, onComplete, onBack }: {
  triageData: TriageAnswers;
  onComplete: (answers: Partial<TriageAnswers>) => void;
  onBack: () => void;
}) {
  const [desc, setDesc] = useState('');
  return (
    <StepLayout footer={<StepNav onBack={onBack} onNext={() => onComplete({ situacion_ideal: desc })} />}>
      <div className="flex-1 flex flex-col justify-center space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-[var(--color-secondary)] leading-tight">Tu situación ideal</h2>
          <p className="text-xs font-bold text-[var(--color-text-muted)]">Describe cómo sería tu vida sin este problema.</p>
        </div>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Escribe aquí..."
          className="w-full h-40 p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[var(--color-primary)] focus:bg-white transition-all outline-none text-sm font-medium resize-none shadow-inner"
        />
      </div>
    </StepLayout>
  );
}

function ContactForm({ contactData, onSubmit, onBack }: {
  contactData: { name: string; lastName: string; email: string; phone: string };
  onSubmit: (data: { name: string; lastName: string; email: string; phone: string }) => void;
  onBack: () => void;
}) {
  const [form, setForm] = useState(contactData);
  const isValid = form.name && form.lastName && form.email && form.phone;

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (isValid) onSubmit(form); }}
      className="flex-1 flex flex-col"
    >
      <div className="flex-1 flex flex-col justify-center space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <input
            placeholder="Nombre"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="p-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-[var(--color-primary)] outline-none text-sm font-bold shadow-inner"
            required
          />
          <input
            placeholder="Apellidos"
            value={form.lastName}
            onChange={e => setForm({ ...form, lastName: e.target.value })}
            className="p-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-[var(--color-primary)] outline-none text-sm font-bold shadow-inner"
            required
          />
        </div>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="w-full p-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-[var(--color-primary)] outline-none text-sm font-bold shadow-inner"
          required
        />
        <input
          type="tel"
          placeholder="Teléfono (WhatsApp)"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
          className="w-full p-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-[var(--color-primary)] outline-none text-sm font-bold shadow-inner"
          required
        />
      </div>

      <div className="step-layout__footer -mx-8">
        <div className="flex items-center justify-between gap-4 w-full">
          <button type="button" onClick={onBack} className="btn-back">Atrás</button>
          <button type="submit" disabled={!isValid} className="btn-primary flex-1">CONFIRMAR DATOS</button>
        </div>
      </div>
    </form>
  );
}
