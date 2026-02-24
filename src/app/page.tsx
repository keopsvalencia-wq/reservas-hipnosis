'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingWizard } from '@/components/BookingWizard';
import { TriageForm } from '@/components/TriageForm';
import { GATE_INTRO_TEXT, GATE_BLOCKED_VALUE, GATE_BLOCKED_NOTE } from '@/data/triage-questions';
import { TriageAnswers } from '@/lib/types';

// ──────────────────────────────────────────────────
// EMBUDO 10 PANTALLAS — Re-ingeniería v4
// P1: Bienvenida        P2: Regalos         P3: Perfil
// P4: Motivo (cards)    P5: Impacto (cards) P6: Contraste
// P7: Compromiso        P8: Inversión (gate)
// P9: Datos contacto    P10: Booking
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
  const [contactData, setContactData] = useState({ name: '', email: '', phone: '' });
  const [isBlocked, setIsBlocked] = useState(false);

  const TOTAL = 10;
  const progress = ((screen + 1) / TOTAL) * 100;

  const next = () => setScreen(s => s + 1);
  const back = () => setScreen(s => Math.max(0, s - 1));

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

  // Choice card handler (single or multi)
  const handleChoice = (key: string, value: string | string[]) => {
    setTriageData(prev => ({ ...prev, [key]: value }));
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
          <button onClick={() => { setIsBlocked(false); setScreen(7); }} className="text-sm text-[var(--color-primary)] underline">
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
          <div className="text-center space-y-10 py-10 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[var(--color-secondary)] leading-[1.1] tracking-tight">
              Solicita tu Evaluación Diagnóstica.
            </h1>
            <p className="text-lg md:text-xl text-[var(--color-text-muted)] font-medium leading-relaxed max-w-2xl mx-auto">
              Solo de 3 a 5 plazas disponibles cada mes para garantizar la máxima atención.
            </p>
            <p className="text-base md:text-lg text-[var(--color-secondary)] leading-relaxed max-w-2xl mx-auto">
              Reserva tu plaza para una sesión estratégica de 45 minutos. Analizaremos la raíz de tu problema y trazaremos el plan exacto para arrancarlo de forma definitiva.
            </p>
            <p className="text-sm md:text-base text-[var(--color-text-muted)] font-semibold">
              🛡️ Garantía: Si veo que no puedo garantizarte resultados, el coste de la sesión será 0€.
            </p>
            <div className="space-y-3 pt-2">
              <motion.button onClick={next} className="btn-primary text-lg py-5 px-12 mx-auto uppercase tracking-wider font-black" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                Reservar mi plaza ahora
              </motion.button>
              <p className="text-xs text-gray-400">Pulsa para ver disponibilidad y responder al formulario de compromiso.</p>
            </div>
          </div>
        );

      // ─── P2: REGALOS ─────────────────────────
      case 1:
        return (
          <div className="space-y-10 py-10 max-w-3xl mx-auto">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[var(--color-secondary)] leading-[1.1] tracking-tight">
                Tus 3 Regalos de Claridad.
              </h2>
              <p className="text-lg md:text-xl text-[var(--color-text-muted)] font-medium leading-relaxed max-w-2xl mx-auto">
                Solo por asistir a tu evaluación, te llevarás 3 revelaciones que liberarán la presión de tu cabeza:
              </p>
            </div>
            <div className="space-y-8 max-w-2xl mx-auto">
              <div className="flex gap-5 items-start">
                <span className="text-3xl font-black text-[var(--color-primary)] leading-none shrink-0">01</span>
                <p className="text-base md:text-lg text-[var(--color-secondary)] leading-relaxed">
                  Verás tu problema desde una perspectiva que <strong>NADIE te había contado jamás</strong>. <span className="text-[var(--color-text-muted)]">(Mis pacientes dicen que esto les da más paz en 45 min que años de terapias convencionales).</span>
                </p>
              </div>
              <div className="flex gap-5 items-start">
                <span className="text-3xl font-black text-[var(--color-primary)] leading-none shrink-0">02</span>
                <p className="text-base md:text-lg text-[var(--color-secondary)] leading-relaxed">
                  Entenderás exactamente por qué <strong>NADA de lo que has intentado</strong> hasta hoy ha funcionado.
                </p>
              </div>
              <div className="flex gap-5 items-start">
                <span className="text-3xl font-black text-[var(--color-primary)] leading-none shrink-0">03</span>
                <p className="text-base md:text-lg text-[var(--color-secondary)] leading-relaxed">
                  Descubrirás la <strong>ÚNICA y verdadera solución definitiva</strong> a tu situación.
                </p>
              </div>
            </div>
            <div className="text-center space-y-3 pt-2">
              <div className="flex items-center justify-center gap-4">
                <button onClick={back} className="text-[var(--color-text-muted)] font-bold flex items-center gap-2 hover:text-[var(--color-secondary)]">
                  <span className="material-icons-outlined">arrow_back</span> Atrás
                </button>
                <motion.button onClick={next} className="btn-primary text-lg py-5 px-12 uppercase tracking-wider font-black" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  Siguiente paso
                </motion.button>
              </div>
              <p className="text-xs text-gray-400">Pulsa para completar tu perfil de compromiso.</p>
            </div>
          </div>
        );

      // ─── P3: MOTIVO DE CONSULTA (choice cards, multi) ──
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

      // ─── P4: PERFIL (dedicación, ciudad, edad) ────
      case 3:
        return (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="text-center space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">Paso 2 de 7</p>
              <h2 className="text-2xl md:text-3xl font-black text-[var(--color-secondary)]">Tu perfil</h2>
            </div>
            <TriageForm subset={['dedicacion', 'ciudad', 'edad']} onComplete={handleTriageStep} onBack={back} buttonLabel="SIGUIENTE PASO" />
          </div>
        );

      // ─── P5: IMPACTO EMOCIONAL (choice cards) ──
      case 4:
        return (
          <ChoiceCardScreen
            step="Paso 3 de 7"
            title="¿Qué es lo que más miedo te da que pase si no solucionas esto ahora?"
            options={IMPACTO_OPTIONS}
            selected={triageData.impacto_emocional as string | string[]}
            onSelect={(val) => handleChoice('impacto_emocional', val)}
            onBack={back}
            columns={1}
            multi
            otherLabel="Otro miedo diferente"
            otherText={(triageData.impacto_otro as string) || ''}
            onOtherTextChange={(txt) => setTriageData(prev => ({ ...prev, impacto_otro: txt }))}
          />
        );

      // ─── P6: CONTRASTE (Híbrido: tags + texto) ──
      case 5:
        return (
          <ContrastScreen
            triageData={triageData}
            onComplete={(answers) => { setTriageData(prev => ({ ...prev, ...answers })); next(); }}
            onBack={back}
          />
        );

      // ─── P7: COMPROMISO (Triple Inversión) ────
      case 6:
        return (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="text-center space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">Paso 5 de 7</p>
              <h2 className="text-2xl md:text-3xl font-black text-[var(--color-secondary)]">Tu nivel de compromiso</h2>
            </div>
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 max-w-xl mx-auto">
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed text-center">
                Para que el tratamiento funcione, necesitas invertir en <strong className="text-[var(--color-secondary)]">3 áreas</strong>: tu <strong className="text-[var(--color-secondary)]">Compromiso</strong> personal, tu <strong className="text-[var(--color-secondary)]">Tiempo</strong> diario y tu <strong className="text-[var(--color-secondary)]">Dinero</strong>.
              </p>
            </div>
            <TriageForm subset={['compromiso_escala', 'disponibilidad_tiempo']} onComplete={handleTriageStep} onBack={back} buttonLabel="SIGUIENTE PASO" />
          </div>
        );

      // ─── P8: INVERSIÓN (Gate) ────────────────
      case 7:
        return (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="text-center space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">Paso 6 de 7</p>
              <h2 className="text-2xl md:text-3xl font-black text-[var(--color-secondary)]">La inversión</h2>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 max-w-xl mx-auto space-y-3">
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">{GATE_INTRO_TEXT}</p>
            </div>
            <TriageForm subset={['inversion']} onComplete={handleTriageStep} onBack={back} buttonLabel="Confirmar mi compromiso y ver agenda" />
          </div>
        );

      // ─── P9: DATOS DE CONTACTO ────────────────
      case 8:
        return (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="text-center space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">Paso 7 de 7</p>
              <h2 className="text-2xl md:text-3xl font-black text-[var(--color-secondary)]">Tus datos de contacto</h2>
              <p className="text-base text-[var(--color-text-muted)]">Para confirmar tu plaza y enviarte los detalles de la cita.</p>
            </div>
            <ContactForm
              contactData={contactData}
              onSubmit={(data) => { setContactData(data); next(); }}
              onBack={back}
            />
          </div>
        );

      // ─── P10: BOOKING ──────────────────────────
      case 9:
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
    <Shell progress={progress} showProgress={screen > 0 && screen < 9}>
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
// CONTRAST SCREEN: Quick tags + dual textareas
// ──────────────────────────────────────────────────
const QUICK_TAGS = [
  'No duermo bien',
  'Ansiedad constante',
  'Me siento paralizado/a',
  'Problemas de pareja/familia',
  'Falta de confianza',
];

