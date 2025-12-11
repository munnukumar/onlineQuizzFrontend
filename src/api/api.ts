// src/services/api.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import type { Quiz } from "../features/quiz/types";

export interface UserQuizResult {
  userName: string;
  quizTitle: string;
  obtainedMarks: number;
  totalMarks: number;
  passingStatus: "PASS" | "FAIL";
}


export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Online Quizzes"],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<
      { accessToken: string; refreshToken: string;  user: { _id: string; name: string; email: string; role: string } },
     { email: string; password: string }>(
      {
        query: (credentials) => ({
          url: "/auth/login",
          method: "POST",
          body: credentials,
        }),
      }
    ),

    register: builder.mutation<
      { success: boolean },
      { name: string; email: string; password: string }
    >({
      query: (data) => ({
        url: "/auth/signup",
        method: "POST",
        body: data,
      }),
    }),

    // Fetch published quizzes
    publishedQuizzesList: builder.query<Quiz[], void>({
      query: () => "/quizzes/published/quizz",
      providesTags: ["Online Quizzes"],
    }),

    // Start a quiz attempt
    startAttempt: builder.mutation<
      { _id: string; quiz: string; user: string },
      string
    >({
      query: (quizId) => ({
        url: `/attempts/start/${quizId}`,
        method: "POST",
      }),
    }),

    // Fetch full quiz with all questions
    fetchQuiz: builder.query<Quiz, string>({
      query: (quizId) => `/quizzes/${quizId}`,
    }),

    // Submit quiz attempt
    submitAttempt: builder.mutation<
      { success: boolean; attemptId: string },
      { attemptId: string; answers: { questionId: string; answer: string }[] }
    >({
      query: ({ attemptId, answers }) => ({
        url: `/attempts/submit/${attemptId}`,
        method: "POST",
        body: { answers },
      }),
    }),


        // Fetch user quiz results
    userQuizResults: builder.query<UserQuizResult[], void>({
      query: () => `/results`,
      providesTags: ["Online Quizzes"],
    }),
  }),
});

// Export hooks
export const {
  useLoginMutation,
  useRegisterMutation,
  usePublishedQuizzesListQuery,
  useStartAttemptMutation,
  useFetchQuizQuery,
  useSubmitAttemptMutation,
  useUserQuizResultsQuery,
} = api;
