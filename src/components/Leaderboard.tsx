import { useGetLeaderboardQuery } from "../features/leaderboard/leaderboardApi";
import { useAppSelector } from "../app/hooks";
import AdminSidebar from "../components/AdminSidebar"; // Adjust the import path as needed
import TopBar from "../components/TopBar"; // Adjust the import path as needed

export default function Leaderboard() {
  const { data, isLoading } = useGetLeaderboardQuery();
  const authUser = useAppSelector((s) => s.auth.user);

  // Generate the rank badge (🥇, 🥈, 🥉) for the top 3 ranks
  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
          <span className="text-yellow-500 text-lg">🥇</span> {/* Gold Medal */}
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-full bg-slate-400/20 flex items-center justify-center">
          <span className="text-slate-400 text-lg">🥈</span> {/* Silver Medal */}
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-full bg-amber-600/20 flex items-center justify-center">
          <span className="text-amber-600 text-lg">🥉</span> {/* Copper Medal */}
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-gray-600/20 flex items-center justify-center">
        <span className="text-sm font-medium text-gray-400">{rank}</span> {/* Rank number */}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-700 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Admin Sidebar */}
      <AdminSidebar />

      <div className="flex flex-col flex-1">
        {/* Top Bar */}
        <TopBar />

        {/* Content */}
        <div className="p-8">
          <div className="max-w-5xl mx-auto mt-6 p-5 bg-white rounded-xl shadow-lg">
            <h1 className="text-3xl font-semibold mb-6 text-center text-blue-600">
              Leaderboard 🏆
            </h1>

            <div className="overflow-x-auto rounded-lg shadow">
              <table className="w-full text-left">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">
                      Rank
                    </th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">
                      User
                    </th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">
                      Score
                    </th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">
                      Max Score
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {data?.map((row, index) => {
                    //const isTop3 = index < 3; // Check if the user is in the top 3

                    return (
                      <tr
                        key={row.userId || `${row.user.name}-${index}`} // Use userId or fallback to user.name + index
                        className={`transition hover:bg-gray-50 ${
                          row.user.name === authUser?.name ? "bg-blue-50" : ""
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
