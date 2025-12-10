// src/features/quiz/types.ts
export interface Question {
  _id?: string;
  quiz: string;
  text: string;
  type: "mcq" | "tf" | "short";
  options?: string[];
  correctAnswer?: string | string[];
  marks?: number;
}

export interface Quiz {
  _id: string;
  title: string;
  description?: string;
  durationMinutes: number;
  questionsCount: number;
  published: boolean;
  questions?: Question[];
  createdAt?: string;
}
