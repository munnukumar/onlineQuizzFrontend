import { motion } from "framer-motion";

interface QuizForm {
  title: string;
  description: string;
  duration: number;
}

interface CreateQuizModalProps {
  form: QuizForm;
  setForm: React.Dispatch<React.SetStateAction<QuizForm>>;
  onClose: () => void;
  onCreate: (e?: React.FormEvent) => void;
  creating: boolean;
}

export default function CreateQuizModal({ form, setForm, onClose, onCreate, creating }: CreateQuizModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Create Quiz</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <form onSubmit={onCreate} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">Title</label>
            <input
              className="w-full border p-2 rounded mt-1"
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Description</label>
            <textarea
              className="w-full border p-2 rounded mt-1"
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Duration (minutes)</label>
            <input
              type="number"
              min={1}
              className="w-36 border p-2 rounded mt-1"
              value={form.duration}
              onChange={(e) => setForm(prev => ({ ...prev, duration: Number(e.target.value) }))}
            />
          </div>

          <div className="flex items-center gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
            <button type="submit" disabled={creating} className="px-4 py-2 rounded bg-blue-600 text-white">
              {creating ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
