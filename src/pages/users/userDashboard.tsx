import React, { useState } from "react";
import TopBar from "../../components/TopBar";
import { usePublishedQuizzesListQuery, useStartAttemptMutation } from "../../api/api";
import type { Quiz } from "../../features/quiz/types";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

// Quiz Card Component
function QuizCard({ quiz, onClick }: { quiz: Quiz; onClick: (quiz: Quiz) => void }) {
  return (
    <div
      onClick={() => onClick(quiz)}
      className="block bg-white rounded-xl p-5 shadow hover:shadow-md transition cursor-pointer"
    >
      <h3 className="text-lg font-semibold">{quiz.title}</h3>
      <p className="text-sm text-gray-600 mt-1">{quiz.description}</p>

      <div className="flex items-center justify-between mt-4 text-sm">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg">
          {quiz.durationMinutes} min
        </span>
        <span className="text-gray-500">
          {quiz.createdAt
            ? formatDistanceToNow(new Date(quiz.createdAt), { addSuffix: true })
            : "—"}
        </span>
      </div>
    </div>
  );
}

// Quiz Modal Component
function QuizModal({
  isOpen,
  quiz,
  onClose,
  onStart,
}: {
  isOpen: boolean;
  quiz?: Quiz;
  onClose: () => void;
  onStart: (quizId: string) => void;
}) {
  if (!quiz) return null;

  const numQuestions = quiz.questionsCount;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md p-6 bg-white rounded-xl shadow-xl text-left">
                <Dialog.Title className="text-lg font-bold">{quiz.title}</Dialog.Title>

                <div className="mt-4">
                  <p>Number of questions: {numQuestions}</p>
                  <p>Duration: {quiz.durationMinutes} minutes</p>
                </div>

                <div className="mt-6 flex justify-end gap-4">
                  <button
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={onClose}
                  >
                    Cancel
                  </button>

                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => onStart(quiz._id)}
                  >
                    Start Quiz
                  </button>
                </div>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

// User Dashboard Component
export default function UserDashboard() {
  const { data, isLoading, isFetching } = usePublishedQuizzesListQuery(undefined);
  const quizzes = data ?? [];

  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  // Mutation to start an attempt
  const [startAttempt] = useStartAttemptMutation();

  const handleQuizClick = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setIsModalOpen(true);
  };

  // Updated: navigate with quizId + attemptId
  const handleStart = async (quizId: string) => {
    try {
      setIsModalOpen(false);

      // Mutation expects string input, not object
      const result = await startAttempt(quizId).unwrap();

      // Backend returns `_id`
      const attemptId = result._id;

      // Navigate using BOTH IDs
      navigate(`/quiz/${quizId}/attempt/${attemptId}`);

    } catch (error) {
      console.error("Failed to start attempt:", error);
      alert("Unable to start quiz attempt.");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="flex-1 flex flex-col">
        <TopBar />

        <main className="p-6">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-sm text-gray-500">Available published quizzes</p>
            </div>

            <div className="text-sm text-gray-600">
              {isFetching ? "Refreshing..." : "Latest"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <p className="text-sm text-gray-500">Available Quizzes</p>
              <div className="mt-2 text-2xl font-bold">{quizzes.length}</div>
            </div>
          </div>

          <div className="bg-white mt-8 rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Published Quizzes</h2>

            {isLoading ? (
              <p>Loading...</p>
            ) : quizzes.length === 0 ? (
              <p>No published quizzes yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {quizzes.map((q: Quiz) => (
                  <QuizCard key={q._id} quiz={q} onClick={handleQuizClick} />
                ))}
              </div>
            )}
          </div>
        </main>

        {/* QUIZ MODAL */}
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
