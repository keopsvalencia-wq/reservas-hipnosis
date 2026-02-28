'use client';

import { useState, useEffect } from 'react';
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
  const [contactData, setContactData] = useState({ fullName: '', email: '', phone: '' });
  const [isBlocked, setIsBlocked] = useState(false);
  const [isStepValid, setIsStepValid] = useState(true);
  const [prefetchedBusySlots, setPrefetchedBusySlots] = useState<string[]>([]);

  // Prefetch availability
  useEffect(() => {
    const start = new Date().toISOString().split('T')[0];
    const end = new Date();
    end.setMonth(end.getMonth() + 2);
    const endStr = end.toISOString().split('T')[0];
    fetch(`/api/availability?start=${start}&end=${endStr}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setPrefetchedBusySlots(data.busySlots);
      })
      .catch(err => console.error('Availability Prefetch error:', err));
  }, []);

  // Reset validation on screen change — default to true (informative)
  // Forms will override this to false upon mount if invalid
  useEffect(() => {
    setIsStepValid(true);
  }, [screen]);

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
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto border-2 border-amber-100 mb-2">
              <svg className="w-8 h-8 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
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
              <div className="space-y-2">
                <motion.button
                  onClick={next}
                  className="btn-primary w-full text-base py-3.5 uppercase tracking-wider font-black whitespace-nowrap"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  RESERVAR MI PLAZA AHORA
                </motion.button>
                <p className="text-[9px] text-gray-400 text-center uppercase tracking-widest font-bold">Ver disponibilidad y compromiso</p>
              </div>
            }
          >
            <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-12 max-w-6xl mx-auto py-2">
              {/* Left: Content */}
              <div className="flex-1 text-center lg:text-left space-y-4 order-2 lg:order-1 max-w-2xl">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-[var(--color-secondary)] leading-[1.1] tracking-tight">
                  Solicita tu Evaluación Diagnóstica.
                </h1>

                <div className="space-y-1">
                  <p className="text-base md:text-xl text-[var(--color-primary)] font-bold tracking-tight">
                    Solo de 3 a 5 plazas disponibles cada mes.
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] leading-relaxed font-medium lg:text-justify">
                    Analizaremos la raíz de tu problema y trazaremos el plan exacto para arrancarlo definitivamente.
                  </p>
                </div>

                <div className="bg-white border border-gray-100 rounded-xl p-4 w-full">
                  <p className="text-sm text-[var(--color-secondary)] font-bold leading-relaxed lg:text-justify">
                    🛡️ Garantía: Si veo que no puedo garantizarte resultados, la sesión será 0€.
                  </p>
                </div>
              </div>

              {/* Right: Authority Image */}
              <div className="flex-1 relative order-1 lg:order-2 w-full max-w-[280px] md:max-w-md mx-auto lg:mx-0">
                <div className="relative rounded-2xl overflow-hidden bg-white">
                  <img
                    src="/images/salva-autoridad.png"
                    alt="Salva Vera"
                    className="w-full h-auto block rounded-2xl"
                    style={{ display: 'block', maxHeight: '220px', objectFit: 'cover', objectPosition: 'top' }}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent" />
                </div>

                {/* Authority Badge — Always visible */}
                <div className="absolute -top-2 -right-2 bg-white border border-gray-100 px-3 py-1.5 rounded-xl z-10 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-secondary)]">Salva Vera</p>
                </div>
              </div>
            </div>
          </StepLayout>
        );

      // ─── P1: REGALOS ─────────────────────────
      case 1:
        return (
          <StepLayout>
            <div className="space-y-4 pt-1 pb-2">
              <div className="text-center space-y-1 max-w-2xl mx-auto">
                <h2 className="text-xl md:text-4xl lg:text-5xl font-black text-[var(--color-secondary)] leading-tight">
                  Tus 3 Regalos de Claridad.
                </h2>
                <p className="text-xs md:text-lg text-[var(--color-text-muted)] font-medium leading-relaxed px-2">
                  Solo por asistir a tu evaluación, te llevarás:
                </p>
              </div>

              <div className="space-y-2 max-w-4xl mx-auto">
                {/* Card 01 */}
                <motion.div
                  whileHover={{ x: 8 }}
                  className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 flex flex-row items-start gap-4 group hover:border-[var(--color-primary)] transition-all duration-300"
                >
                  <div className="text-2xl md:text-3xl font-black text-[var(--color-primary)] opacity-30 group-hover:opacity-100 transition-opacity shrink-0 pt-0.5">01</div>
                  <div className="space-y-1.5">
                    <p className="text-sm md:text-base lg:text-lg text-[var(--color-secondary)] leading-snug font-bold">
                      Verás tu problema desde una perspectiva que <span className="text-[var(--color-primary)]">NADIE te había contado jamás</span>.
                    </p>
                    <p className="text-[11px] md:text-sm text-[var(--color-text-muted)] leading-relaxed italic border-l-2 md:border-l-4 border-emerald-50 pl-2 md:pl-3">
                      &quot;Mis pacientes dicen que esto les da más paz en 45 min que años de terapias convencionales.&quot;
                    </p>
                  </div>
                </motion.div>

                {/* Card 02 */}
                <motion.div
                  whileHover={{ x: 8 }}
                  className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 flex flex-row items-center md:items-start gap-4 group hover:border-[var(--color-primary)] transition-all duration-300"
                >
                  <div className="text-2xl md:text-3xl font-black text-[var(--color-primary)] opacity-30 group-hover:opacity-100 transition-opacity shrink-0">02</div>
                  <p className="text-sm md:text-base lg:text-lg text-[var(--color-secondary)] leading-snug font-bold">
                    Entenderás exactamente por qué <span className="text-[var(--color-primary)]">NADA de lo que has intentado</span> hasta hoy ha funcionado.
                  </p>
                </motion.div>

                {/* Card 03 */}
                <motion.div
                  whileHover={{ x: 8 }}
                  className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 flex flex-row items-center md:items-start gap-4 group hover:border-[var(--color-primary)] transition-all duration-300"
                >
                  <div className="text-2xl md:text-3xl font-black text-[var(--color-primary)] opacity-30 group-hover:opacity-100 transition-opacity shrink-0">03</div>
                  <p className="text-sm md:text-base lg:text-lg text-[var(--color-secondary)] leading-snug font-bold">
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
            hideFooter
            formId={`step-form-${screen}`}
            onValidationChange={setIsStepValid}
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
              <TriageForm
                subset={['dedicacion', 'ciudad', 'edad']}
                onComplete={handleTriageStep}
                onBack={back}
                buttonLabel="SIGUIENTE PASO"
                formId="step-form-3"
                onValidationChange={setIsStepValid}
              />
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
            hideFooter
            formId={`step-form-${screen}`}
            onValidationChange={setIsStepValid}
          />
        );

      // ─── P5: CONTRASTE (Híbrido: tags + texto) ──
      case 5:
        return (
          <ContrastScreen
            triageData={triageData}
            onComplete={(answers) => { setTriageData(prev => ({ ...prev, ...answers })); next(); }}
            onBack={back}
            formId={`step-form-${screen}`}
            onValidationChange={setIsStepValid}
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
              <TriageForm
                subset={['compromiso_escala', 'disponibilidad_tiempo']}
                onComplete={handleTriageStep}
                onBack={back}
                buttonLabel="SIGUIENTE PASO"
                formId="step-form-6"
                onValidationChange={setIsStepValid}
              />
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
              <TriageForm
                subset={['inversion']}
                onComplete={handleTriageStep}
                onBack={back}
                buttonLabel="Confirmar mi compromiso y ver agenda"
                formId="step-form-7"
                onValidationChange={setIsStepValid}
              />
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
                formId={`step-form-${screen}`}
                onValidationChange={setIsStepValid}
              />
            </div>
          </StepLayout>
        );

      // ─── P9: BOOKING ──────────────────────────
      case 9:
        return (
          <BookingWizard
            preloadedData={{
              triageAnswers: triageData,
              fullName: contactData.fullName,
              email: contactData.email,
              phone: contactData.phone
            }}
            onBack={back}
            prefetchedBusySlots={prefetchedBusySlots}
          />
        );

      default:
        return null;
    }
  };

  // Determine footer content for the current screen
  const renderFooter = () => {
    // Screens 1 to 8 should have navigation
    if (screen >= 1 && screen <= 8) {
      const isInformative = screen === 1; // Step 1 just shows info, no form

      // The Success state doesn't need navigation buttons
      if (isBlocked) return null;

      return (
        <StepNav
          onBack={back}
          onNext={isInformative ? next : undefined}
          nextDisabled={!isStepValid}
          type={isInformative ? "button" : "submit"}
          formId={isInformative ? undefined : `step-form-${screen}`}
        />
      );
    }

    return null;
  };

  return (
    <MasterScreen
      progress={progress}
      showProgress={screen > 0 && screen < 9}
      footer={renderFooter()}
    >
      <div className="flex-1 flex flex-col min-h-0 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen + (isBlocked ? '_blocked' : '')}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex-1 flex flex-col min-h-0"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>
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
  footer,
}: {
  children: React.ReactNode;
  progress: number;
  showProgress?: boolean;
  footer?: React.ReactNode;
}) {
  return (
    <div className="master-screen">
      <div className="master-screen__container">
        {/* Progress bar — thin, seamless */}
        {showProgress && (
          <div className="flex-shrink-0 px-6 md:px-14 lg:px-20 pt-2 md:pt-6">
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

        {/* Dynamic content area — flex-grow, centered */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {children}
        </div>

        {/* ANCHORED FOOTER — PERSISTENT ACROSS ANIMATIONS */}
        {footer && (
          <div className="step-layout__footer border-t border-gray-50">
            {footer}
          </div>
        )}
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
  type = 'button',
  formId,
}: {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  nextLoading?: boolean;
  subtitle?: string;
  type?: 'button' | 'submit';
  formId?: string;
}) {
  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div className="w-full flex items-center justify-between">
        {onBack ? (
          <button type="button" onClick={onBack} className="btn-back group">
            <svg className="w-5 h-5 mr-1 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Atrás
          </button>
        ) : <div />}

        <motion.button
          type={type}
          form={formId}
          onClick={(e) => {
            if (onNext) {
              onNext();
            } else if (type === 'submit' && formId) {
              // Manual trigger as backup for robustness
              const f = document.getElementById(formId) as HTMLFormElement;
              if (f) f.requestSubmit();
            }
          }}
          disabled={nextDisabled || nextLoading}
          className={`btn-primary py-4 px-10 text-base uppercase tracking-wider font-black transition-all ${nextDisabled
            ? '!bg-gray-200 !text-gray-400 !shadow-none cursor-not-allowed'
            : ''
            }`}
          whileHover={!nextDisabled ? { scale: 1.03 } : {}}
          whileTap={!nextDisabled ? { scale: 0.97 } : {}}
        >
          {nextLoading ? (
            <>
              <svg className="w-5 h-5 animate-spin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Procesando...
            </>
          ) : (
            nextLabel
          )}
        </motion.button>
      </div>
      {subtitle && <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{subtitle}</p>}
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
  formId,
  onValidationChange,
  hideFooter = true,
}: {
  triageData: Record<string, unknown>;
  onComplete: (answers: Record<string, string | string[]>) => void;
  onBack: () => void;
  hideFooter?: boolean;
  formId?: string;
  onValidationChange?: (isValid: boolean) => void;
}) {
  const [tagsActual, setTagsActual] = useState<string[]>(
    Array.isArray(triageData.situacion_tags) ? (triageData.situacion_tags as string[]) : []
  );
  const [actualText, setActualText] = useState((triageData.situacion_actual as string) || '');
  const [tagsDeseada, setTagsDeseada] = useState<string[]>(
    Array.isArray(triageData.situacion_deseada_tags) ? (triageData.situacion_deseada_tags as string[]) : []
  );
  const [deseadaText, setDeseadaText] = useState((triageData.situacion_deseada as string) || '');

  const isValid =
    (tagsActual.length > 0 || actualText.trim().length > 0) &&
    (tagsDeseada.length > 0 || deseadaText.trim().length > 0);

  useEffect(() => {
    onValidationChange?.(isValid);
  }, [isValid, onValidationChange]);

  const toggleActual = (tag: string) => {
    setTagsActual(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };
  const toggleDeseada = (tag: string) => {
    setTagsDeseada(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

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
    <StepLayout>
      <form id={formId} onSubmit={(e) => { e.preventDefault(); if (isValid) handleSubmit(); }} className="space-y-5 max-w-3xl mx-auto w-full">
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
      </form>
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
  hideFooter = false,
  formId,
  onValidationChange,
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
  hideFooter?: boolean;
  formId?: string;
  onValidationChange?: (isValid: boolean) => void;
}) {
  const [choices, setChoices] = useState<string[]>(() => {
    if (multi) {
      return Array.isArray(selected) ? selected : selected ? [selected] : [];
    }
    return selected && !Array.isArray(selected) ? [selected] : [];
  });

  const toggle = (opt: string) => {
    if (multi) {
      setChoices(prev => prev.includes(opt) ? prev.filter(v => v !== opt) : [...prev, opt]);
    } else {
      setChoices([opt]);
    }
  };

  const otherIsSelected = otherLabel ? choices.includes(otherLabel) : false;
  const isValid = choices.length > 0 && (!otherIsSelected || (otherText?.trim().length ?? 0) > 0);

  useEffect(() => {
    onValidationChange?.(isValid);
  }, [isValid, onValidationChange]);

  const handleNext = () => {
    if (!isValid) return;
    onSelect(multi ? choices : choices[0]);
  };

  return (
    <StepLayout>
      <form id={formId} onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6 max-w-3xl mx-auto w-full">
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
      </form>
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
  formId,
  onValidationChange,
}: {
  contactData: { fullName: string; email: string; phone: string };
  onSubmit: (data: { fullName: string; email: string; phone: string }) => void;
  onBack: () => void;
  formId?: string;
  onValidationChange?: (isValid: boolean) => void;
}) {
  const [fullName, setFullName] = useState(contactData.fullName);
  const [email, setEmail] = useState(contactData.email);
  const [phone, setPhone] = useState(contactData.phone);
  const [confirmPhone, setConfirmPhone] = useState(contactData.phone);

  const isValid = !!(
    fullName.trim() &&
    email.trim() &&
    phone.trim() &&
    phone === confirmPhone &&
    phone.length >= 9
  );

  useEffect(() => {
    onValidationChange?.(isValid);
  }, [isValid, onValidationChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) onSubmit({ fullName, email, phone });
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
      {/* Scrollable inputs */}
      <div className="flex-1 overflow-y-auto px-1 space-y-5" style={{ scrollbarWidth: 'thin' }}>
        <div className="space-y-1.5 text-left">
          <label className="text-sm font-bold text-[var(--color-secondary)]">Nombre y Apellidos *</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Tu nombre completo" required
              className="w-full pl-10 pr-4 py-3.5 text-sm border-2 border-[var(--color-border)] rounded-xl bg-white focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-colors box-border" />
          </div>
        </div>

        <div className="space-y-1.5 text-left">
          <label className="text-sm font-bold text-[var(--color-secondary)]">Email *</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required
              className="w-full pl-10 pr-4 py-3.5 text-sm border-2 border-[var(--color-border)] rounded-xl bg-white focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-colors box-border" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 text-left">
            <label className="text-sm font-bold text-[var(--color-secondary)]">Teléfono/WhatsApp *</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+34 600 000 000" required
                className="w-full pl-10 pr-4 py-3.5 text-sm border-2 border-[var(--color-border)] rounded-xl bg-white focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-colors box-border" />
            </div>
          </div>
          <div className="space-y-1.5 text-left">
            <label className="text-sm font-bold text-[var(--color-secondary)]">Confirma tu Teléfono *</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <input type="tel" value={confirmPhone} onChange={e => setConfirmPhone(e.target.value)} placeholder="Repite tu teléfono" required
                className={`w-full pl-10 pr-4 py-3.5 text-sm border-2 rounded-xl bg-white outline-none transition-colors focus:ring-2 box-border ${confirmPhone && phone !== confirmPhone
                  ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
                  : 'border-[var(--color-border)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]'
                  }`} />
            </div>
          </div>
        </div>

        {confirmPhone && phone !== confirmPhone && (
          <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider text-center">Los teléfonos no coinciden</p>
        )}
      </div>
    </form>
  );
}
