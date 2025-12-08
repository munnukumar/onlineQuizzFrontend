import React from "react";
import { useParams, Link } from "react-router-dom";
import { useGetQuizQuery } from "../../features/quiz/quizApi";

export default function QuizDetailsPage() {
  const { quizId } = useParams();
  const { data: quiz, isLoading } = useGetQuizQuery(quizId!);

  if (isLoading) return <p>Loading...</p>;
  if (!quiz) return <p>Quiz not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">{quiz.title}</h1>
      <p className="text-gray-600">{quiz.description}</p>

      <div className="mt-4 space-x-4">
        <Link to={`/admin/quiz/${quizId}/edit`} className="text-blue-600">
          Edit Quiz
        </Link>

        <Link to={`/admin/quiz/${quizId}/questions`} className="text-purple-600">
          Manage Questions
        </Link>
      </div>
    </div>
  );
}
