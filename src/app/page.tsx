'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TriageAnswers, BookingData } from '@/lib/types';
import { TriageForm } from '@/components/TriageForm';
import { BookingWizard } from '@/components/BookingWizard';
import { GATE_BLOCKED_NOTE } from '@/lib/booking-rules';

// ──────────────────────────────────────────────────
// OPTIONS FOR CHOICE CARDS
// ──────────────────────────────────────────────────
const MOTIVO_OPTIONS = [
  { id: 'ansiedad_estres', label: 'Ansiedad y Estrés', icon: 'psychology' },
  { id: 'fobias_miedos', label: 'Fobias y Miedos', icon: 'warning' },
  { id: 'autoestima_seguridad', label: 'Autoestima y Seguridad', icon: 'verified' },
  { id: 'habitos_adicciones', label: 'Hábitos y Adicciones', icon: 'smoke_free' },
  { id: 'dolor_psicosomatico', label: 'Dolor Psicosomático', icon: 'medical_services' },
  { id: 'insomnio_descanso', label: 'Insomnio y Descanso', icon: 'bedtime' },
];

const IMPACTO_OPTIONS = [
  { id: 'bajo', label: 'Bajo — Me molesta a veces', icon: 'sentiment_neutral' },
  { id: 'medio', label: 'Medio — Me limita en mi día a día', icon: 'sentiment_dissatisfied' },
  { id: 'alto', label: 'Alto — Es una prioridad resolverlo ya', icon: 'priority_high' },
];

const COMPROMISO_OPTIONS = [
  { id: 'curioso', label: 'Solo curiosidad', icon: 'search' },
  { id: 'decidido', label: 'Decidido a cambiar', icon: 'rocket_launch' },
  { id: 'total', label: 'Compromiso Total 100%', icon: 'bolt' },
];

