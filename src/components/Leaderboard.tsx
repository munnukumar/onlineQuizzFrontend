import React from "react";
import { useGetLeaderboardQuery } from "../features/leaderboard/leaderboardApi";
import { useAppSelector } from "../app/hooks";
import AdminSidebar from "../components/AdminSidebar";
import TopBar from "../components/TopBar";

export default function Leaderboard() {
  const { data: leaderboard, isLoading } = useGetLeaderboardQuery();
  const authUser = useAppSelector((s) => s.auth.user);

  // Generate the rank badge (🥇, 🥈, 🥉) for the top 3 ranks
  const getRankBadge = (rank: number) => {
    const badgeClasses =
      "w-8 h-8 rounded-full flex items-center justify-center text-lg";

    switch (rank) {
      case 1:
        return (
          <div className={`${badgeClasses} bg-yellow-500/20 text-yellow-500`}>
            🥇
          </div>
        );
      case 2:
        return (
          <div className={`${badgeClasses} bg-slate-400/20 text-slate-400`}>
            🥈
          </div>
        );
      case 3:
        return (
          <div className={`${badgeClasses} bg-amber-600/20 text-amber-600`}>
            🥉
          </div>
        );
      default:
        return (
          <div className={`${badgeClasses} bg-gray-600/20 text-gray-400 text-sm font-medium`}>
            {rank}
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 p-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-16 bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Top Bar */}
        <TopBar />

        {/* Leaderboard Table */}
        <div className="p-8">
          <div className="max-w-5xl mx-auto bg-white p-5 rounded-xl shadow-lg">
            <h1 className="text-3xl font-semibold mb-6 text-center text-blue-600">
              Leaderboard 🏆
            </h1>

            <div className="overflow-x-auto rounded-lg shadow">
              <table className="w-full text-left">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    {["Rank", "User", "Score", "Max Score"].map((header) => (
                      <th
                        key={header}
                        className="py-3 px-4 text-sm font-semibold text-gray-700"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {leaderboard?.map((row, index) => {
                    const isCurrentUser = row.user.name === authUser?.name;

                    return (
                      <tr
                        key={row.userId || `${row.user.name}-${index}`}
                        className={`transition hover:bg-gray-50 ${
                          isCurrentUser ? "bg-blue-50" : ""
                        }`}
                      >
                        <td className="py-3 px-4 font-bold text-blue-600">
                          {getRankBadge(index + 1)}
                        </td>
                        <td className="py-3 px-4">{row.user.name}</td>
                        <td className="py-3 px-4 font-semibold text-gray-700">
                          {row.totalScore} pts
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {row.totalMaxScore} pts
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="text-center text-sm text-gray-500 mt-4">
              Ranking is updated automatically after every quiz attempt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
