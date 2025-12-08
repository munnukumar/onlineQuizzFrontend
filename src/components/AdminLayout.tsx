// AdminLayout.tsx
import React from "react";
import TopBar from "./TopBar"; // Assuming you already have these components
import AdminSidebar from "./AdminSidebar"; // Assuming you already have these components
import { Outlet } from "react-router-dom"; // For rendering child routes

const AdminLayout: React.FC = () => {
  return (
    <div className="admin-layout">
      <TopBar />  {/* Static content, only render this once */}
      <div className="admin-container">
        <AdminSidebar /> {/* Static content, only render this once */}
        <div className="admin-content">
          {/* Render the child routes in the outlet */}
          <Outlet /> 
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