// ──────────────────────────────────────────────────
// HOME COMPONENT
// ──────────────────────────────────────────────────
export default function Home() {
  const [screen, setScreen] = useState(0);
  const [triageData, setTriageData] = useState<TriageAnswers>({});
  const [contactData, setContactData] = useState({ name: '', lastName: '', email: '', phone: '' });
  const [isBlocked, setIsBlocked] = useState(false);

  const totalScreens = 9;
  const progress = (screen / (totalScreens - 1)) * 100;

  const next = () => setScreen(s => s + 1);
  const back = () => setScreen(s => Math.max(0, s - 1));

  const handleChoice = (key: keyof TriageAnswers, value: string | string[]) => {
    setTriageData(prev => ({ ...prev, [key]: value }) as TriageAnswers);
    next();
  };

  const handleTriageStep = (data: Partial<TriageAnswers>) => {
    setTriageData(prev => ({ ...prev, ...data }) as TriageAnswers);
    next();
  };

  // ─── Blocked screen ───────────────────────────────
  if (isBlocked) {
    return (
      <MasterScreen progress={100}>
        <StepLayout>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto">
              <span className="material-icons-outlined text-amber-500 text-4xl">favorite</span>
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-secondary)]">Gracias por tu sinceridad</h2>
            <p className="text-[var(--color-text-muted)] max-w-md mx-auto leading-relaxed">{GATE_BLOCKED_NOTE}</p>
            <button onClick={() => { setIsBlocked(false); setScreen(7); }} className="text-sm text-[var(--color-primary)] underline">
              Cambiar mi respuesta
            </button>
          </motion.div>
        </StepLayout>
      </MasterScreen>
    );
  }

  const renderScreen = () => {
    switch (screen) {
      // ─── P0: INTRO ──────────────────────────────────
      case 0:
        return (
          <StepLayout
            footer={
              <button onClick={next} className="btn-primary w-full py-5 text-lg">
                COMENZAR EVALUACIÓN GRATUITA
                <span className="material-icons-outlined">arrow_forward</span>
              </button>
            }
          >
            <div className="max-w-xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary-soft)] rounded-full text-[var(--color-primary)] font-bold text-xs uppercase tracking-widest border border-[var(--color-primary)]/10">
                <span className="material-icons-outlined text-sm">auto_awesome</span>
                Hipnosis Profesional
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black text-[var(--color-secondary)] leading-tight">
                  Evaluación Diagnóstica <br />
                  <span className="text-[var(--color-primary)]">Personalizada</span>
                </h1>
                <p className="text-lg text-[var(--color-text-muted)] leading-relaxed font-medium">
                  Para poder ayudarte de forma eficaz, necesito entender qué te ocurre y cómo te afecta.
                  Responde a estas preguntas y encontraremos el mejor camino para tu cambio.
                </p>
              </div>
            </div>
          </StepLayout>
        );

      // ─── P1: EXPLICACIÓN (lo que lograremos) ─────────
      case 1:
        return (
          <StepLayout
            footer={
              <div className="step-nav-footer">
                <button onClick={back} className="btn-back">
                  <span className="material-icons-outlined">arrow_back</span>
                  Atrás
                </button>
                <button onClick={next} className="btn-primary flex-1 py-4">
                  ES JUSTO LO QUE NECESITO
                </button>
              </div>
            }
          >
            <div className="max-w-2xl mx-auto space-y-10">
              <div className="text-center space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] opacity-60 font-sans">Hipnoterapia Profesional</p>
                <h2 className="text-3xl md:text-4xl font-black text-[var(--color-secondary)]">Qué haremos en la Evaluación</h2>
              </div>
              <div className="grid gap-4">
                {/* Card 01 */}
                <motion.div
                  whileHover={{ x: 8 }}
                  className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-5 group hover:border-[var(--color-primary)] transition-all duration-300"
                >
                  <div className="text-3xl font-black text-[var(--color-primary)] opacity-20 group-hover:opacity-100 transition-opacity shrink-0">01</div>
                  <p className="text-base lg:text-lg text-[var(--color-secondary)] leading-relaxed font-bold">
                    Analizaremos la <span className="text-[var(--color-primary)]">causa raíz</span> de tu problema, no solo los síntomas.
                  </p>
                </motion.div>
                {/* Card 02 */}
                <motion.div
                  whileHover={{ x: 8 }}
                  className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-5 group hover:border-[var(--color-primary)] transition-all duration-300"
                >
                  <div className="text-3xl font-black text-[var(--color-primary)] opacity-20 group-hover:opacity-100 transition-opacity shrink-0">02</div>
                  <p className="text-base lg:text-lg text-[var(--color-secondary)] leading-relaxed font-bold">
                    Veremos cómo la hipnosis puede <span className="text-[var(--color-primary)]">reprogramar tu subconsciente</span> para el cambio.
                  </p>
                </motion.div>
                {/* Card 03 */}
                <motion.div
                  whileHover={{ x: 8 }}
                  className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-5 group hover:border-[var(--color-primary)] transition-all duration-300"
                >
                  <div className="text-3xl font-black text-[var(--color-primary)] opacity-20 group-hover:opacity-100 transition-opacity shrink-0">03</div>
                  <p className="text-base lg:text-lg text-[var(--color-secondary)] leading-relaxed font-bold">
                    Descubrirás la <span className="text-[var(--color-primary)]">ÚNICA y verdadera solución definitiva</span> a tu situación.
                  </p>
                </motion.div>
              </div>
            </div>
          </StepLayout>
        );

      // ─── P2: MOTIVO DE CONSULTA ──────────────────────
      case 2:
        return (
          <ChoiceCardScreen
            step="Paso 1 de 7"
            title="¿Cuál es tu motivo de consulta?"
            options={MOTIVO_OPTIONS}
            selected={triageData.motivo_consulta as string | string[]}
            onSelect={(val) => handleChoice('motivo_consulta', val)}
            onBack={back}
            columns={2}
            multi
            otherLabel="Otros"
            otherText={(triageData.motivo_otro as string) || ''}
            onOtherTextChange={(txt) => setTriageData(prev => ({ ...prev, motivo_otro: txt }))}
          />
        );

      // ─── P3: PERFIL ─────────────────────────────────
      case 3:
        return (
          <StepLayout fill>
            <div className="space-y-6 max-w-3xl mx-auto w-full">
              <div className="text-center space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">Paso 2 de 7</p>
                <h2 className="text-2xl md:text-3xl font-black text-[var(--color-secondary)]">Tu perfil</h2>
              </div>
              <TriageForm subset={['dedicacion', 'ciudad', 'edad']} onComplete={handleTriageStep} onBack={back} buttonLabel="SIGUIENTE PASO" />
            </div>
          </StepLayout>
        );

      // ─── P4: IMPACTO EMOCIONAL ──────────────────────
      case 4:
        return (
          <ChoiceCardScreen
            step="Paso 3 de 7"
            title="¿Cuánto impacta esto en tu vida?"
            options={IMPACTO_OPTIONS}
            selected={triageData.impacto_emocional as string}
            onSelect={(val) => handleChoice('impacto_emocional', val)}
            onBack={back}
          />
        );

      // ─── P5: ESFUERZOS PREVIOS ──────────────────────
      case 5:
        return (
          <StepLayout fill>
            <div className="space-y-6 max-w-3xl mx-auto w-full">
              <div className="text-center space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">Paso 4 de 7</p>
                <h2 className="text-2xl md:text-3xl font-black text-[var(--color-secondary)]">Experiencias previas</h2>
              </div>
              <TriageForm subset={['esfuerzos_previos']} onComplete={handleTriageStep} onBack={back} buttonLabel="SIGUIENTE PASO" />
            </div>
          </StepLayout>
        );

      // ─── P6: EXPECTATIVA ────────────────────────────
      case 6:
        return (
          <StepLayout fill>
            <div className="space-y-6 max-w-3xl mx-auto w-full">
              <div className="text-center space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">Paso 5 de 7</p>
                <h2 className="text-2xl md:text-3xl font-black text-[var(--color-secondary)]">Tu meta</h2>
              </div>
              <TriageForm subset={['expectativa']} onComplete={handleTriageStep} onBack={back} buttonLabel="SIGUIENTE PASO" />
            </div>
          </StepLayout>
        );

      // ─── P7: COMPROMISO (GATE) ──────────────────────
      case 7:
        return (
          <ChoiceCardScreen
            step="Paso 6 de 7"
            title="Nivel de compromiso con tu cambio"
            options={COMPROMISO_OPTIONS}
            selected={triageData.compromiso as string}
            onSelect={(val) => {
              if (val === 'curioso') {
                setIsBlocked(true);
              } else {
                handleChoice('compromiso', val);
              }
            }}
            onBack={back}
          />
        );

      // ─── P8: CONTACTO ───────────────────────────────
      case 8:
        return (
          <StepLayout fill>
            <div className="space-y-6 max-w-3xl mx-auto w-full">
              <div className="text-center space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">Último Paso</p>
                <h2 className="text-2xl md:text-3xl font-black text-[var(--color-secondary)]">Tus Datos</h2>
              </div>
              <ContactForm
                contactData={contactData}
                onSubmit={(data) => {
                  setContactData(data);
                  next();
                }}
                onBack={back}
              />
            </div>
          </StepLayout>
        );

      // ─── P9: BOOKING WIZARD (Wizard Steps) ───────────
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
    <MasterScreen progress={progress} showProgress={screen > 0 && screen < 9}>
      <AnimatePresence mode="wait">
        <motion.div
          key={screen + (isBlocked ? '_blocked' : '')}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="flex-1 flex flex-col min-h-0"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </MasterScreen>
  );
}

