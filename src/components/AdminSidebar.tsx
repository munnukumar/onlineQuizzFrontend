import { Link, useLocation } from "react-router-dom";
import React from "react";

const NavItem: React.FC<{ to: string; label: string }> = ({ to, label }) => {
  const loc = useLocation();
  const active = loc.pathname.startsWith(to);
  return (
    <Link
      to={to}
      className={`block px-3 py-2 rounded-lg transition-colors ${
        active ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {label}
    </Link>
  );
};

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-white border-r hidden md:block">
      <div className="px-6 py-8">
        <div className="text-2xl font-bold text-primary">QuizLab Admin</div>
        <p className="text-sm text-gray-500 mt-1">Manage quizzes & users</p>
      </div>

      <nav className="px-4 py-6 space-y-2">
        <NavItem to="/admin" label="Dashboard" />
        <NavItem to="/admin/quizzes" label="Manage Quizzes" />
        <NavItem to="/admin/users" label="Users" />
        <NavItem to="/leaderboard" label="Leaderboard" />
       
      </nav>
    </aside>
  );
}
