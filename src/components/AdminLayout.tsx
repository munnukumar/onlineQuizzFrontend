// AdminLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import AdminSidebar from "./AdminSidebar";

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* TopBar is static, renders once */}
      <TopBar />

      <div className="flex flex-1">
        {/* Sidebar is static, renders once */}
        <AdminSidebar />

        {/* Main content area */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
