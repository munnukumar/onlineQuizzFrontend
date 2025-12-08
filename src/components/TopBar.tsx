import React from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../app/reducers/authReducer";

export default function TopBar() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 rounded-md hover:bg-gray-100">☰</button>
        <h2 className="text-lg font-semibold">Admin Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">
          <div>{user?.email}</div>
          <div className="text-xs text-gray-400">{user?.role?.toUpperCase()}</div>
        </div>

        <button
          onClick={() => dispatch(logout())}
          className="px-3 py-1 rounded-md border hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
