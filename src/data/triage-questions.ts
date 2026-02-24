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
    // ─── P3: Motivo (MULTISELECCIÓN) ──────────────────
    {
        id: 'motivo_consulta',
        text: '¿Cuál es tu principal motivo de consulta?',
        type: 'multiselect',
        options: [
            { value: 'ansiedad_bloqueos', label: 'Ansiedad / Bloqueos' },
            { value: 'depresion', label: 'Depresión' },
            { value: 'traumas', label: 'Traumas' },
            { value: 'adicciones', label: 'Adicciones' },
            { value: 'fobias', label: 'Fobias' },
            { value: 'otros', label: 'Otros' },
        ],
        group: 'datos',
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
        text: '¿Cómo te gustaría estar dentro de un MES?',
        type: 'textarea',
        placeholder: 'Describe cómo sería tu vida ideal dentro de un mes si solucionas tu problema...',
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
        text: '¿Cuánto tiempo puedes dedicar a las sesiones semanalmente?',
        type: 'select',
        options: [
            { value: '1h', label: '1 hora a la semana' },
            { value: '2h', label: '2 horas a la semana' },
            { value: 'flexible', label: 'Soy flexible, lo que haga falta' },
            { value: 'no_seguro', label: 'No estoy segur@' },
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

// Gate: la pregunta que bloquea el avance
export const GATE_QUESTION_ID = 'inversion';
export const GATE_BLOCKED_VALUE = 'sin_recursos';

export const GATE_INTRO_TEXT =
    'La inversión de mi método completo oscila entre 700€ y 1.000€ (pago dividido: señal en esta evaluación y el resto en la primera sesión).\n\nSi no te puedo garantizar resultados, el coste de la visita será 0€. Sin riesgo para ti.';

export const GATE_BLOCKED_NOTE =
    'Si es tu caso, por favor no reserves la sesión para no quitarle la plaza a otra persona. Vuelve cuando sea tu momento.';
