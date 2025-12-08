import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../api/baseQuery";

export interface LeaderboardRow {
  id: string;
  user : {
    name: string;
  };
  totalScore: number;
  totalMaxScore: number;
  rank: number;
  userId?: string;
  avatar?: string;
}

export const leaderboardApi = createApi({
  reducerPath: "leaderboardApi",
  baseQuery,
  tagTypes: ["Leaderboard"],

  endpoints: (builder) => ({
    getLeaderboard: builder.query<LeaderboardRow[], void>({
      query: () => "/results/leaderboard",
      providesTags: [{ type: "Leaderboard", id: "LIST" }],
    }),
  }),
});

export const { useGetLeaderboardQuery } = leaderboardApi;
