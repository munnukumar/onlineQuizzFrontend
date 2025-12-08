import React from "react";
import { useParams, Link } from "react-router-dom";
import { useGetQuizQuery } from "../../features/quiz/quizApi";

export default function ManageQuestionsPage() {
  const { quizId } = useParams();
  const { data: quiz, isLoading } = useGetQuizQuery(quizId!);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Manage Questions</h1>

      <Link
        to={`/admin/quiz/${quizId}/questions/add`}
        className="inline-block my-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        + Add Question
      </Link>

      <ul className="space-y-3">
        {quiz?.questions?.map((q) => (
          <li key={q.id} className="p-3 bg-white rounded shadow">
            <div className="font-semibold">{q.text}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
