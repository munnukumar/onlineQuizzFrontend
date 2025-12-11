// import React, { useState, Fragment } from "react";
// import { useNavigate } from "react-router-dom";
// import { Dialog, Transition } from "@headlessui/react";
// import { formatDistanceToNow } from "date-fns";
// import { motion } from "framer-motion";

// import TopBar from "../../components/TopBar";
// import {
//   usePublishedQuizzesListQuery,
//   useStartAttemptMutation,
//   useUserQuizResultsQuery,
// } from "../../api/api";
// import type { Quiz } from "../../features/quiz/types";

// // -------------------------
// // Quiz Card Component
// // -------------------------
// interface QuizCardProps {
//   quiz: Quiz;
//   onClick: (quiz: Quiz) => void;
//   isHovered?: boolean;
// }

// const QuizCard: React.FC<QuizCardProps> = ({ quiz, onClick, isHovered }) => (
//   <motion.div
//     onClick={() => onClick(quiz)}
//     className="block bg-white rounded-xl p-5 shadow cursor-pointer"
//     animate={{
//       scale: isHovered ? 1.05 : 1,
//       zIndex: isHovered ? 10 : 1,
//       boxShadow: isHovered
//         ? "0 20px 30px rgba(0,0,0,0.15)"
//         : "0 4px 6px rgba(0,0,0,0.1)",
//     }}
//     transition={{ type: "spring", stiffness: 300, damping: 20 }}
//   >
//     <h3 className="text-lg font-semibold">{quiz.title}</h3>
//     <p className="text-sm text-gray-600 mt-1">{quiz.description}</p>

//     <div className="flex items-center justify-between mt-4 text-sm">
//       <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg">
//         {quiz.durationMinutes} min
//       </span>
//       <span className="text-gray-500">
//         {quiz.createdAt
//           ? formatDistanceToNow(new Date(quiz.createdAt), { addSuffix: true })
//           : "—"}
//       </span>
//     </div>
//   </motion.div>
// );

// // -------------------------
// // Quiz Modal Component (unchanged)
// // -------------------------
// interface QuizModalProps {
//   isOpen: boolean;
//   quiz?: Quiz;
//   onClose: () => void;
//   onStart: (quizId: string) => void;
// }

// const QuizModal: React.FC<QuizModalProps> = ({ isOpen, quiz, onClose, onStart }) => {
//   if (!quiz) return null;

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
//               enter="ease-out duration-500"
//               enterFrom="opacity-0 scale-90"
//               enterTo="opacity-100 scale-100"
//               leave="ease-in duration-300"
//               leaveFrom="opacity-100 scale-100"
//               leaveTo="opacity-0 scale-90"
//             >
//               <Dialog.Panel className="w-full max-w-md p-6 bg-white rounded-xl shadow-xl text-left">
//                 <Dialog.Title className="text-lg font-bold">{quiz.title}</Dialog.Title>

//                 <div className="mt-4 space-y-2">
//                   <p>Number of questions: {quiz.questionsCount}</p>
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
//                     Start Quiz
//                   </button>
//                 </div>
//               </Dialog.Panel>
//             </Transition.Child>
//           </div>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// };

// // -------------------------
// // User Dashboard Component
// // -------------------------
// export default function UserDashboard() {
//   const navigate = useNavigate();

//   const { data: quizzesData, isLoading, isFetching } = usePublishedQuizzesListQuery();
//   const quizzes = quizzesData ?? [];
//   const { data: userResults, isLoading: resultsLoading } = useUserQuizResultsQuery();

//   const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [hoveredStat, setHoveredStat] = useState<string | null>(null);
//   const [hoveredQuizId, setHoveredQuizId] = useState<string | null>(null);

//   const [startAttempt] = useStartAttemptMutation();

//   const handleQuizClick = (quiz: Quiz) => {
//     setSelectedQuiz(quiz);
//     setIsModalOpen(true);
//   };

//   const handleStart = async (quizId: string) => {
//     try {
//       setIsModalOpen(false);
//       const result = await startAttempt(quizId).unwrap();
//       navigate(`/quiz/${quizId}/attempt/${result._id}`);
//     } catch (error) {
//       console.error("Failed to start attempt:", error);
//       alert("Unable to start quiz attempt.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex bg-gray-100">
//       <div className="flex-1 flex flex-col">
//         <TopBar />

