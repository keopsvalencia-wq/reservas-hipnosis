// ───────────────────────────────────────────────────
// Types & Interfaces — Sistema de Reservas
// ───────────────────────────────────────────────────

export type Location = 'valencia' | 'motilla' | 'online';

export type QuestionType = 'select' | 'radio' | 'multiselect' | 'text' | 'slider';

export interface QuestionOption {
  value: string;
  label: string;
}

export interface TriageQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options?: QuestionOption[];
  placeholder?: string;
  min?: number;
  max?: number;
  required: boolean;
  /** Show this question only when the condition is met */
  showWhen?: {
    questionId: string;
    answer: string | string[];
  };
}

export interface TriageAnswers {
  [questionId: string]: string | string[] | number;
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
