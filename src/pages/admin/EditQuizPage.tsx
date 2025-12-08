import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetQuizQuery,
  usePublishedMutation,
  useCreateQuizMutation,
} from "../../features/quiz/quizApi";

export default function EditQuizPage() {
  const { quizId } = useParams();
  const { data: quiz, isLoading } = useGetQuizQuery(quizId!);
  const [updateQuiz] = useCreateQuizMutation();
  const [togglePublished] = usePublishedMutation();

  const [form, setForm] = useState({
    title: "",
    description: "",
    durationMinutes: 10,
  });

  React.useEffect(() => {
    if (quiz) {
      setForm({
        title: quiz.title,
        description: quiz.description as string,
        durationMinutes: quiz.durationMinutes,
      });
    }
  }, [quiz]);

  if (isLoading) return <p>Loading...</p>;

  async function handleSave() {
    await updateQuiz({ id: quizId!, ...form });
    alert("Saved!");
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Edit Quiz</h1>

      <div className="space-y-4 mt-4">
        <input
          className="border p-2 rounded w-full"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          className="border p-2 rounded w-full"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="number"
          className="border p-2 rounded w-32"
          value={form.durationMinutes}
          onChange={(e) =>
            setForm({ ...form, durationMinutes: Number(e.target.value) })
          }
        />

        {/* Published Toggle */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={quiz?.published ?? false}
            onChange={(e) =>
              togglePublished({ id: quizId!, published: e.target.checked })
            }
          />
          Published
        </label>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
}
