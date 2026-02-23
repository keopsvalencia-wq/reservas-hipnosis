import { TriageAnswers } from '@/lib/types';

export interface TriageQuestionOption {
    value: string;
    label: string;
}

export interface TriageQuestionDef {
    id: string;
    text: string;
    options: TriageQuestionOption[];
    showIf?: (answers: TriageAnswers) => boolean;
}

export const triageQuestions: TriageQuestionDef[] = [
    {
        id: 'motivo',
        text: '¿Qué motivo principal te trae aquí?',
        options: [
            { value: 'ansiedad', label: 'Ansiedad' },
            { value: 'estres', label: 'Estrés' },
            { value: 'autoestima', label: 'Autoestima' },
            { value: 'adicciones', label: 'Adicciones' },
            { value: 'miedos', label: 'Miedos y Fobias' },
            { value: 'traumas', label: 'Traumas' },
            { value: 'tristeza', label: 'Tristeza y Duelo' },
            { value: 'insomnio', label: 'Insomnio' },
            { value: 'peso', label: 'Control de Peso' },
            { value: 'tabaco', label: 'Dejar de Fumar' },
            { value: 'sexual', label: 'Problemas Sexuales' },
            { value: 'otro', label: 'Otro' },
        ],
    },
    {
        id: 'duracion',
        text: '¿Cuánto tiempo llevas con este problema?',
        options: [
            { value: 'menos_6', label: 'Menos de 6 meses' },
            { value: '6_12', label: 'De 6 a 12 meses' },
            { value: '1_3', label: 'De 1 a 3 años' },
            { value: 'mas_3', label: 'Más de 3 años' },
        ],
    },
    {
        id: 'terapias_previas',
        text: '¿Has probado otras terapias anteriormente?',
        options: [
            { value: 'si', label: 'Sí, he probado otras terapias' },
            { value: 'no', label: 'No, es mi primera vez' },
        ],
    },
    {
        id: 'tipo_terapias',
        text: '¿Qué tipo de terapias has probado?',
        options: [
            { value: 'psicologia', label: 'Psicología' },
            { value: 'psiquiatria', label: 'Psiquiatría' },
            { value: 'coaching', label: 'Coaching' },
            { value: 'hipnosis', label: 'Hipnosis' },
            { value: 'otra', label: 'Otra terapia' },
        ],
        showIf: (answers) => answers['terapias_previas'] === 'si',
    },
    {
        id: 'medicacion',
        text: '¿Estás tomando medicación actualmente?',
        options: [
            { value: 'si', label: 'Sí, estoy medicado/a' },
            { value: 'no', label: 'No tomo medicación' },
        ],
    },
    {
        id: 'impacto',
        text: '¿Cómo de afectada está tu vida diaria?',
        options: [
            { value: 'leve', label: 'Leve — Puedo seguir mi rutina' },
            { value: 'moderado', label: 'Moderado — Me cuesta funcionar a veces' },
            { value: 'grave', label: 'Grave — Afecta mi día a día significativamente' },
        ],
    },
    {
        id: 'modalidad',
        text: '¿Tienes preferencia de modalidad?',
        options: [
            { value: 'presencial', label: 'Presencial' },
            { value: 'online', label: 'Online' },
            { value: 'sin_preferencia', label: 'Sin preferencia' },
        ],
    },
    // ─── PREGUNTA 8 — Compromiso / Gate ───────────────────
    {
        id: 'compromiso',
        text: '¿Dispones de recursos (tiempo y económicos) para invertir en tu bienestar ahora mismo?',
        options: [
            { value: 'si_total', label: '✅ Sí, estoy decidido/a a invertir en mí' },
            { value: 'si_parcial', label: '🟡 Tengo dudas, pero quiero explorar opciones' },
            { value: 'sin_recursos', label: '🔴 No dispongo de recursos en este momento' },
        ],
    },
];

// ID de la pregunta "puerta": si el valor es este, se bloquea el avance
export const GATE_QUESTION_ID = 'compromiso';
export const GATE_BLOCKED_VALUE = 'sin_recursos';