//         {/* Animated Welcome */}
//         <motion.div
//           className="text-2xl font-bold text-gray-700 mb-4 ml-6 mt-4"
//           initial={{ x: 200, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 0.8 }}
//         >
//           Welcome Back, {userResults?.[0]?.userName ?? "User"}!
//         </motion.div>

//         <motion.main
//           className="p-6 space-y-6"
//           initial={{ opacity: 0, x: -50 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           {/* Header */}
//           <div className="flex items-center justify-between">
//             <div>
//               {/* <h1 className="text-2xl font-bold">Dashboard</h1> */}
//               <p className="text-sm text-gray-500">Your quizzes & results</p>
//             </div>
//             <div className="text-sm text-gray-600">{isFetching ? "Refreshing..." : "Latest"}</div>
//           </div>

//           {/* STATS with hover effect */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {[
//               { label: "Available Quizzes", value: quizzes.length, key: "available" },
//               { label: "Quizzes Attempted", value: userResults?.length ?? 0, key: "attempted" },
//             ].map((stat) => (
//               <div
//                 key={stat.key}
//                 onMouseEnter={() => setHoveredStat(stat.key)}
//                 onMouseLeave={() => setHoveredStat(null)}
//               >
//                 <motion.div
//                   className="bg-white rounded-xl p-5 shadow-sm"
//                   animate={{
//                     scale: hoveredStat === stat.key ? 1.05 : 1,
//                     zIndex: hoveredStat === stat.key ? 10 : 1,
//                     boxShadow:
//                       hoveredStat === stat.key
//                         ? "0 20px 30px rgba(0,0,0,0.15)"
//                         : "0 4px 6px rgba(0,0,0,0.1)",
//                   }}
//                   transition={{ type: "spring", stiffness: 300, damping: 20 }}
//                 >
//                   <p className="text-sm text-gray-500">{stat.label}</p>
//                   <div className="mt-2 text-2xl font-bold">{stat.value}</div>
//                 </motion.div>
//               </div>
//             ))}
//           </div>

//           {/* PUBLISHED QUIZZES */}
//           <Section title="Published Quizzes">
//             {isLoading ? (
//               <p>Loading...</p>
//             ) : quizzes.length === 0 ? (
//               <p>No published quizzes yet.</p>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//                 {quizzes.map((quiz) => (
//                   <div
//                     key={quiz._id}
//                     onMouseEnter={() => setHoveredQuizId(quiz._id)}
//                     onMouseLeave={() => setHoveredQuizId(null)}
//                   >
//                     <QuizCard
//                       quiz={quiz}
//                       onClick={handleQuizClick}
//                       isHovered={hoveredQuizId === quiz._id}
//                     />
//                   </div>
//                 ))}
//               </div>
//             )}
//           </Section>

//           {/* USER RESULTS */}
//           <Section title="Your Quiz Results">
//             {resultsLoading ? (
//               <p>Loading your results...</p>
//             ) : !userResults || userResults.length === 0 ? (
//               <p>You haven't attempted any quizzes yet.</p>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse text-left">
//                   <thead>
//                     <tr className="border-b bg-gray-50">
//                       <th className="p-3 font-medium">Quiz</th>
//                       <th className="p-3 font-medium">Marks</th>
//                       <th className="p-3 font-medium">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {userResults.map((r, i) => (
//                       <tr key={i} className="border-b">
//                         <td className="p-3">{r.quizTitle}</td>
//                         <td className="p-3">{r.obtainedMarks} / {r.totalMarks}</td>
//                         <td className={`p-3 font-semibold ${r.passingStatus === "PASS" ? "text-green-600" : "text-red-600"}`}>
//                           {r.passingStatus}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </Section>
//         </motion.main>

//         <QuizModal
//           isOpen={isModalOpen}
//           quiz={selectedQuiz ?? undefined}
//           onClose={() => setIsModalOpen(false)}
//           onStart={handleStart}
//         />
//       </div>
//     </div>
//   );
// }

// // -------------------------
// // Reusable Components
// // -------------------------
// interface SectionProps {
//   title: string;
//   children: React.ReactNode;
// }

// const Section: React.FC<SectionProps> = ({ title, children }) => (
//   <div className="bg-white rounded-xl shadow p-4">
//     <h2 className="text-lg font-semibold mb-4">{title}</h2>
//     {children}
//   </div>
// );
