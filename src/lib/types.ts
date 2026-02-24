// ───────────────────────────────────────────────────
// Types & Interfaces — Sistema de Reservas
// ───────────────────────────────────────────────────

export type Location = 'valencia' | 'motilla' | 'online';

export interface TriageAnswers {
  [questionId: string]: string | string[];
}

export interface TimeSlot {
  time: string;        // "11:00", "13:00", etc.
  available: boolean;
  location: Location;
}

export interface BookingData {
  // Triage data
  triageAnswers: TriageAnswers;
  // Location
  location: Location;
  // Calendar
  date: string;        // ISO date string "2026-03-04"
  time: string;        // "11:00"
  // Personal info
  name: string;
  email: string;
  phone: string;
  acceptPrivacy: boolean;
}

export interface BookingResponse {
  success: boolean;
  eventId?: string;
  message: string;
}

export type WizardStep = 0 | 1 | 2 | 3;
