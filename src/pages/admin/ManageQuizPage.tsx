// src/pages/admin/ManageQuizPage.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";

import AdminSidebar from "../../components/AdminSidebar";
import TopBar from "../../components/TopBar";

import {
  useGetAllQuizzesQuery,
  useGetQuizQuery, // ✅ FIX: use this instead
} from "../../features/quiz/quizApi";

import type { Quiz, Question } from "../../features/quiz/types";

import EditQuizModal from "./components/EditQuizModal";
import EditQuestionModal from "./components/EditQuestionModal";
import AddQuestionModal from "./components/AddQuestion";

export default function ManageQuizPage() {
  const { data: quizzes, isLoading } = useGetAllQuizzesQuery();

  // Modal states
  const [showEditQuiz, setShowEditQuiz] = useState<Quiz | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<{
    quizId: string;
    question: Question;
  } | null>(null);
  const [addingQuestionQuizId, setAddingQuestionQuizId] = useState<string | null>(null);

  // Track expanded quiz
  const [expandedQuizId, setExpandedQuizId] = useState<string | null>(null);

  // Load full quiz → contains questions array
  const { data: expandedQuiz, isLoading: loadingQuiz } = useGetQuizQuery(
    expandedQuizId!,
    {
      skip: !expandedQuizId,
    }
  );

  const questions = expandedQuiz?.questions || [];

  if (isLoading) return <div>Loading quizzes...</div>;
  if (!quizzes || quizzes.length === 0) return <div>No quizzes found</div>;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <TopBar />

        <motion.main className="p-6 space-y-6">
          {quizzes.map((quiz: Quiz) => {
            const isExpanded = expandedQuizId === quiz._id;

            return (
              <div key={quiz._id} className="bg-white rounded-xl shadow p-4">
                {/* ========================== */}
                {/* QUIZ HEADER */}
                {/* ========================== */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{quiz.title}</h2>
                    <p className="text-sm text-gray-500">{quiz.description}</p>
                    <p className="text-sm text-gray-500">
                      Duration: {quiz.durationMinutes} min
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {/* Edit Quiz */}
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                      onClick={() => setShowEditQuiz(quiz)}
                    >
                      Edit Quiz
                    </button>

                    {/* Show Questions or Add */}
                    {quiz.questionsCount > 0 ? (
                      <button
                        className="px-3 py-1 bg-indigo-600 text-white rounded"
                        onClick={() =>
                          setExpandedQuizId(isExpanded ? null : quiz._id)
                        }
                      >
                        {isExpanded ? "Hide Questions" : "Show Questions"}
                      </button>
                    ) : (
                      <button
                        className="px-3 py-1 bg-green-600 text-white rounded"
                        onClick={() => setAddingQuestionQuizId(quiz._id)}
                      >
                        Add Question
                      </button>
                    )}
                  </div>
                </div>

                {/* ========================== */}
                {/* QUESTIONS LIST */}
                {/* ========================== */}
                {isExpanded && (
                  <div className="space-y-2">
                    {loadingQuiz ? (
                      <p className="text-gray-500">Loading questions...</p>
                    ) : questions.length > 0 ? (
                      questions.map((q: Question) => (
                        <div
                          key={q._id}
                          className="bg-gray-50 p-3 rounded flex justify-between items-start"
                        >
                          <div>
                            <p className="font-medium">{q.text}</p>
                            <p className="text-sm text-gray-500">
                              Type: {q.type.toUpperCase()}
                            </p>

                            {/* Options */}
                            {q.options && q.options.length > 0 ? (
                              <p className="text-sm text-gray-500">
                                Options: {q.options.join(", ")}
                              </p>
                            ) : (
                              <p className="text-sm text-gray-500">No options</p>
                            )}

                            <p className="text-sm text-gray-500">
                              Answer: {q.correctAnswer || "—"}
                            </p>
                          </div>

                          <button
                            className="px-3 py-1 bg-purple-600 text-white rounded"
                            onClick={() =>
                              setEditingQuestion({ quizId: quiz._id, question: q })
                            }
                          >
                            Edit Question
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No questions found.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </motion.main>

        {/* ========================== */}
        {/* MODALS */}
        {/* ========================== */}

        {showEditQuiz && (
          <EditQuizModal
            quiz={showEditQuiz}
            onClose={() => setShowEditQuiz(null)}
          />
        )}

        {editingQuestion && (
          <EditQuestionModal
            quizId={editingQuestion.quizId}
            question={editingQuestion.question}
            onClose={() => setEditingQuestion(null)}
          />
        )}

        {addingQuestionQuizId && (
          <AddQuestionModal
            quizId={addingQuestionQuizId}
            onClose={() => setAddingQuestionQuizId(null)}
          />
        )}
      </div>
    </div>
  );
}
