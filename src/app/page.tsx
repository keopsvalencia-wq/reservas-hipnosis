'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingWizard } from '@/components/BookingWizard';
import { TriageForm } from '@/components/TriageForm';
import { GATE_BLOCKED_VALUE, GATE_BLOCKED_NOTE } from '@/data/triage-questions';
import { TriageAnswers } from '@/lib/types';

// ──────────────────────────────────────────────────
// EMBUDO 10 PANTALLAS — Re-ingeniería v5 (MasterScreen)
// P0: Bienvenida        P1: Regalos         P2: Motivo (cards)
// P3: Perfil            P4: Impacto (cards) P5: Contraste
// P6: Compromiso        P7: Inversión (gate)
// P8: Datos contacto    P9: Booking
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

  // ─── Screen renderer ──────────────────────────────
  const renderScreen = () => {
    switch (screen) {
      // ─── P0: BIENVENIDA ──────────────────────
      case 0:
        return (
          <StepLayout
            footer={
              <div className="space-y-3">
                <motion.button
                  onClick={next}
                  className="btn-primary w-full text-lg py-5 uppercase tracking-wider font-black"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  RESERVAR MI PLAZA AHORA
                </motion.button>
                <p className="text-xs text-gray-400 text-center">Pulsa para ver disponibilidad y responder al formulario de compromiso.</p>
              </div>
            }
          >
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 max-w-6xl mx-auto">
              {/* Left: Content */}
              <div className="flex-1 text-center lg:text-left space-y-6 order-2 lg:order-1 max-w-2xl">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[var(--color-secondary)] leading-[1.1] tracking-tight">
                  Solicita tu Evaluación Diagnóstica.
                </h1>

                <div className="space-y-4">
                  <p className="text-lg md:text-xl text-[var(--color-primary)] font-bold tracking-tight">
                    Solo de 3 a 5 plazas disponibles cada mes.
                  </p>
                  <p className="text-base text-[var(--color-text-muted)] leading-relaxed font-medium lg:text-justify">
                    Reserva tu plaza para una sesión estratégica de 45 minutos. Analizaremos la raíz de tu problema y trazaremos el plan exacto para arrancarlo de forma definitiva.
                  </p>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-5 w-full">
                  <p className="text-base text-[var(--color-secondary)] font-bold leading-relaxed lg:text-justify">
                    🛡️ Garantía: Si veo que no puedo garantizarte resultados, el coste de la sesión será 0€.
                  </p>
                </div>
              </div>

              {/* Right: Authority Image */}
              <div className="flex-1 relative order-1 lg:order-2 w-full max-w-md mx-auto lg:mx-0">
                <div className="relative rounded-3xl overflow-hidden bg-white">
                  <img
                    src="/images/salva-autoridad.png"
                    alt="Salva Vera"
                    className="w-full h-auto block rounded-3xl"
                    style={{ display: 'block', maxHeight: '400px', objectFit: 'cover', objectPosition: 'top' }}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" />
                </div>

                {/* Authority Badge */}
                <div className="absolute -top-3 -right-3 bg-white border border-gray-100 px-5 py-2.5 rounded-2xl hidden lg:block z-10">
                  <p className="text-xs font-black uppercase tracking-widest text-[var(--color-secondary)]">Salva Vera</p>
                  <p className="text-[10px] font-bold text-[var(--color-primary)]">Hipnoterapeuta Profesional</p>
                </div>
              </div>
            </div>
          </StepLayout>
        );

      // ─── P1: REGALOS ─────────────────────────
      case 1:
        return (
          <StepLayout
            footer={
              <StepNav onBack={back} onNext={next} nextLabel="Siguiente paso" />
            }
          >
            <div className="space-y-8 max-w-5xl mx-auto">
              <div className="text-center space-y-3">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[var(--color-secondary)] leading-[1.1] tracking-tight">
                  Tus 3 Regalos de Claridad.
                </h2>
                <p className="text-base md:text-lg text-[var(--color-text-muted)] font-medium leading-relaxed max-w-2xl mx-auto">
                  Solo por asistir a tu evaluación, te llevarás 3 revelaciones que liberarán la presión de tu cabeza:
                </p>
              </div>

              <div className="space-y-4 max-w-4xl mx-auto">
                {/* Card 01 */}
                <motion.div
                  whileHover={{ x: 8 }}
                  className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-5 group hover:border-[var(--color-primary)] transition-all duration-300"
                >
                  <div className="text-3xl font-black text-[var(--color-primary)] opacity-20 group-hover:opacity-100 transition-opacity shrink-0">01</div>
                  <div className="space-y-3">
                    <p className="text-base lg:text-lg text-[var(--color-secondary)] leading-relaxed font-bold">
                      Verás tu problema desde una perspectiva que <span className="text-[var(--color-primary)]">NADIE te había contado jamás</span>.
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed italic border-l-4 border-emerald-50 pl-3">
                      &quot;Mis pacientes dicen que esto les da más paz en 45 min que años de terapias convencionales.&quot;
                    </p>
                  </div>
                </motion.div>

                {/* Card 02 */}
                <motion.div
                  whileHover={{ x: 8 }}
                  className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-5 group hover:border-[var(--color-primary)] transition-all duration-300"
                >
                  <div className="text-3xl font-black text-[var(--color-primary)] opacity-20 group-hover:opacity-100 transition-opacity shrink-0">02</div>
                  <p className="text-base lg:text-lg text-[var(--color-secondary)] leading-relaxed font-bold">
                    Entenderás exactamente por qué <span className="text-[var(--color-primary)]">NADA de lo que has intentado</span> hasta hoy ha funcionado.
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

      // ─── P2: MOTIVO DE CONSULTA (choice cards, multi) ──
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

      // ─── P3: PERFIL (dedicación, ciudad, edad) ────
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

      // ─── P4: IMPACTO EMOCIONAL (choice cards) ──
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

      // ─── P5: CONTRASTE (Híbrido: tags + texto) ──
      case 5:
        return (
          <ContrastScreen
            triageData={triageData}
            onComplete={(answers) => { setTriageData(prev => ({ ...prev, ...answers })); next(); }}
            onBack={back}
          />
        );

      // ─── P6: COMPROMISO (Triple Inversión) ────
      case 6:
        return (
          <StepLayout fill>
            <div className="space-y-6 max-w-3xl mx-auto w-full">
              <div className="text-center space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">Paso 5 de 7</p>
                <h2 className="text-2xl md:text-3xl font-black text-[var(--color-secondary)]">Tu nivel de compromiso</h2>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-100 max-w-xl mx-auto">
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed text-center">
                  Para que el tratamiento funcione, necesitas invertir en <strong className="text-[var(--color-secondary)]">3 áreas</strong>: tu <strong className="text-[var(--color-secondary)]">Compromiso</strong> personal, tu <strong className="text-[var(--color-secondary)]">Tiempo</strong> diario y tu <strong className="text-[var(--color-secondary)]">Dinero</strong>.
                </p>
              </div>
              <TriageForm subset={['compromiso_escala', 'disponibilidad_tiempo']} onComplete={handleTriageStep} onBack={back} buttonLabel="SIGUIENTE PASO" />
            </div>
          </StepLayout>
        );

      // ─── P7: INVERSIÓN (Gate) ────────────────
      case 7:
        return (
          <StepLayout fill>
            <div className="space-y-6 max-w-3xl mx-auto w-full">
              <div className="text-center space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">Paso 6 de 7</p>
                <h2 className="text-2xl md:text-3xl font-black text-[var(--color-secondary)]">La inversión</h2>
              </div>
              <TriageForm subset={['inversion']} onComplete={handleTriageStep} onBack={back} buttonLabel="Confirmar mi compromiso y ver agenda" />
            </div>
          </StepLayout>
        );

      // ─── P8: DATOS DE CONTACTO ────────────────
      case 8:
        return (
          <StepLayout fill>
            <div className="space-y-6 max-w-3xl mx-auto w-full">
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
          </StepLayout>
        );

      // ─── P9: BOOKING ──────────────────────────
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
// MASTER SCREEN: 100% viewport height container
// Buttons anchored at bottom via StepLayout
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
        {/* Progress bar — thin, seamless */}
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

        {/* Content area — flex column, fills remaining space */}
        <div className="flex-1 flex flex-col min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────
// STEP LAYOUT: Content + anchored footer
// fill = true → for forms that manage their own buttons
// fill = false (default) → content is vertically centered
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
      {/* Content area */}
      <div className={`step-layout__content ${fill ? 'step-layout__content--fill' : ''}`}>
        {children}
      </div>

      {/* Anchored footer — always at same Y coordinate */}
      {footer && (
        <div className="step-layout__footer">
          {footer}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────
// STEP NAV: Standardized back/next navigation
// ──────────────────────────────────────────────────
function StepNav({
  onBack,
  onNext,
  nextLabel = 'SIGUIENTE PASO',
  nextDisabled = false,
  nextLoading = false,
  subtitle,
}: {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  nextLoading?: boolean;
  subtitle?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="step-layout__nav">
        {onBack ? (
          <button type="button" onClick={onBack} className="btn-back">
            <span className="material-icons-outlined">arrow_back</span>
            Atrás
          </button>
        ) : <div />}

        {onNext && (
          <motion.button
            type="button"
            onClick={onNext}
            disabled={nextDisabled || nextLoading}
            className="btn-primary py-4 px-10 text-base uppercase tracking-wider font-black"
            whileHover={!nextDisabled ? { scale: 1.03 } : {}}
            whileTap={!nextDisabled ? { scale: 0.97 } : {}}
          >
            {nextLoading ? (
              <>
                <span className="material-icons-outlined animate-spin text-lg">hourglass_empty</span>
                Procesando...
              </>
            ) : (
              nextLabel
            )}
          </motion.button>
        )}
      </div>
      {subtitle && <p className="text-xs text-gray-400 text-center">{subtitle}</p>}
    </div>
  );
}

// ──────────────────────────────────────────────────
// CONTRAST SCREEN: Quick tags + dual textareas
// Uses StepLayout for anchored buttons
// ──────────────────────────────────────────────────
const QUICK_TAGS_ACTUAL = [
  'No duermo bien',
  'Ansiedad constante',
  'Me siento paralizado/a',
  'Problemas de pareja/familia',
  'Falta de confianza',
];

const QUICK_TAGS_DESEADA = [
  'Dormir profundamente',
  'Sentirme en calma',
  'Recuperar mi energía',
  'Mejorar mis relaciones',
  'Confiar en mí mismo/a',
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
  const [tagsActual, setTagsActual] = useState<string[]>(
    Array.isArray(triageData.situacion_tags) ? (triageData.situacion_tags as string[]) : []
  );
  const [actualText, setActualText] = useState((triageData.situacion_actual as string) || '');
  const [tagsDeseada, setTagsDeseada] = useState<string[]>(
    Array.isArray(triageData.situacion_deseada_tags) ? (triageData.situacion_deseada_tags as string[]) : []
  );
  const [deseadaText, setDeseadaText] = useState((triageData.situacion_deseada as string) || '');

  const toggleActual = (tag: string) => {
    setTagsActual(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };
  const toggleDeseada = (tag: string) => {
    setTagsDeseada(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const isValid =
    (tagsActual.length > 0 || actualText.trim().length > 0) &&
    (tagsDeseada.length > 0 || deseadaText.trim().length > 0);

  const handleSubmit = () => {
    if (!isValid) return;
    onComplete({
      situacion_tags: tagsActual,
      situacion_actual: actualText,
      situacion_deseada_tags: tagsDeseada,
      situacion_deseada: deseadaText,
    });
  };

  /* Shared tag renderer */
  const renderTags = (
    list: string[],
    active: string[],
    toggle: (t: string) => void,
  ) => (
    <div className="flex flex-wrap gap-2">
      {list.map(tag => {
        const on = active.includes(tag);
        return (
          <motion.button
            key={tag}
            type="button"
            onClick={() => toggle(tag)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className={`px-3.5 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${on
              ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
              : 'border-[var(--color-border)] bg-white text-[var(--color-text-muted)] hover:border-gray-400'
              }`}
          >
            {on && <span className="mr-1.5">✓</span>}
            {tag}
          </motion.button>
        );
      })}
    </div>
  );

  return (
    <StepLayout
      footer={
        <StepNav onBack={onBack} onNext={handleSubmit} nextDisabled={!isValid} />
      }
    >
      <div className="space-y-5 max-w-3xl mx-auto w-full">
        {/* Header */}
        <div className="text-center space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">Paso 4 de 7</p>
          <h2 className="text-xl md:text-2xl font-black text-[var(--color-secondary)] leading-tight">¿Dónde estás y a dónde quieres llegar?</h2>
        </div>

        {/* ── SITUACIÓN ACTUAL ── */}
        <div className="space-y-2">
          <h3 className="text-base font-bold text-[var(--color-secondary)]">
            Describe brevemente cómo estás ahora.
          </h3>
          {renderTags(QUICK_TAGS_ACTUAL, tagsActual, toggleActual)}
          <textarea
            className="w-full p-3 rounded-xl border border-[var(--color-border)] bg-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all h-16 resize-none text-sm"
            placeholder="¿Qué te impide hacer tu problema?"
            value={actualText}
            onChange={(e) => setActualText(e.target.value)}
          />
        </div>

        {/* ── SITUACIÓN DESEADA ── */}
        <div className="space-y-2">
          <h3 className="text-base font-bold text-[var(--color-secondary)]">
            ¿Cómo te gustaría estar en un mes <span className="text-[var(--color-primary)]">al solucionar</span> esto?
          </h3>
          {renderTags(QUICK_TAGS_DESEADA, tagsDeseada, toggleDeseada)}
          <textarea
            className="w-full p-3 rounded-xl border border-[var(--color-border)] bg-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all h-16 resize-none text-sm"
            placeholder="¿Cómo te gustaría sentirte?"
            value={deseadaText}
            onChange={(e) => setDeseadaText(e.target.value)}
          />
        </div>
      </div>
    </StepLayout>
  );
}

// ──────────────────────────────────────────────────
// CHOICE CARD SCREEN: Large tactile cards grid
// Supports single/multi select + dynamic "Otros" textarea
// Uses StepLayout for anchored buttons
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
    <StepLayout
      footer={
        <StepNav onBack={onBack} onNext={handleNext} nextDisabled={!isValid} />
      }
    >
      <div className="space-y-6 max-w-3xl mx-auto w-full">
        {/* Header */}
        <div className="text-center space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">{step}</p>
          <h2 className="text-xl md:text-2xl font-black text-[var(--color-secondary)] leading-tight">{title}</h2>
          {multi && <p className="text-sm text-[var(--color-text-muted)]">Puedes seleccionar varias opciones</p>}
        </div>

        {/* Cards Grid */}
        <div className={`grid gap-3 ${columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-xl mx-auto'}`}>
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
                    w-full p-4 md:p-5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer
                    ${isSelected
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)]'
                      : 'border-[var(--color-border)] bg-white hover:border-gray-300'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {multi && (
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'border-[var(--color-primary)] bg-[var(--color-primary)]' : 'border-gray-300'}`}>
                        {isSelected && <span className="text-white text-xs font-bold">✓</span>}
                      </div>
                    )}
                    <span className={`text-sm md:text-base font-semibold leading-snug ${isSelected ? 'text-[var(--color-secondary)]' : 'text-[var(--color-text-muted)]'}`}>
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
                    className="mt-2"
                  >
                    <textarea
                      className="w-full p-3 rounded-xl border border-[var(--color-border)] bg-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all h-20 resize-none text-sm"
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
      </div>
    </StepLayout>
  );
}

// ──────────────────────────────────────────────────
// CONTACT FORM (Nombre, Email, WhatsApp)
// Uses StepLayout footer pattern via parent StepLayout
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
    <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
      {/* Scrollable inputs */}
      <div className="flex-1 overflow-y-auto space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[var(--color-secondary)]">Nombre completo *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons-outlined text-gray-400 text-lg">person</span>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre completo" required
              className="w-full pl-10 pr-4 py-3.5 text-sm border-2 border-[var(--color-border)] rounded-xl bg-white focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-colors" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[var(--color-secondary)]">Email *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons-outlined text-gray-400 text-lg">email</span>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required
              className="w-full pl-10 pr-4 py-3.5 text-sm border-2 border-[var(--color-border)] rounded-xl bg-white focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-colors" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[var(--color-secondary)]">WhatsApp *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons-outlined text-gray-400 text-lg">phone</span>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+34 600 000 000" required
              className="w-full pl-10 pr-4 py-3.5 text-sm border-2 border-[var(--color-border)] rounded-xl bg-white focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-colors" />
          </div>
        </div>
      </div>
      {/* Anchored navigation */}
      <div className="flex-shrink-0 flex items-center justify-between pt-6 pb-2">
        <button type="button" onClick={onBack} className="btn-back">
          <span className="material-icons-outlined">arrow_back</span> Atrás
        </button>
        <button type="submit" disabled={!isValid} className="btn-primary py-4 px-10 text-base uppercase tracking-wider font-black disabled:opacity-40 disabled:cursor-not-allowed">
          SIGUIENTE PASO
        </button>
      </div>
    </form>
  );
}
