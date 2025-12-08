import React from "react";
import { useGetAllQuizzesQuery } from "../../features/quiz/quizApi";
import { Link } from "react-router-dom";

export default function QuizListPage() {
  const { data: quizzes, isLoading } = useGetAllQuizzesQuery();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">All Quizzes</h1>

      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr>
            <th className="p-3">Title</th>
            <th className="p-3">Questions</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {quizzes?.map((q) => (
            <tr key={q.id} className="border-b">
              <td className="p-3">{q.title}</td>
              <td className="p-3">{q.questionsCount}</td>
              <td className="p-3 space-x-3">
                <Link to={`/admin/quiz/${q.id}`} className="text-blue-600">View</Link>
                <Link to={`/admin/quiz/${q.id}/edit`} className="text-green-600">Edit</Link>
                <Link to={`/admin/quiz/${q.id}/questions`} className="text-purple-600">
                  Manage Questions
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
