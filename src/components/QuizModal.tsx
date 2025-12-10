// import { Dialog, Transition } from "@headlessui/react";
// import { Fragment } from "react";
// import { Quiz } from "../features/quiz/types";

// interface QuizModalProps {
//   isOpen: boolean;
//   quiz?: Quiz;
//   onClose: () => void;
//   onStart: (quizId: string) => void;
// }

// export default function QuizModal({ isOpen, quiz, onClose, onStart }: QuizModalProps) {
//   if (!quiz) return null;

//   console.log("Quiz in Modal: ", quiz);

//   return (
//     <Transition appear show={isOpen} as={Fragment}>
//       <Dialog as="div" className="relative z-50" onClose={onClose}>
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-black bg-opacity-25" />
//         </Transition.Child>

//         <div className="fixed inset-0 overflow-y-auto">
//           <div className="flex items-center justify-center min-h-full p-4 text-center">
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0 scale-95"
//               enterTo="opacity-100 scale-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100 scale-100"
//               leaveTo="opacity-0 scale-95"
//             >
//               <Dialog.Panel className="w-full max-w-md p-6 bg-white rounded-xl shadow-xl text-left">
//                 <Dialog.Title className="text-lg font-bold">
//                   {quiz.title}
//                 </Dialog.Title>
//                 <div className="mt-4">
//                   <p>Number of question: {quiz.questions?.length || 1}</p>
//                   <p>
//                     Total marks:{" "}
//                     {quiz.questions
//                       ? quiz.questions.reduce((sum, q) => sum + (q.marks || 1), 0)
//                       : 0}
//                   </p>
//                   <p>Duration: {quiz.durationMinutes} minutes</p>
//                 </div>

//                 <div className="mt-6 flex justify-end gap-4">
//                   <button
//                     className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
//                     onClick={onClose}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                     onClick={() => onStart(quiz._id)}
//                   >
//                     Start
//                   </button>
//                 </div>
//               </Dialog.Panel>
//             </Transition.Child>
//           </div>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// }
