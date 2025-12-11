// src/components/EditQuizModal.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useUpdateQuizMutation } from "../../../features/quiz/quizApi";
import type { Quiz } from "../../../features/quiz/types";

interface EditQuizModalProps {
  quiz: Quiz;
  onClose: () => void;
}

export default function EditQuizModal({ quiz, onClose }: EditQuizModalProps) {
  const [form, setForm] = useState({
    title: quiz.title,
    description: quiz.description,
    duration: quiz.durationMinutes,
  });

  const [updateQuiz, { isLoading }] = useUpdateQuizMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateQuiz({ id: quiz._id!, ...form }).unwrap();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update quiz");
    }
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Quiz</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">Title</label>
            <input
              className="w-full border p-2 rounded mt-1"
              value={form.title}
              onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Description</label>
            <textarea
              className="w-full border p-2 rounded mt-1"
              value={form.description}
              onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Duration (minutes)</label>
            <input
              type="number"
              min={1}
              className="w-36 border p-2 rounded mt-1"
              value={form.duration}
              onChange={(e) => setForm((s) => ({ ...s, duration: Number(e.target.value) }))}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 rounded bg-blue-600 text-white">{isLoading ? "Updating..." : "Update"}</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
