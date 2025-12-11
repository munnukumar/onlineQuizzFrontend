import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import TopBar from "../../../components/TopBar";
import {
  usePublishedQuizzesListQuery,
  useStartAttemptMutation,
  useUserQuizResultsQuery,
} from "../../../api/api";

import QuizCard from "./QuizCard";
import QuizModal from "./QuizModal";
import Section from "./Section";
import StatsCard from "./StatsCard";

import type { Quiz } from "../../../features/quiz/types";

export default function UserDashboard() {
  const navigate = useNavigate();

  const { data: quizzesData, isLoading, isFetching } = usePublishedQuizzesListQuery();
  const quizzes = quizzesData ?? [];

  const { data: userResults, isLoading: resultsLoading } = useUserQuizResultsQuery();

  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);
  const [hoveredQuizId, setHoveredQuizId] = useState<string | null>(null);

  const [startAttempt] = useStartAttemptMutation();

  const handleQuizClick = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setIsModalOpen(true);
  };

  const handleStart = async (quizId: string) => {
    try {
      setIsModalOpen(false);
      const result = await startAttempt(quizId).unwrap();
      navigate(`/quiz/${quizId}/attempt/${result._id}`);
    } catch (error) {
      console.error("Failed to start attempt:", error);
      alert("Unable to start quiz attempt.");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="flex-1 flex flex-col">
        <TopBar />

        {/* Animated Welcome */}
        <motion.div
          className="text-2xl font-bold text-gray-700 mb-4 ml-6 mt-4"
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Welcome Back, {userResults?.[0]?.userName ?? "User"}!
        </motion.div>

        <motion.main
          className="p-6 space-y-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Your quizzes & results</p>
            </div>
            <div className="text-sm text-gray-600">
              {isFetching ? "Refreshing..." : "Latest"}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Available Quizzes", value: quizzes.length, key: "available" },
              { label: "Quizzes Attempted", value: userResults?.length ?? 0, key: "attempted" },
            ].map((s) => (
              <div
                key={s.key}
                onMouseEnter={() => setHoveredStat(s.key)}
                onMouseLeave={() => setHoveredStat(null)}
              >
                <StatsCard label={s.label} value={s.value} hovered={hoveredStat === s.key} />
              </div>
            ))}
          </div>

          {/* Published Quizzes */}
          <Section title="Published Quizzes">
            {isLoading ? (
              <p>Loading...</p>
            ) : quizzes.length === 0 ? (
              <p>No published quizzes yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {quizzes.map((quiz) => (
                  <div
                    key={quiz._id}
                    onMouseEnter={() => setHoveredQuizId(quiz._id)}
                    onMouseLeave={() => setHoveredQuizId(null)}
                  >
                    <QuizCard
                      quiz={quiz}
                      onClick={handleQuizClick}
                      isHovered={hoveredQuizId === quiz._id}
                    />
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* USER RESULTS */}
          <Section title="Your Quiz Results">
            {resultsLoading ? (
              <p>Loading your results...</p>
            ) : !userResults || userResults.length === 0 ? (
              <p>You haven't attempted any quizzes yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="p-3 font-medium">Quiz</th>
                      <th className="p-3 font-medium">Marks</th>
                      <th className="p-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userResults.map((r, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-3">{r.quizTitle}</td>
                        <td className="p-3">{r.obtainedMarks} / {r.totalMarks}</td>
                        <td
                          className={`p-3 font-semibold ${
                            r.passingStatus === "PASS" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {r.passingStatus}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>
        </motion.main>

        <QuizModal
          isOpen={isModalOpen}
          quiz={selectedQuiz ?? undefined}
          onClose={() => setIsModalOpen(false)}
          onStart={handleStart}
        />
      </div>
    </div>
  );
}
