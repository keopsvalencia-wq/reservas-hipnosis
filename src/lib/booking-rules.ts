import { Location, TimeSlot } from './types';

// ───────────────────────────────────────────────────
// Reglas de Negocio — Horarios y Restricciones
// ───────────────────────────────────────────────────

/** Duración de cada sesión en minutos */
export const SESSION_DURATION_MINUTES = 45;

/**
 * Horarios disponibles por ubicación.
 * Solo los martes tienen restricciones cruzadas.
 */
export const SCHEDULE: Record<Location, Record<number, string[]>> = {
    // day 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
    valencia: {
        2: ['11:00', '18:00'], // Martes
    },
    motilla: {
        2: ['13:00', '16:00'], // Martes
    },
    online: {
        1: ['10:00', '12:00', '16:00', '18:00'], // Lunes
        2: ['10:00', '12:00', '16:00', '18:00'], // Martes
        3: ['10:00', '12:00', '16:00', '18:00'], // Miércoles
        4: ['10:00', '12:00', '16:00', '18:00'], // Jueves
        5: ['10:00', '12:00', '16:00', '18:00'], // Viernes
    },
};

/**
 * Restricción cruzada martes:
 * Si uno se ocupa, el otro se bloquea.
 * [valenciaSlot, motillaSlot]
 */
export const CROSS_BLOCK_PAIRS: [string, string][] = [
    ['11:00', '13:00'], // Valencia 11:00 ↔ Motilla 13:00
    ['18:00', '16:00'], // Valencia 18:00 ↔ Motilla 16:00
];

/**
 * Obtiene los slots del día para una ubicación.
 */
export function getSlotsForDay(
    location: Location,
    dayOfWeek: number
): string[] {
    return SCHEDULE[location]?.[dayOfWeek] ?? [];
}

/**
 * Verifica si un día tiene slots para la ubicación.
 */
export function isDayAvailable(
    location: Location,
    dayOfWeek: number
): boolean {
    return getSlotsForDay(location, dayOfWeek).length > 0;
}

/**
 * Aplica la restricción cruzada Valencia ↔ Motilla en martes.
 * Recibe los slots ya ocupados en ambas ubicaciones y devuelve
 * los slots disponibles para la ubicación solicitada.
 */
export function getAvailableSlots(
    location: Location,
    dayOfWeek: number,
    occupiedValencia: string[] = [],
    occupiedMotilla: string[] = []
): TimeSlot[] {
    const rawSlots = getSlotsForDay(location, dayOfWeek);

    return rawSlots.map((time) => {
        let available = true;

        // Comprobar si el slot está directamente ocupado
        if (location === 'valencia' && occupiedValencia.includes(time)) {
            available = false;
        } else if (location === 'motilla' && occupiedMotilla.includes(time)) {
            available = false;
        }

        // Restricción cruzada (solo martes)
        if (available && dayOfWeek === 2) {
            for (const [valSlot, motSlot] of CROSS_BLOCK_PAIRS) {
                if (location === 'valencia' && time === valSlot) {
                    // Si Motilla tiene ocupado su slot correspondiente
                    if (occupiedMotilla.includes(motSlot)) {
                        available = false;
                    }
                }
                if (location === 'motilla' && time === motSlot) {
                    // Si Valencia tiene ocupado su slot correspondiente
                    if (occupiedValencia.includes(valSlot)) {
                        available = false;
                    }
                }
            }
        }

        return { time, available, location };
    });
}

/**
 * Nombres legibles de las ubicaciones
 */
export const LOCATION_LABELS: Record<Location, string> = {
    valencia: 'Valencia (Picanya)',
    motilla: 'Motilla del Palancar',
    online: 'Online',
};

export const LOCATION_DESCRIPTIONS: Record<Location, string> = {
    valencia: 'Centro principal — Presencial',
    motilla: 'Cuenca — Presencial',
    online: 'Videollamada desde cualquier lugar',
};
