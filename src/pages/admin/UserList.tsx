import {
  useGetAllUsersQuery,
  useToggleBlockUserMutation,
} from "../../features/adminUsers/usersApi";
import { Link } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import TopBar from "../../components/TopBar";

export default function UsersList() {
  const { data: users, isLoading } = useGetAllUsersQuery();
  const [toggleBlock] = useToggleBlockUserMutation();

  const [search, setSearch] = useState("");

  const filtered = users?.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Admin Sidebar */}
      <AdminSidebar />

      <div className="flex flex-col flex-1">
        {/* Top Bar */}
        <TopBar />

        {/* Content */}
        <div className="p-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">User Management</h1>

            <input
              type="text"
              className="border px-4 py-2 rounded-lg w-72"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {isLoading && <p className="mt-10 text-center">Loading users...</p>}

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered?.map((user) => (
              <div key={user._id} className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-xl">{user.name}</h2>
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      user.role === "ADMIN"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>

                <p className="text-gray-600 mb-2">{user.email}</p>
                <p className="text-sm text-gray-500">
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                </p>

                {/* Actions */}
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    to={`/admin/users/${user._id}`}
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                  >
                    View
                  </Link>

                  <button
                    onClick={() =>
                      toggleBlock({ userId: user._id, block: !user.isBlocked })
                    }
                    className={`px-4 py-2 rounded-lg text-white transition ${
                      user.isBlocked
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
