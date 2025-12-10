// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import { api } from "../api/api";
import { quizApi } from "../features/quiz/quizApi";
import { usersApi } from "../features/adminUsers/usersApi";
import { leaderboardApi } from "../features/leaderboard/leaderboardApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,
    [quizApi.reducerPath]: quizApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [leaderboardApi.reducerPath]: leaderboardApi.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(
      api.middleware,
      quizApi.middleware,
      usersApi.middleware,
      leaderboardApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
