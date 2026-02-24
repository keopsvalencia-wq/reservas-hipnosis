import { TriageAnswers } from '@/lib/types';

// ───────────────────────────────────────────────────
// Tipos de input soportados por el formulario
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
    pairWith?: string;
    showIf?: (answers: TriageAnswers) => boolean;
}

// ───────────────────────────────────────────────────
// PREGUNTAS DE CUALIFICACIÓN
// ───────────────────────────────────────────────────

export const triageQuestions: TriageQuestionDef[] = [
    // ─── P3: Motivo (MULTISELECCIÓN) ──────────────────
    {
        id: 'motivo_consulta',
        text: '¿Cuál es tu motivo de consulta?',
        type: 'multiselect',
        options: [
            { value: 'ansiedad', label: 'Ansiedad' },
            { value: 'depresion', label: 'Depresión' },
            { value: 'traumas', label: 'Traumas' },
            { value: 'adicciones', label: 'Adicciones' },
            { value: 'fobias', label: 'Fobias' },
            { value: 'otros', label: 'Otros' },
        ],
    },
    // ─── P4: Miedo profundo (Selección única) ─────────
    {
        id: 'miedo_futuro',
        text: '¿Qué es lo que más miedo te da que pase?',
        type: 'select',
        options: [
            { value: 'enfermedad', label: 'Enfermedad' },
            { value: 'soledad', label: 'Soledad o abandono' },
            { value: 'movilidad', label: 'Movilidad' },
            { value: 'ruina', label: 'Ruina' },
            { value: 'sin_trabajo', label: 'Sin trabajo' },
            { value: 'muerte', label: 'Muerte / Duelo' },
        ],
    },
    // ─── P5: Datos personales ─────────────────────────
    {
        id: 'dedicacion',
        text: '¿A qué te dedicas actualmente?',
        type: 'text',
        placeholder: 'Ej. Enfermera, autónomo, desempleado...',
        group: 'datos',
    },
    {
        id: 'ciudad',
        text: '¿En qué ciudad o población vives?',
        type: 'text',
        placeholder: 'Ej. Valencia, Madrid, Cuenca...',
        group: 'datos',
    },
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
        group: 'datos',
    },
    // ─── P6: Bloque de Contraste ──────────────────────
    {
        id: 'situacion_actual',
        text: 'SITUACIÓN ACTUAL: Describe brevemente cómo estás en este momento a nivel emocional y qué te impide hacer tu problema.',
        type: 'textarea',
        placeholder: 'Cuéntame cómo te sientes ahora mismo y cómo afecta tu día a día...',
        group: 'contraste',
    },
    {
        id: 'situacion_deseada',
        text: 'SITUACIÓN DESEADA: ¿Cómo te gustaría estar y sentirte dentro de exactamente un mes si trabajamos juntos?',
        type: 'textarea',
        placeholder: 'Describe cómo sería tu vida ideal dentro de un mes...',
        group: 'contraste',
        pairWith: 'situacion_actual',
    },
    // ─── P7: Compromiso ───────────────────────────────
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
        group: 'filtros',
    },
    // ─── P7: Inversión (GATE) ─────────────────────────
    {
        id: 'inversion',
        text: 'EL COMPROMISO (Inversión)',
        type: 'radio',
        options: [
            { value: 'con_recursos', label: '🟢 Cuento con los recursos (700€ - 1.000€). Estoy list@ para invertir en mi tranquilidad y reservar mi plaza.' },
            { value: 'dispuesto', label: '🟢 Estoy dispuest@ a invertir lo necesario. Invertiré lo que haga falta para resolver mi problema definitivamente.' },
            { value: 'sin_recursos', label: '🔴 No tengo recursos ni intención de invertir dinero en mi salud mental.' },
        ],
        group: 'filtros',
    },
];

// Texto introductorio que se muestra antes de Q inversión
export const GATE_INTRO_TEXT =
    'Como ya sabes, si veo que puedo ayudarte a solucionar este problema de raíz, la inversión de mi método completo oscila entre 700€ y 1.000€ (pago dividido: señal en esta evaluación y el resto en la primera sesión).\n\nSabiendo que si no te puedo ayudar el coste es 0€, elige la opción que mejor te defina:';

// Gate: la pregunta que bloquea el avance
export const GATE_QUESTION_ID = 'inversion';
export const GATE_BLOCKED_VALUE = 'sin_recursos';

export const GATE_BLOCKED_NOTE =
    'Si es tu caso, por favor no reserves la sesión para no quitarle la plaza a otra persona. Vuelve cuando sea tu momento.';
