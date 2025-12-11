import React from "react";
import { motion } from "framer-motion";
import AdminSidebar from "../../components/AdminSidebar";
import TopBar from "../../components/TopBar";
import AddQuestion from "./components/AddQuestion";
import StatsCard from "./components/StatsCard";
import QuizTable from "./components/QuizTable";
import CreateQuizModal from "./components/CreateQuizModal";
import { useAdminDashboard } from "./hooks/useAdminDashboard";

export default function AdminDashboard() {
  const {
    quizzes,
    isLoading,
    isFetching,
    showCreate,
    setShowCreate,
    showAddQuestion,
    setShowAddQuestion,
    creating,
    form,
    setForm,
    hoveredCard,
    setHoveredCard,
    totalQuizzes,
    totalUsers,
    handleDelete,
    handleCreate,
    handleTogglePublished,
  } = useAdminDashboard();

  console.log("total Users : ", totalUsers)

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />

        <motion.div className="text-2xl font-bold text-gray-700 mb-4 ml-6 mt-4" initial={{ x: 200, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
          Welcome Back, Admin!
        </motion.div>

        <motion.main className="p-6" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-sm text-gray-500">Overview & recent activity</p>
            </div>
            <motion.button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              + Create Quiz
            </motion.button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div onMouseEnter={() => setHoveredCard("quizzes")} onMouseLeave={() => setHoveredCard(null)}>
              <StatsCard label="Total Quizzes" value={totalQuizzes ?? 0} isHovered={hoveredCard === "quizzes"} />
            </div>
            <div onMouseEnter={() => setHoveredCard("users")} onMouseLeave={() => setHoveredCard(null)}>
              <StatsCard label="Total Users" value={totalUsers ?? 0} isHovered={hoveredCard === "users"} />
            </div>
          </div>

          <QuizTable quizzes={quizzes ?? []} isLoading={isLoading} isFetching={isFetching} onDelete={handleDelete} onAddQuestion={(id) => setShowAddQuestion(id)} onTogglePublished={handleTogglePublished} />

          {showCreate && <CreateQuizModal form={form} setForm={setForm} onClose={() => setShowCreate(false)} onCreate={handleCreate} creating={creating} />}
          {showAddQuestion && <AddQuestion quizId={showAddQuestion} onClose={() => setShowAddQuestion(null)} />}
        </motion.main>
      </div>
    </div>
  );
}
