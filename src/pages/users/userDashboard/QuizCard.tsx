import React from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Quiz } from "../../../features/quiz/types";

interface QuizCardProps {
  quiz: Quiz;
  onClick: (quiz: Quiz) => void;
  isHovered?: boolean;
}

export default function QuizCard({ quiz, onClick, isHovered }: QuizCardProps) {
  return (
    <motion.div
      onClick={() => onClick(quiz)}
      className="block bg-white rounded-xl p-5 shadow cursor-pointer"
      animate={{
        scale: isHovered ? 1.05 : 1,
        zIndex: isHovered ? 10 : 1,
        boxShadow: isHovered
          ? "0 20px 30px rgba(0,0,0,0.15)"
          : "0 4px 6px rgba(0,0,0,0.1)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <h3 className="text-lg font-semibold">{quiz.title}</h3>
      <p className="text-sm text-gray-600 mt-1">{quiz.description}</p>

      <div className="flex items-center justify-between mt-4 text-sm">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg">
          {quiz.durationMinutes} min
        </span>
        <span className="text-gray-500">
          {quiz.createdAt
            ? formatDistanceToNow(new Date(quiz.createdAt), { addSuffix: true })
            : "—"}
        </span>
      </div>
    </motion.div>
  );
}
