import React, { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import TopBar from "../../components/TopBar";
import AddQuestion from "../../components/AddQuestion";
import {
  useGetAllQuizzesQuery,
  useDeleteQuizMutation,
  useCreateQuizMutation,
  usePublishedMutation, // <-- import correctly
} from "../../features/quiz/quizApi";
import type { Quiz } from "../../features/quiz/types";
import { formatDistanceToNow } from "date-fns";

function StatsCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const { data: quizzes, isLoading, isFetching } = useGetAllQuizzesQuery();
  const [deleteQuiz] = useDeleteQuizMutation();
  const [createQuiz] = useCreateQuizMutation();
  const [togglePublished] = usePublishedMutation(); // <-- hook called correctly

  const [showCreate, setShowCreate] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState<string | null>(null); // quizId
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: 10,
  });

  const totalQuizzes = quizzes?.length ?? 0;
  const totalUsers = 3;

  console.log("ShowAddQuestion:", showAddQuestion);

  async function handleDelete(id: string) {
    if (!confirm("Delete this quiz? This action is irreversible.")) return;
    try {
      await deleteQuiz(id).unwrap();
      alert("Deleted");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }

  async function handleCreate(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setCreating(true);
    try {
      const payload: Partial<Quiz> = {
        title: form.title || "Untitled Quiz",
        description: form.description,
        durationMinutes: form.duration,
      };
      await createQuiz(payload).unwrap();
      setShowCreate(false);
      setForm({ title: "", description: "", duration: 10 });
    } catch (err) {
      console.error(err);
      alert("Create failed");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />

        <main className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-sm text-gray-500">
                Overview & recent activity
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                + Create Quiz
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <StatsCard label="Total Quizzes" value={totalQuizzes} />
            <StatsCard label="Total Users" value={totalUsers} />
          </div>

          {/* Latest Quizzes table */}
          <div className="bg-white mt-8 rounded-xl shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Latest Quizzes</h2>
              <div className="text-sm text-gray-500">
                {isFetching ? "Refreshing..." : "Up to date"}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3">Title</th>
                    <th className="p-3">Questions</th>
                    <th className="p-3">Duration (min)</th>
                    <th className="p-3">Created</th>
                    <th className="p-3">Published</th> {/* New column */}
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {isLoading ? (
                    <tr>
                      <td className="p-4" colSpan={6}>
                        Loading...
                      </td>
                    </tr>
                  ) : quizzes && quizzes.length ? (
                    quizzes.map((q, index) => {
                      const quizId =
                        (q as Quiz & { _id?: string }).id ??
                        (q as Quiz & { _id?: string })._id;

                      return (
                        <tr
                          key={quizId ?? index}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-3">
                            <div className="font-medium">{q.title}</div>
                            <div className="text-sm text-gray-500">
                              {q.description}
                            </div>
                          </td>
                          <td className="p-3">{q.questionsCount}</td>
                          <td className="p-3">{q.durationMinutes}</td>
                          <td className="p-3">
                            {q.createdAt
                              ? formatDistanceToNow(new Date(q.createdAt), {
                                  addSuffix: true,
                                })
                              : "—"}
                          </td>

                          {/* Published Toggle with just icon */}
                          <td className="p-3">
                            <label className="inline-flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={q.published ?? false}
                                onChange={async (e) => {
                                  if (!quizId) return;
                                  try {
                                    await togglePublished({
                                      id: quizId,
                                      published: e.target.checked,
                                    }).unwrap();
                                  } catch (err) {
                                    console.error(err);
                                    alert("Failed to update published status");
                                  }
                                }}
                                className="form-checkbox h-5 w-5 text-blue-600"
                              />
                            </label>
                          </td>

                          <td className="p-3 space-x-2">
                            {/* <button className="text-blue-600 hover:underline">Edit</button>
                            <button className="text-green-600 hover:underline">View</button> */}
                            <button
                              onClick={() => {
                                if (quizId) setShowAddQuestion(quizId);
                                else console.error("Quiz ID missing", q);
                              }}
                              className="text-purple-600 hover:underline"
                            >
                              Add Question
                            </button>
                            <button
                              onClick={() => handleDelete(quizId)}
                              className="text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td className="p-4" colSpan={6}>
                        No quizzes yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Create Quiz Modal */}
          {showCreate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
              <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Create Quiz</h3>
                  <button
                    onClick={() => setShowCreate(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700">Title</label>
                    <input
                      className="w-full border p-2 rounded mt-1"
                      value={form.title}
                      onChange={(e) =>
                        setForm((s) => ({ ...s, title: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">
                      Description
                    </label>
                    <textarea
                      className="w-full border p-2 rounded mt-1"
                      value={form.description}
                      onChange={(e) =>
                        setForm((s) => ({ ...s, description: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min={1}
                      className="w-36 border p-2 rounded mt-1"
                      value={form.duration}
                      onChange={(e) =>
                        setForm((s) => ({
                          ...s,
                          duration: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowCreate(false)}
                      className="px-4 py-2 rounded border"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creating}
                      className="px-4 py-2 rounded bg-blue-600 text-white"
                    >
                      {creating ? "Creating..." : "Create"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Add Question Modal */}
          {showAddQuestion && (
            <AddQuestion
              quizId={showAddQuestion}
              onClose={() => setShowAddQuestion(null)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
