import React from "react";
import { Link, useLocation } from "react-router-dom";

// -------------------------
// NavItem Component
// -------------------------
interface NavItemProps {
  to: string;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={`block px-3 py-2 rounded-lg transition-colors ${
        isActive
          ? "bg-blue-50 text-blue-600 font-medium"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {label}
    </Link>
  );
};

// -------------------------
// AdminSidebar Component
// -------------------------
const AdminSidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white border-r hidden md:flex flex-col">
      {/* HEADER */}
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold text-primary">QuizLab Admin</h1>
        <p className="text-sm text-gray-500 mt-1">Manage quizzes & users</p>
      </div>

      {/* NAVIGATION */}
      <nav className="px-4 py-6 flex-1 flex flex-col space-y-2">
        <NavItem to="/admin" label="Dashboard" />
        <NavItem to="/admin/quizzes" label="Manage Quizzes" />
        <NavItem to="/admin/users" label="Users" />
        <NavItem to="/leaderboard" label="Leaderboard" />
      </nav>
    </aside>
  );
};

export default AdminSidebar;
