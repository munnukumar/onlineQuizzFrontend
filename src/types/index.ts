export type Role = "ADMIN" | "USER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
}

export type QuestionType = "MCQ" | "TF";

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[]; // for MCQ
  correct?: number | boolean; // index or bool
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  durationMinutes: number;
  questions: Question[];
  createdBy: string;
}
