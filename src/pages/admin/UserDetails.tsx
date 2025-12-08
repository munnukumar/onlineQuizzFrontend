import { useParams } from "react-router-dom";
import { useGetUserQuery } from "../../features/adminUsers/usersApi";

export default function UserDetails() {
  const { id } = useParams();
  const { data: user, isLoading } = useGetUserQuery(id!);

  if (isLoading) return <p className="p-8 text-center">Loading...</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">User Details</h1>

      <div className="bg-white p-6 shadow rounded-xl w-full max-w-xl">
        <h2 className="text-xl font-semibold">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>

        <div className="mt-4">
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>Status:</strong> {user.isBlocked ? "Blocked" : "Active"}
          </p>
          <p>
            <strong>Joined:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