// ──────────────────────────────────────────────────
// MASTER SCREEN
// ──────────────────────────────────────────────────
function MasterScreen({
  children,
  progress,
  showProgress = true,
}: {
  children: React.ReactNode;
  progress: number;
  showProgress?: boolean;
}) {
  return (
    <div className="master-screen">
      <div className="master-screen__container">
        {showProgress && (
          <div className="flex-shrink-0 px-6 md:px-14 lg:px-20 pt-6">
            <div className="flex justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">
                Progreso
              </span>
              <span className="text-[10px] font-semibold text-gray-400">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-bar__fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}
        <div className="flex-1 flex flex-col min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────
// STEP LAYOUT
// ──────────────────────────────────────────────────
function StepLayout({
  children,
  footer,
  fill = false,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
  fill?: boolean;
}) {
  return (
    <div className="step-layout">
      <div className={`step-layout__content ${fill ? 'step-layout__content--fill' : ''}`}>
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

// ──────────────────────────────────────────────────
// HELPER COMPONENTS
// ──────────────────────────────────────────────────

function ChoiceCardScreen({
  step,
  title,
  options,
  selected,
  onSelect,
  onBack,
  columns = 3,
  multi = false,
  otherLabel,
  otherText = '',
  onOtherTextChange
}: {
  step: string;
  title: string;
  options: { id: string; label: string; icon: string }[];
  selected: string | string[];
  onSelect: (val: string | string[]) => void;
  onBack: () => void;
  columns?: number;
  multi?: boolean;
  otherLabel?: string;
  otherText?: string;
  onOtherTextChange?: (txt: string) => void;
}) {
  const [internalSelected, setInternalSelected] = useState<string[]>(
    Array.isArray(selected) ? selected : selected ? [selected] : []
  );

  const toggle = (id: string) => {
    if (multi) {
      const next = internalSelected.includes(id)
        ? internalSelected.filter(i => i !== id)
        : [...internalSelected, id];
      setInternalSelected(next);
    } else {
      onSelect(id);
    }
  };

  return (
    <StepLayout
      footer={
        <div className="step-nav-footer">
          <button onClick={onBack} className="btn-back">
            <span className="material-icons-outlined">arrow_back</span>
            Atrás
          </button>
          {multi && (
            <button
              onClick={() => onSelect(internalSelected)}
              disabled={internalSelected.length === 0}
              className="btn-primary px-8 py-3 disabled:opacity-50"
            >
              SIGUIENTE PASO
            </button>
          )}
        </div>
      }
    >
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">{step}</p>
          <h2 className="text-2xl md:text-3xl font-black text-[var(--color-secondary)]">{title}</h2>
        </div>

        <div className={`grid gap-4 ${columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'}`}>
          {options.map((opt) => {
            const isSel = internalSelected.includes(opt.id);
            return (
              <button
                key={opt.id}
                onClick={() => toggle(opt.id)}
                className={`flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all duration-300 text-center group ${isSel
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)]'
                  : 'border-gray-100 bg-white hover:border-[var(--color-primary)] hover:shadow-lg'
                  }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isSel ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-[var(--color-primary-soft)] group-hover:text-[var(--color-primary)]'
                  }`}>
                  <span className="material-icons-outlined">{opt.icon}</span>
                </div>
                <span className={`font-bold ${isSel ? 'text-[var(--color-secondary)]' : 'text-gray-600'}`}>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>

        {otherLabel && (
          <div className="max-w-md mx-auto space-y-3 pt-4">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest text-center">{otherLabel}</p>
            <textarea
              value={otherText}
              onChange={(e) => onOtherTextChange?.(e.target.value)}
              placeholder="Cuéntame un poco más si quieres..."
              className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-[var(--color-primary)] outline-none min-h-[100px] text-sm resize-none"
            />
          </div>
        )}
      </div>
    </StepLayout>
  );
}

function ContactForm({
  contactData,
  onSubmit,
  onBack,
}: {
  contactData: { name: string; lastName: string; email: string; phone: string };
  onSubmit: (data: { name: string; lastName: string; email: string; phone: string }) => void;
  onBack: () => void;
}) {
  const [name, setName] = useState(contactData.name);
  const [lastName, setLastName] = useState(contactData.lastName);
  const [email, setEmail] = useState(contactData.email);
  const [phone, setPhone] = useState(contactData.phone);

  const isValid = name.trim() && lastName.trim() && email.trim() && phone.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) onSubmit({ name, lastName, email, phone });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto px-1 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nombre</label>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)} required
              placeholder="Tu nombre"
              className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-[var(--color-primary)] outline-none text-sm font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Apellidos</label>
            <input
              type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required
              placeholder="Tus apellidos"
              className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-[var(--color-primary)] outline-none text-sm font-bold"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email</label>
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            placeholder="ejemplo@email.com"
            className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-[var(--color-primary)] outline-none text-sm font-bold"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Teléfono</label>
          <input
            type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required
            placeholder="600 000 000"
            className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-[var(--color-primary)] outline-none text-sm font-bold"
          />
        </div>
      </div>

      <div className="flex-shrink-0 pt-8 flex items-center justify-between gap-4">
        <button type="button" onClick={onBack} className="btn-back">
          <span className="material-icons-outlined">arrow_back</span>
          Atrás
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className="btn-primary px-10 py-4 disabled:opacity-50"
        >
          SIGUIENTE PASO
        </button>
      </div>
    </form>
  );
}
