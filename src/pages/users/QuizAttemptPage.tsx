import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetchQuizQuery, useSubmitAttemptMutation } from "../../api/api";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface Question {
  _id: string;
  text: string;
  type: "mcq" | "tf" | "short";
  options?: string[];
  marks?: number;
}

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

  // ---------- TIMER STATE ----------
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);

  const startQuiz = () => {
    if (quiz?.durationMinutes) {
      setTimeLeft(quiz.durationMinutes * 60); // set initial time
      setQuizStarted(true);
    }
  };

  // ---------- COUNTDOWN EFFECT ----------
  useEffect(() => {
    if (!quizStarted || timeLeft === null) return;

    if (timeLeft <= 0) {
      alert("Time Over! Your quiz attempt has ended.");
      navigate("/user/dashboard");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, quizStarted, navigate]);

  // ---------- CONFIRM SUBMIT ----------
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

  const questions: Question[] =
    quiz.questions?.map((q: ApiQuestion) => ({
      _id: q._id ?? q.id ?? "",
      text: q.text,
      type: q.type.toLowerCase() as "mcq" | "tf" | "short",
      options: q.options,
      marks: q.marks,
    })) ?? [];

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];

  const handleAnswerChange = (value: string) => {
    setAnswers((prev) => {
      const idx = prev.findIndex((a) => a.questionId === currentQuestion._id);
      if (idx !== -1) {
        const newArr = [...prev];
        newArr[idx].answer = value;
        return newArr;
      }
      return [...prev, { questionId: currentQuestion._id, answer: value }];
    });
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleSubmit = () => setIsSubmitModalOpen(true);

  const answeredCount = answers.length;
  const remainingCount = totalQuestions - answeredCount;

  // Format time as MM:SS
  const minutes = timeLeft !== null ? Math.floor(timeLeft / 60) : 0;
  const seconds = timeLeft !== null ? timeLeft % 60 : 0;

  // ---------- RENDER ----------
  if (!quizStarted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">{quiz.title}</h2>
          <p className="mb-4">
            Duration: {quiz.durationMinutes} minute{quiz.durationMinutes > 1 ? "s" : ""}
          </p>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={startQuiz}
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-2">{quiz.title}</h2>

        {/* ---------- TIMER DISPLAY ---------- */}
        <div className="text-right mb-4 font-semibold text-red-600">
          Time Left: {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </div>

        <div className="mb-4">
          <p className="mb-2 font-semibold">
            Question {currentIndex + 1} of {totalQuestions}
          </p>
          <p className="mb-2">{currentQuestion.text}</p>

          {currentQuestion.options?.map((opt, i) => (
            <label key={i} className="block mb-1">
              <input
                type="radio"
                name={currentQuestion._id}
                value={opt}
                checked={answers.find((a) => a.questionId === currentQuestion._id)?.answer === opt}
                onChange={() => handleAnswerChange(opt)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>

        <div className="flex justify-between mt-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            Previous
          </button>

          {currentIndex < totalQuestions - 1 ? (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleNext}
            >
              Next
            </button>
          ) : (
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={handleSubmit}
            >
              Submit
            </button>
          )}
        </div>
      </div>

      {/* ---------- MODAL ---------- */}
      <Transition appear show={isSubmitModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsSubmitModalOpen(false)}
        >
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
                  <Dialog.Title className="text-lg font-bold">
                    Confirm Submission
                  </Dialog.Title>
                  <div className="mt-4">
                    <p>Total attempted questions: {answeredCount}</p>
                    <p>Remaining questions: {remainingCount}</p>
                  </div>

                  <div className="mt-6 flex justify-end gap-4">
                    <button
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={() => setIsSubmitModalOpen(false)}
                    >
                      Re-attempt
                    </button>
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      onClick={handleConfirmSubmit}
                    >
                      Confirm Submit
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
