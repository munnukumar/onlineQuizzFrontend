// src/components/EditQuestionModal.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useUpdateQuestionMutation } from "../../../features/quiz/quizApi";
import type { Question } from "../../../features/quiz/types";

interface EditQuestionModalProps {
  question: Question;
  quizId: string;
  onClose: () => void;
}

export default function EditQuestionModal({ question, quizId, onClose }: EditQuestionModalProps) {
  const [questionText, setQuestionText] = useState(question.text);
  const [questionType, setQuestionType] = useState<"mcq" | "tf" | "short">(question.type);
  const [options, setOptions] = useState<string[]>(question.options || ["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(question.correctAnswer || "");
  const [marks, setMarks] = useState(question.marks || 1);

  const [updateQuestion, { isLoading }] = useUpdateQuestionMutation();

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const questionOptions =
      questionType === "mcq" ? options : questionType === "tf" ? ["True", "False"] : [];

    try {
      await updateQuestion({
        id: question._id!,
        quizId,
        question: {
          text: questionText,
          type: questionType,
          options: questionOptions,
          correctAnswer,
          marks,
        },
      }).unwrap();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update question");
    }
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Question</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">Question Text</label>
            <textarea
              className="w-full border p-2 rounded mt-1"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Type</label>
            <select
              className="w-36 border p-2 rounded mt-1"
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value as "mcq" | "tf" | "short")}
            >
              <option value="mcq">MCQ</option>
              <option value="tf">True/False</option>
              <option value="short">Short Answer</option>
            </select>
          </div>

          {questionType === "mcq" && (
            <div>
              <label className="block text-sm text-gray-700">Options</label>
              {options.map((opt, idx) => (
                <input
                  key={idx}
                  className="w-full border p-2 rounded mt-1 mb-1"
                  value={opt}
                  placeholder={`Option ${idx + 1}`}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  required
                />
              ))}
              <div className="mt-2">
                <label className="block text-sm text-gray-700">Correct Answer</label>
                <select
                  className="w-36 border p-2 rounded mt-1"
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  required
                >
                  <option value="">Select correct option</option>
                  {options.map((opt, idx) => (
                    <option key={idx} value={opt}>{opt || `Option ${idx + 1}`}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {questionType === "tf" && (
            <div>
              <label className="block text-sm text-gray-700">Correct Answer</label>
              <div className="flex gap-4 mt-1">
                {["True", "False"].map((opt) => (
                  <label key={opt} className="flex items-center gap-1">
                    <input
                      type="radio"
                      value={opt}
                      checked={correctAnswer === opt}
                      onChange={(e) => setCorrectAnswer(e.target.value)}
                      required
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          )}

          {questionType === "short" && (
            <div>
              <label className="block text-sm text-gray-700">Answer</label>
              <input
                type="text"
                className="w-full border p-2 rounded mt-1"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-700">Marks</label>
            <input
              type="number"
              min={1}
              className="w-24 border p-2 rounded mt-1"
              value={marks}
              onChange={(e) => setMarks(Number(e.target.value))}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 rounded bg-blue-600 text-white">
              {isLoading ? "Updating..." : "Update Question"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
