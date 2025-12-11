export default function QuizQuestionCard({
  question,
  answer,
  onAnswer,
}: {
  question: {
    _id: string;
    text: string;
    type: "mcq" | "tf" | "short";
    options?: string[];
    marks?: number;
  };
  answer?: string;   // <-- allow undefined
  onAnswer: (ans: string) => void;
}) {
  return (
    <>
      <p className="mb-2">{question.text}</p>

      {question.options?.map((opt: string, i: number) => (
        <label key={i} className="block mb-1">
          <input
            type="radio"
            name={question._id}
            value={opt}
            checked={answer === opt}
            onChange={() => onAnswer(opt)}
            className="mr-2"
          />
          {opt}
        </label>
      ))}
    </>
  );
}
