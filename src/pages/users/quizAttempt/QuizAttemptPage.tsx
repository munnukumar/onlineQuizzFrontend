import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  useFetchQuizQuery,
  useSubmitAttemptMutation,
} from "../../../api/api";

import QuizStartScreen from "./QuizStartScreen";
import QuizQuestionCard from "./QuizQuestionCard";
import SubmitModal from "./SubmitModal";

interface ApiQuestion {
  _id?: string;
  id?: string;
  text: string;
  type: string;
  options?: string[];
  marks?: number;
}

interface Answer {
  questionId: string;
  answer: string;
}

export default function QuizAttemptPage() {
  const { quizId, attemptId } = useParams<{ quizId: string; attemptId: string }>();
  const navigate = useNavigate();

  const { data: quiz, isLoading } = useFetchQuizQuery(quizId!);

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitAttempt] = useSubmitAttemptMutation();
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);

  const startQuiz = () => {
    if (quiz?.durationMinutes) {
      setTimeLeft(quiz.durationMinutes * 60);
      setQuizStarted(true);
    }
  };

  // countdown
  useEffect(() => {
    if (!quizStarted || timeLeft === null) return;

    if (timeLeft <= 0) {
      alert("Time Over! Your quiz attempt has ended.");
      navigate("/user/dashboard");
      return;
    }

    const timer = setInterval(() => setTimeLeft((prev) => prev! - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, quizStarted, navigate]);

  const handleConfirmSubmit = async () => {
    try {
      await submitAttempt({ attemptId: attemptId!, answers }).unwrap();
      navigate("/user/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to submit attempt");
    }
  };

  if (isLoading) return <p>Loading quiz...</p>;
  if (!quiz) return <p>Quiz not found.</p>;

const questions = quiz.questions?.map((q: ApiQuestion) => {
  // Convert and validate type
  const rawType = q.type?.toLowerCase();
  const allowedTypes = ["mcq", "tf", "short"] as const;

  const safeType = (allowedTypes.includes(rawType as typeof allowedTypes[number])
    ? rawType
    : "mcq") as "mcq" | "tf" | "short";

  return {
    _id: q._id ?? q.id ?? "",
    text: q.text,
    type: safeType,     // <-- FIXED TYPE!
    options: q.options,
    marks: q.marks,
  };
}) ?? [];


  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];

  const handleAnswerChange = (value: string) => {
    setAnswers((prev) => {
      const idx = prev.findIndex((a) => a.questionId === currentQuestion._id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx].answer = value;
        return updated;
      }
      return [...prev, { questionId: currentQuestion._id, answer: value }];
    });
  };

  const answeredCount = answers.length;
  const remainingCount = totalQuestions - answeredCount;

  const minutes = timeLeft ? Math.floor(timeLeft / 60) : 0;
  const seconds = timeLeft ? timeLeft % 60 : 0;

  // Start screen
  if (!quizStarted) return <QuizStartScreen quiz={quiz} startQuiz={startQuiz} />;

  // Main quiz UI
  return (
    <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-2">{quiz.title}</h2>

        {/* Timer */}
        <div className="text-right mb-4 font-semibold text-red-600">
          Time Left: {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </div>

        {/* Question */}
        <p className="mb-2 font-semibold">
          Question {currentIndex + 1} of {totalQuestions}
        </p>

        <QuizQuestionCard
          question={currentQuestion}
          answer={answers.find((a) => a.questionId === currentQuestion._id)?.answer}
          onAnswer={handleAnswerChange}
        />

        {/* Navigation */}
        <div className="flex justify-between mt-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(currentIndex - 1)}
          >
            Previous
          </button>

          {currentIndex < totalQuestions - 1 ? (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setCurrentIndex(currentIndex + 1)}
            >
              Next
            </button>
          ) : (
            <button
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={() => setIsSubmitModalOpen(true)}
            >
              Submit
            </button>
          )}
        </div>
      </div>

      {/* Submit Modal */}
      <SubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        answeredCount={answeredCount}
        remainingCount={remainingCount}
        onConfirm={handleConfirmSubmit}
      />
    </div>
  );
}
