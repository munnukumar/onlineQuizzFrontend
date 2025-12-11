// src/components/AddQuestion.tsx
import React, { useState } from "react";
import type { Question } from "../../../features/quiz/types";
import { useAddQuestionMutation } from "../../../features/quiz/quizApi";

interface AddQuestionProps {
  quizId: string;
  onClose: () => void;
}

const AddQuestion: React.FC<AddQuestionProps> = ({ quizId, onClose }) => {
  const [questionText, setQuestionText] = useState<string>("");
  const [questionType, setQuestionType] = useState<"mcq" | "tf" | "short">("mcq");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  const [marks, setMarks] = useState<number>(1);

  const [addQuestion, { isLoading }] = useAddQuestionMutation();

  // Update individual MCQ options
  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  // Submit question
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare options depending on type
    const questionOptions =
      questionType === "mcq"
        ? options
        : questionType === "tf"
        ? ["True", "False"]
        : []; // short answer has no options

    const payload = {
      quizId,
      question: {
        text: questionText,
        type: questionType,
        options: questionOptions,
        correctAnswer,
        marks,
      } as Partial<Question>,
    };

    try {
      await addQuestion(payload).unwrap();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to add question");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Add Question</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Question Text */}
          <div>
            <label className="block text-sm text-gray-700">Question Text</label>
            <textarea
              className="w-full border p-2 rounded mt-1"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              required
            />
          </div>

          {/* Question Type */}
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

          {/* MCQ Options */}
          {questionType === "mcq" && (
            <div>
              <label className="block text-sm text-gray-700">Options</label>
              {options.map((opt, idx) => (
                <OptionInput key={idx} index={idx} value={opt} onChange={handleOptionChange} />
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

          {/* True/False Options */}
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

          {/* Short Answer */}
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

          {/* Marks */}
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

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 rounded bg-blue-600 text-white">
              {isLoading ? "Adding..." : "Add Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------
// Reusable MCQ Option Input
// -------------------------
interface OptionInputProps {
  index: number;
  value: string;
  onChange: (index: number, value: string) => void;
}

const OptionInput: React.FC<OptionInputProps> = ({ index, value, onChange }) => (
  <input
    className="w-full border p-2 rounded mt-1 mb-1"
    value={value}
    placeholder={`Option ${index + 1}`}
    onChange={(e) => onChange(index, e.target.value)}
    required
  />
);

export default AddQuestion;
