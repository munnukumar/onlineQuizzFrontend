// src/components/AddQuestion.tsx
import React, { useState } from "react";
import type { Question } from "../features/quiz/types";
import { useAddQuestionMutation } from "../features/quiz/quizApi";

interface AddQuestionProps {
  quizId: string;
  onClose: () => void;
}

const AddQuestion: React.FC<AddQuestionProps> = ({ quizId, onClose }) => {
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState<"mcq" | "tf" | "short">("mcq");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [marks, setMarks] = useState(1);

  const [addQuestion, { isLoading }] = useAddQuestionMutation();

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const payload = {
      quizId,
      question: {
        text: questionText,
        type: questionType,
        options: questionType === "mcq" ? options : [],
        correctAnswer,
        marks,
      } as Partial<Question>,
    };
    console.log("Submitting question", payload);
await addQuestion(payload).unwrap();
console.log("Question added");

    onClose();
  } catch (err) {
    console.error(err);
    alert("Failed to add question");
  }
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Add Question</h3>
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
              {options.map((opt, i) => (
                <input
                  key={i}
                  className="w-full border p-2 rounded mt-1 mb-1"
                  value={opt}
                  placeholder={`Option ${i + 1}`}
                  onChange={(e) => handleOptionChange(i, e.target.value)}
                  required
                />
              ))}
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-700">Correct Answer</label>
            <input
              className="w-full border p-2 rounded mt-1"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              required
            />
          </div>

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

export default AddQuestion;
