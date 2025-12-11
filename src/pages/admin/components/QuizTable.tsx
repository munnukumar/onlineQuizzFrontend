import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import type { Quiz } from "../../../features/quiz/types";

interface QuizTableProps {
  quizzes: Quiz[];
  isLoading: boolean;
  isFetching: boolean;
  onDelete: (id: string) => void;
  onAddQuestion: (id: string) => void;
  onTogglePublished: (id: string, published: boolean) => void;
}

export default function QuizTable({
  quizzes,
  isLoading,
  isFetching,
  onDelete,
  onAddQuestion,
  onTogglePublished,
}: QuizTableProps) {
  return (
    <motion.div
      className="bg-white mt-8 rounded-xl shadow p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Latest Quizzes</h2>
        <div className="text-sm text-gray-500">{isFetching ? "Refreshing..." : "Up to date"}</div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Questions</th>
              <th className="p-3">Duration (min)</th>
              <th className="p-3">Created</th>
              <th className="p-3">Published</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="p-4">Loading...</td></tr>
            ) : quizzes.length ? (
              quizzes.map((q, index) => (
                <motion.tr
                  key={q._id ?? index}
                  className="border-b cursor-pointer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.03, zIndex: 10, backgroundColor: "rgba(59,130,246,0.05)" }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td className="p-3">
                    <div className="font-medium">{q.title}</div>
                    <div className="text-sm text-gray-500">{q.description}</div>
                  </td>
                  <td className="p-3">{q.questionsCount}</td>
                  <td className="p-3">{q.durationMinutes}</td>
                  <td className="p-3">
                    {q.createdAt ? formatDistanceToNow(new Date(q.createdAt), { addSuffix: true }) : "—"}
                  </td>
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={q.published ?? false}
                      onChange={(e) => q._id && onTogglePublished(q._id, e.target.checked)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                  </td>
                  <td className="p-3 space-x-2">
                    <button onClick={() => q._id && onAddQuestion(q._id)} className="text-purple-600 hover:underline">Add Question</button>
                    <button onClick={() => q._id && onDelete(q._id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr><td colSpan={6} className="p-4">No quizzes yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
