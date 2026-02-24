import { TriageAnswers } from '@/lib/types';

// ───────────────────────────────────────────────────
// Tipos de input
// ───────────────────────────────────────────────────
export type QuestionInputType = 'select' | 'radio' | 'text' | 'textarea' | 'multiselect';

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
    group?: string;
}

// ───────────────────────────────────────────────────
// PREGUNTAS DEL EMBUDO
// ───────────────────────────────────────────────────

export const triageQuestions: TriageQuestionDef[] = [
    // ─── P3: Perfil + Motivo ──────────────────────────
    {
        id: 'dedicacion',
        text: '¿A qué te dedicas actualmente?',
        type: 'text',
        placeholder: 'Ej: Enfermera, autónomo, estudiante...',
        group: 'perfil',
    },
    {
        id: 'ciudad',
        text: '¿En qué ciudad o población vives?',
        type: 'text',
        placeholder: 'Ej: Valencia, Madrid, Motilla del Palancar...',
        group: 'perfil',
    },
    {
        id: 'edad',
        text: '¿Cuántos años tienes?',
        type: 'select',
        options: [
            { value: 'menos_18', label: 'Menos de 18' },
            { value: '18_25', label: '18 - 25' },
            { value: '26_35', label: '26 - 35' },
            { value: '36_45', label: '36 - 45' },
            { value: '46_55', label: '46 - 55' },
            { value: 'mas_55', label: 'Más de 55' },
        ],
        group: 'perfil',
    },
    // ─── P4: Contraste ────────────────────────────────
    {
        id: 'situacion_actual',
        text: '¿Cómo te sientes AHORA MISMO?',
        type: 'textarea',
        placeholder: 'Describe brevemente cómo estás a nivel emocional y qué te impide avanzar...',
        group: 'contraste',
    },
    {
        id: 'situacion_deseada',
        text: '¿Cómo te gustaría estar y sentirte dentro de aproximadamente un mes cuando solucionemos tu problema?',
        type: 'textarea',
        placeholder: 'Describe con detalle cómo será tu vida, tus emociones y tu día a día cuando hayamos resuelto esto juntos...',
        group: 'contraste',
    },
    // ─── P5: Compromiso ───────────────────────────────
    {
        id: 'compromiso_escala',
        text: 'En una escala del 1 al 10, ¿cuánto estás comprometid@ para resolver esto HOY?',
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
        group: 'compromiso',
    },
    {
        id: 'disponibilidad_tiempo',
        text: '¿Cuánto tiempo puedes dedicar a tu proceso de cambio diariamente?',
        type: 'radio',
        options: [
            { value: 'sin_tiempo', label: '🔴 No tengo tiempo, mi día a día me come.' },
            { value: '2h_dia', label: '🟡 Podría sacar unas 2 horas al día.' },
            { value: 'lo_que_haga_falta', label: '🟢 El tiempo que haga falta. Mi salud mental es ahora mismo mi prioridad absoluta.' },
        ],
        group: 'compromiso',
    },
    // ─── P6: Inversión (GATE) ─────────────────────────
    {
        id: 'inversion',
        text: 'Tu compromiso con la inversión',
        type: 'radio',
        options: [
            { value: 'con_recursos', label: '🟢 Cuento con los recursos (700€ - 1.000€). Estoy list@ para invertir en mi tranquilidad y reservar mi plaza.' },
            { value: 'dispuesto', label: '🟢 Estoy dispuest@ a invertir lo necesario. Invertiré lo que haga falta para resolver mi problema definitivamente.' },
            { value: 'sin_recursos', label: '🔴 No tengo recursos ni intención de invertir dinero en mi salud mental.' },
        ],
        group: 'inversion',
    },
];
// Gates: preguntas que bloquean el avance
export const GATES: { questionId: string; blockedValue: string; message: string }[] = [
    {
        questionId: 'disponibilidad_tiempo',
        blockedValue: 'sin_tiempo',
        message: 'Para que el tratamiento funcione, necesitas dedicar algo de tiempo diario a tu proceso de cambio. Si ahora mismo no puedes, vuelve cuando sea tu momento.',
    },
    {
        questionId: 'inversion',
        blockedValue: 'sin_recursos',
        message: 'Si es tu caso, por favor no reserves la sesión para no quitarle la plaza a otra persona. Vuelve cuando sea tu momento.',
    },
];

// Legacy exports for backward compat
export const GATE_QUESTION_ID = 'inversion';
export const GATE_BLOCKED_VALUE = 'sin_recursos';

export const GATE_INTRO_TEXT =
    'La inversión económica de mi método completo oscila entre 700€ y 1.000€ (pago dividido: señal en esta evaluación y el resto en la primera sesión).\n\nSi no te puedo garantizar resultados, el coste de la visita será 0€. Sin riesgo para ti.';

export const GATE_BLOCKED_NOTE =
    'Si es tu caso, por favor no reserves la sesión para no quitarle la plaza a otra persona. Vuelve cuando sea tu momento.';
