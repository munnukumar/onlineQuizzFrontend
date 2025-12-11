// src/pages/admin/hooks/useAdminDashboard.ts
import { useState } from "react";
import { useGetAllQuizzesQuery, useDeleteQuizMutation, useCreateQuizMutation, usePublishedMutation } from "../../../features/quiz/quizApi";
// import type { Quiz } from "../../features/quiz/types";
import {
  useGetAllUsersQuery,
} from "../../../features/adminUsers/usersApi";

export function useAdminDashboard() {
  const { data: quizzes, isLoading, isFetching } = useGetAllQuizzesQuery();
  const [deleteQuiz] = useDeleteQuizMutation();
  const [createQuiz] = useCreateQuizMutation();
  const [togglePublished] = usePublishedMutation();

  const [showCreate, setShowCreate] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", duration: 10 });
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
     const { data: users} = useGetAllUsersQuery();
  // Dashboard stats
  const totalQuizzes = quizzes?.length ?? 0;
  const totalUsers = users?.total;

  // Handlers
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this quiz? This action is irreversible.")) return;
    try {
      await deleteQuiz(id).unwrap();
      alert("Deleted");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const handleCreate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCreating(true);
    try {
      await createQuiz({
        title: form.title || "Untitled Quiz",
        description: form.description,
        durationMinutes: form.duration,
      }).unwrap();
      setShowCreate(false);
      setForm({ title: "", description: "", duration: 10 });
    } catch (err) {
      console.error(err);
      alert("Create failed");
    } finally {
      setCreating(false);
    }
  };

  const handleTogglePublished = async (id: string, published: boolean) => {
    try {
      await togglePublished({ id, published }).unwrap();
    } catch (err) {
      console.error(err);
      alert("Failed to update published status");
    }
  };

  return {
    quizzes,
    isLoading,
    isFetching,
    showCreate,
    setShowCreate,
    showAddQuestion,
    setShowAddQuestion,
    creating,
    form,
    setForm,
    hoveredCard,
    setHoveredCard,
    totalQuizzes,
    totalUsers,
    handleDelete,
    handleCreate,
    handleTogglePublished,
  };
}
