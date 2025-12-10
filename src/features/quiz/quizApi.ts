// src/features/quiz/quizApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import type { Quiz, Question } from "./types";
import { baseQuery } from "../../api/baseQuery";

export const quizApi = createApi({
  reducerPath: "quizApi",
  baseQuery,
  tagTypes: ["Quizzes", "Questions"],

  endpoints: (builder) => ({
    // ============================
    //        QUIZ LIST
    // ============================
    getAllQuizzes: builder.query<Quiz[], void>({
      query: () => "/quizzes",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Quizzes" as const, _id })),
              { type: "Quizzes", _id: "LIST" },
            ]
          : [{ type: "Quizzes", _id: "LIST" }],
    }),

    // ============================
    //        SINGLE QUIZ
    // ============================
    getQuiz: builder.query<Quiz, string>({
      query: (id) => `/quizzes/${id}`,
      providesTags: (result, error, id) => [{ type: "Quizzes", id }],
    }),

    // ============================
    //       CREATE QUIZ
    // ============================
    createQuiz: builder.mutation<Quiz, Partial<Quiz>>({
      query: (body) => ({
        url: "/quizzes",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Quizzes", id: "LIST" }],
    }),

    // ============================
    //       DELETE QUIZ
    // ============================
    deleteQuiz: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/quizzes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Quizzes", id },
        { type: "Quizzes", id: "LIST" },
      ],
    }),

    // ============================
    //     GET QUESTIONS BY QUIZ
    // ============================
    getQuestionsByQuiz: builder.query<Question[], string>({
      query: (quizId) => `/quizzes/${quizId}/questions`,
      providesTags: (result, error, quizId) => [
        { type: "Questions", id: quizId },
      ],
    }),

    // ============================
    //        ADD QUESTION
    // ============================
    addQuestion: builder.mutation<
      Question,
      { quizId: string; question: Partial<Question> }
    >({
      query: ({ quizId, question }) => ({
        url: `/quizzes/${quizId}/questions`,
        method: "POST",
        body: question,
      }),
      invalidatesTags: (result, error, { quizId }) => [
        { type: "Questions", id: quizId },
        { type: "Quizzes", id: quizId },
      ],
    }),

    // features/quiz/quizApi.ts
    published: builder.mutation<
      Quiz,
      { id: string; published: boolean }
    >({
      query: ({ id, published }) => ({
        url: `/quizzes/${id}`,
        method: "PUT",
        body: { published },
      }),
      invalidatesTags: ['Quizzes'],
    }),
  }),
});

// Export Hooks
export const {
  useGetAllQuizzesQuery,
  useGetQuizQuery,
  useCreateQuizMutation,
  useDeleteQuizMutation,
  useGetQuestionsByQuizQuery,
  useAddQuestionMutation,
  usePublishedMutation,
} = quizApi;
