import React from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../app/reducers/authReducer";

const TopBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  // Dynamic title based on user role
  const title = (() => {
    switch (user?.role) {
      case "admin":
        return "Admin Dashboard";
      case "user":
        return "User Dashboard";
      default:
        return "Dashboard";
    }
  })();

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
      {/* Left: Hamburger + Title */}
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none">
          ☰
        </button>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      {/* Right: User info + Logout */}
      <div className="flex items-center gap-4">
        {user && (
          <div className="text-sm text-gray-600 text-right">
            <div>{user.email}</div>
            <div className="text-xs text-gray-400">{user.role?.toUpperCase()}</div>
          </div>
        )}
        <button
          onClick={() => dispatch(logout())}
          className="px-3 py-1 rounded-md border hover:bg-gray-100 focus:outline-none"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default TopBar;