function ContrastScreen({
  triageData,
  onComplete,
  onBack,
}: {
  triageData: Record<string, unknown>;
  onComplete: (answers: Record<string, string | string[]>) => void;
  onBack: () => void;
}) {
  const [tags, setTags] = useState<string[]>(
    Array.isArray(triageData.situacion_tags) ? (triageData.situacion_tags as string[]) : []
  );
  const [actualText, setActualText] = useState((triageData.situacion_actual as string) || '');
  const [deseadaText, setDeseadaText] = useState((triageData.situacion_deseada as string) || '');

  const toggleTag = (tag: string) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const isValid = deseadaText.trim().length > 0 && (tags.length > 0 || actualText.trim().length > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onComplete({
      situacion_tags: tags,
      situacion_actual: actualText,
      situacion_deseada: deseadaText,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">Paso 4 de 7</p>
        <h2 className="text-2xl md:text-3xl font-black text-[var(--color-secondary)] leading-tight">¿Dónde estás y a dónde quieres llegar?</h2>
      </div>

      {/* ── SITUACIÓN ACTUAL ── */}
      <div className="space-y-5">
        <h3 className="text-lg md:text-xl font-bold text-[var(--color-secondary)]">
          Describe brevemente cómo estás en este momento y qué te impide hacer tu problema.
        </h3>

        {/* Quick Tags */}
        <div className="flex flex-wrap gap-3">
          {QUICK_TAGS.map(tag => {
            const active = tags.includes(tag);
            return (
              <motion.button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={`px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${active
                  ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)] text-white shadow-sm'
                  : 'border-[var(--color-border)] bg-white text-[var(--color-text-muted)] hover:border-gray-400'
                  }`}
              >
                {active && <span className="mr-1.5">✓</span>}
                {tag}
              </motion.button>
            );
          })}
        </div>

        {/* Detail Text */}
        <textarea
          className="w-full p-4 rounded-xl border border-[var(--color-border)] bg-gray-50 focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all h-28 resize-none text-base"
          placeholder="¿Quieres añadir algún detalle más sobre tu malestar actual?"
          value={actualText}
          onChange={(e) => setActualText(e.target.value)}
        />
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* ── SITUACIÓN DESEADA ── */}
      <div className="space-y-5">
        <h3 className="text-lg md:text-xl font-bold text-[var(--color-secondary)]">
          ¿Cómo te gustaría estar y sentirte dentro de exactamente un mes <span className="text-[var(--color-primary)]">cuando solucionemos</span> tu problema?
        </h3>

        <textarea
          className="w-full p-4 rounded-xl border border-[var(--color-border)] bg-gray-50 focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all h-32 resize-none text-base"
          placeholder="Ej: Quiero levantarme con energía, sin ese nudo en el estómago y sintiendo que vuelvo a tener el control..."
          value={deseadaText}
          onChange={(e) => setDeseadaText(e.target.value)}
          required
        />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button type="button" onClick={onBack} className="text-[var(--color-text-muted)] font-bold flex items-center gap-2 hover:text-[var(--color-secondary)]">
          <span className="material-icons-outlined">arrow_back</span> Atrás
        </button>
        <motion.button
          type="submit"
          disabled={!isValid}
          className="btn-primary py-4 px-10 text-base uppercase tracking-wider font-black disabled:opacity-40 disabled:cursor-not-allowed"
          whileHover={isValid ? { scale: 1.03 } : {}}
          whileTap={isValid ? { scale: 0.97 } : {}}
        >
          SIGUIENTE PASO
        </motion.button>
      </div>
    </form>
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
// CHOICE CARD SCREEN: Large tactile cards grid
// Supports single/multi select + dynamic "Otros" textarea
// ──────────────────────────────────────────────────
function ChoiceCardScreen({
  step,
  title,
  options,
  selected,
  onSelect,
  onBack,
  columns = 2,
  multi = false,
  otherLabel,
  otherText = '',
  onOtherTextChange,
}: {
  step: string;
  title: string;
  options: string[];
  selected?: string | string[];
  onSelect: (value: string | string[]) => void;
  onBack: () => void;
  columns?: 1 | 2;
  multi?: boolean;
  otherLabel?: string;
  otherText?: string;
  onOtherTextChange?: (text: string) => void;
}) {
  const [choices, setChoices] = useState<string[]>(
    multi
      ? (Array.isArray(selected) ? selected : selected ? [selected] : [])
      : (selected && !Array.isArray(selected) ? [selected] : [])
  );

  const toggle = (opt: string) => {
    if (multi) {
      setChoices(prev => prev.includes(opt) ? prev.filter(v => v !== opt) : [...prev, opt]);
    } else {
      setChoices([opt]);
    }
  };

  const otherIsSelected = otherLabel ? choices.includes(otherLabel) : false;
  const isValid = choices.length > 0 && (!otherIsSelected || (otherText?.trim().length ?? 0) > 0);

  const handleNext = () => {
    if (!isValid) return;
    onSelect(multi ? choices : choices[0]);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">{step}</p>
        <h2 className="text-2xl md:text-3xl font-black text-[var(--color-secondary)] leading-tight">{title}</h2>
        {multi && <p className="text-sm text-[var(--color-text-muted)]">Puedes seleccionar varias opciones</p>}
      </div>

      {/* Cards Grid */}
      <div className={`grid gap-4 ${columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-xl mx-auto'}`}>
        {options.map((opt) => {
          const isSelected = choices.includes(opt);
          const isOther = otherLabel && opt === otherLabel;
          return (
            <div key={opt} className={isOther && columns === 2 ? 'md:col-span-2' : ''}>
              <motion.button
                type="button"
                onClick={() => toggle(opt)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  w-full p-5 md:p-6 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer
                  ${isSelected
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] shadow-md'
                    : 'border-[var(--color-border)] bg-white hover:border-gray-300 hover:shadow-sm'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  {multi && (
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'border-[var(--color-primary)] bg-[var(--color-primary)]' : 'border-gray-300'}`}>
                      {isSelected && <span className="text-white text-xs font-bold">✓</span>}
                    </div>
                  )}
                  <span className={`text-base md:text-lg font-semibold leading-snug ${isSelected ? 'text-[var(--color-secondary)]' : 'text-[var(--color-text-muted)]'}`}>
                    {opt}
                  </span>
                </div>
              </motion.button>
              {/* Dynamic textarea for "Otros" */}
              {isOther && isSelected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-3"
                >
                  <textarea
                    className="w-full p-4 rounded-xl border border-[var(--color-border)] bg-gray-50 focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all h-24 resize-none text-base"
                    placeholder="Describe brevemente tu situación..."
                    value={otherText}
                    onChange={(e) => onOtherTextChange?.(e.target.value)}
                    autoFocus
                  />
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button onClick={onBack} className="text-[var(--color-text-muted)] font-bold flex items-center gap-2 hover:text-[var(--color-secondary)]">
          <span className="material-icons-outlined">arrow_back</span> Atrás
        </button>
        <motion.button
          onClick={handleNext}
          disabled={!isValid}
          className="btn-primary py-4 px-10 text-base uppercase tracking-wider font-black disabled:opacity-40 disabled:cursor-not-allowed"
          whileHover={isValid ? { scale: 1.03 } : {}}
          whileTap={isValid ? { scale: 0.97 } : {}}
        >
          SIGUIENTE PASO
        </motion.button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────
// CONTACT FORM (Nombre, Email, WhatsApp)
// ──────────────────────────────────────────────────
function ContactForm({
  contactData,
  onSubmit,
  onBack,
}: {
  contactData: { name: string; email: string; phone: string };
  onSubmit: (data: { name: string; email: string; phone: string }) => void;
  onBack: () => void;
}) {
  const [name, setName] = useState(contactData.name);
  const [email, setEmail] = useState(contactData.email);
  const [phone, setPhone] = useState(contactData.phone);

  const isValid = name.trim() && email.trim() && phone.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) onSubmit({ name, email, phone });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[var(--color-secondary)]">Nombre completo *</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons-outlined text-gray-400 text-lg">person</span>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre completo" required
            className="w-full pl-10 pr-4 py-4 text-base border-2 border-[var(--color-border)] rounded-xl bg-gray-50 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-colors" />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[var(--color-secondary)]">Email *</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons-outlined text-gray-400 text-lg">email</span>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required
            className="w-full pl-10 pr-4 py-4 text-base border-2 border-[var(--color-border)] rounded-xl bg-gray-50 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-colors" />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[var(--color-secondary)]">WhatsApp *</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons-outlined text-gray-400 text-lg">phone</span>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+34 600 000 000" required
            className="w-full pl-10 pr-4 py-4 text-base border-2 border-[var(--color-border)] rounded-xl bg-gray-50 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-colors" />
        </div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <button type="button" onClick={onBack} className="text-[var(--color-text-muted)] font-bold flex items-center gap-2 hover:text-[var(--color-secondary)]">
          <span className="material-icons-outlined">arrow_back</span> Atrás
        </button>
        <button type="submit" disabled={!isValid} className="btn-primary py-4 px-10 text-base uppercase tracking-wider font-black">
          SIGUIENTE PASO
        </button>
      </div>
    </form>
  );
}
