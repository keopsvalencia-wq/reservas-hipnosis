import { TriageAnswers } from '@/lib/types';

// ───────────────────────────────────────────────────
// Tipos de input soportados por el formulario
// ───────────────────────────────────────────────────
export type QuestionInputType = 'select' | 'radio' | 'text' | 'textarea';

export interface TriageQuestionOption {
    value: string;
    label: string;
}

export interface TriageQuestionDef {
    id: string;
    text: string;
    type: QuestionInputType;
    options?: TriageQuestionOption[];
    placeholder?: string;
    /** Visual grouping hint: questions with same group render together */
    group?: string;
    /** Visual hint for adjacent pairing (5A + 5B) */
    pairWith?: string;
    showIf?: (answers: TriageAnswers) => boolean;
}

// ───────────────────────────────────────────────────
// 8 PREGUNTAS DE CUALIFICACIÓN (Cuaderno "Calendly reservas")
// ───────────────────────────────────────────────────

export const triageQuestions: TriageQuestionDef[] = [
    // ─── Q1: Motivo de consulta (Desplegable) ─────────
    {
        id: 'motivo',
        text: 'Cuéntame, ¿cuál de las siguientes opciones encaja más con tu motivo de consulta?',
        type: 'select',
        options: [
            { value: 'enfermedad', label: 'Enfermedad' },
            { value: 'soledad', label: 'Soledad o abandono' },
            { value: 'movilidad', label: 'Movilidad' },
            { value: 'ruina', label: 'Ruina' },
            { value: 'sin_trabajo', label: 'Sin trabajo' },
            { value: 'duelo', label: 'Muerte / Duelo' },
            { value: 'ansiedad_depresion', label: 'Ansiedad / Depresión / Bloqueos emocionales' },
            { value: 'otro', label: 'Otro motivo' },
        ],
    },
    // ─── Q2: Dedicación (Texto libre) ─────────────────
    {
        id: 'dedicacion',
        text: '¿A qué te dedicas actualmente?',
        type: 'text',
        placeholder: 'Ej. Enfermera, autónomo, desempleado...',
    },
    // ─── Q3: Ciudad (Texto corto) ─────────────────────
    {
        id: 'ciudad',
        text: '¿En qué ciudad o población vives?',
        type: 'text',
        placeholder: 'Ej. Valencia, Madrid, Cuenca...',
    },
    // ─── Q4: Edad (Desplegable) ───────────────────────
    {
        id: 'edad',
        text: '¿Cuántos años tienes?',
        type: 'select',
        options: [
            { value: 'menos_25', label: 'Menos de 25' },
            { value: '25_40', label: 'De 25 a 40' },
            { value: '40_55', label: 'De 40 a 55' },
            { value: '55_mas', label: 'De 55 en adelante' },
        ],
    },
    // ─── Q5A: Situación Actual (Textarea) ─────────────
    // Nota: 5A y 5B se muestran juntas para generar contraste psicológico
    {
        id: 'situacion_actual',
        text: 'SITUACIÓN ACTUAL: Describe brevemente cómo estás en este momento a nivel emocional y qué te impide hacer tu problema.',
        type: 'textarea',
        placeholder: 'Cuéntame cómo te sientes ahora mismo y cómo afecta tu día a día...',
        group: 'situacion',
    },
    // ─── Q5B: Situación Deseada (Textarea) ────────────
    {
        id: 'situacion_deseada',
        text: 'SITUACIÓN DESEADA: ¿Cómo te gustaría estar y sentirte dentro de exactamente un mes si trabajamos juntos?',
        type: 'textarea',
        placeholder: 'Describe cómo sería tu vida ideal dentro de un mes...',
        group: 'situacion',
        pairWith: 'situacion_actual',
    },
    // ─── Q6: Compromiso (Escala 1-10 como desplegable) ─
    {
        id: 'compromiso_escala',
        text: 'En una escala del 1 al 10, ¿qué tan comprometid@ estás para empezar a hacer hoy mismo lo que tengas que hacer para solucionar tu problema?',
        type: 'select',
        options: [
            { value: '1', label: '1 — Muy poco' },
            { value: '2', label: '2' },
            { value: '3', label: '3' },
            { value: '4', label: '4' },
            { value: '5', label: '5 — Regular' },
            { value: '6', label: '6' },
            { value: '7', label: '7' },
            { value: '8', label: '8' },
            { value: '9', label: '9' },
            { value: '10', label: '10 — Totalmente comprometid@' },
        ],
    },
    // ─── Q7: Tiempo (Selección única) ─────────────────
    {
        id: 'tiempo',
        text: '¿Estás dispuest@ a invertir tiempo para conseguir tus objetivos?',
        type: 'radio',
        options: [
            { value: 'sin_tiempo', label: '🔴 No tengo tiempo, mi día a día me come.' },
            { value: '2_horas', label: '🟡 Podría sacar unas 2 horas al día.' },
            { value: 'todo_tiempo', label: '🟢 El tiempo que haga falta. Mi salud mental es ahora mismo mi prioridad absoluta.' },
        ],
    },
    // ─── Q8: INVERSIÓN — GATE QUESTION ────────────────
    // Si elige 🔴 → se bloquea el acceso al calendario
    {
        id: 'inversion',
        text: 'EL COMPROMISO (Inversión)',
        type: 'radio',
        options: [
            { value: 'con_recursos', label: '🟢 Cuento con los recursos (700€ - 1.000€). Estoy list@ para invertir en mi tranquilidad y reservar mi plaza.' },
            { value: 'dispuesto', label: '🟢 Estoy dispuest@ a invertir lo necesario. Invertiré lo que haga falta para resolver mi problema definitivamente.' },
            { value: 'sin_recursos', label: '🔴 No tengo recursos ni intención de invertir dinero en mi salud mental.' },
        ],
    },
];

// Texto introductorio que se muestra antes de Q8
export const GATE_INTRO_TEXT =
    'Como ya sabes, si veo que puedo ayudarte a solucionar este problema de raíz, la inversión de mi método completo oscila entre 700€ y 1.000€ (pago dividido: señal en esta evaluación y el resto en la primera sesión).\n\nSabiendo que si no te puedo ayudar el coste es 0€, elige la opción que mejor te defina:';

// Gate: la pregunta que bloquea el avance
export const GATE_QUESTION_ID = 'inversion';
export const GATE_BLOCKED_VALUE = 'sin_recursos';

// Nota para la opción roja
export const GATE_BLOCKED_NOTE =
    'Si es tu caso, por favor no reserves la sesión para no quitarle la plaza a otra persona. Vuelve cuando sea tu momento.';
