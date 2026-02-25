import { Location, TimeSlot } from './types';

// ───────────────────────────────────────────────────
// Reglas de Negocio — Horarios y Restricciones
// ───────────────────────────────────────────────────

/** Duración de cada sesión en minutos (Ocupa 1h en agenda) */
export const SESSION_DURATION_MINUTES = 60;

/**
 * Horarios disponibles por ubicación.
 * 
 * Valencia + Online comparten los mismos horarios.
 * Motilla tiene horarios exclusivos solo los martes.
 *
 * Día 0=Dom, 1=Lun, 2=Mar, 3=Mié, 4=Jue, 5=Vie, 6=Sáb
 */
export const SCHEDULE: Record<Location, Record<number, string[]>> = {
    valencia: {
        2: ['11:00', '18:00'],                                          // Martes
        3: ['11:00', '12:00', '13:00', '16:00', '17:00'],              // Miércoles (reducido: sin 18h para desplazarme)
        4: ['11:00', '12:00', '13:00', '16:00', '17:00', '18:00', '19:00'], // Jueves
        5: ['11:00', '12:00', '13:00', '16:00', '17:00', '18:00', '19:00'], // Viernes
    },
    online: {
        2: ['11:00', '18:00'],                                          // Martes
        3: ['11:00', '12:00', '13:00', '16:00', '17:00', '18:00'],     // Miércoles
        4: ['11:00', '12:00', '13:00', '16:00', '17:00', '18:00', '19:00'], // Jueves
        5: ['11:00', '12:00', '13:00', '16:00', '17:00', '18:00', '19:00'], // Viernes
    },
    motilla: {
        2: ['13:00', '16:00'], // Martes exclusivo
    },
};

/**
 * Restricción cruzada martes (Valencia ↔ Motilla):
 * Si uno se reserva, el otro se bloquea.
 * NO aplica a Online.
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

        if (location === 'valencia' && occupiedValencia.includes(time)) {
            available = false;
        } else if (location === 'motilla' && occupiedMotilla.includes(time)) {
            available = false;
        } else if (location === 'online' && occupiedValencia.includes(time)) {
            // Online comparte horarios con Valencia
            available = false;
        }

        // Restricción cruzada (solo martes, solo Valencia ↔ Motilla)
        if (available && dayOfWeek === 2 && location !== 'online') {
            for (const [valSlot, motSlot] of CROSS_BLOCK_PAIRS) {
                if (location === 'valencia' && time === valSlot) {
                    if (occupiedMotilla.includes(motSlot)) {
                        available = false;
                    }
                }
                if (location === 'motilla' && time === motSlot) {
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
    valencia: 'Presencial — Picanya (Valencia)',
    motilla: 'Presencial — Motilla del Palancar',
    online: 'Online — Videollamada',
};

export const LOCATION_DESCRIPTIONS: Record<Location, string> = {
    valencia: 'C/ Torrent, 30, puerta 4',
    motilla: 'C/ San Isidro, 18',
    online: 'Google Meet — No necesitas instalar nada',
};

export const GATE_BLOCKED_NOTE = "Para que la terapia sea efectiva, es necesario un nivel alto de determinación. Si en este momento solo tienes curiosidad, quizás no sea el momento adecuado para empezar este proceso. Puedes volver cuando sientas que el cambio es una prioridad para ti.";
