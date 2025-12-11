// src/features/users/usersApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../api/baseQuery";
import type { User, UsersResponse } from "./types";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery,
  tagTypes: ["Users"],

  endpoints: (builder) => ({
    getAllUsers: builder.query<UsersResponse, void>({
      query: () => "/users/all",
      providesTags: ["Users"],
    }),

    getUser: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),

    updateUserRole: builder.mutation<
      User,
      { userId: string; role: "ADMIN" | "USER" }
    >({
      query: ({ userId, role }) => ({
        url: `/users/${userId}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["Users"],
    }),

    toggleBlockUser: builder.mutation<
      User,
      { userId: string; block: boolean }
    >({
      query: ({ userId, block }) => ({
        url: `/users/${userId}/block`,
        method: "PATCH",
        body: { block },
      }),
      invalidatesTags: ["Users"],
    }),

    deleteUser: builder.mutation<{ success: boolean }, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserQuery,
  useToggleBlockUserMutation,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} = usersApi;
