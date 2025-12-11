export default function QuizStartScreen({ quiz, startQuiz }: { quiz: { title: string; durationMinutes: number }; startQuiz: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">{quiz.title}</h2>
        <p className="mb-4">
          Duration: {quiz.durationMinutes} minute{quiz.durationMinutes > 1 ? "s" : ""}
        </p>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={startQuiz}
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}
