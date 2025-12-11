// src/features/users/types.ts
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  isBlocked: boolean;
  createdAt: string;
}


export interface UsersResponse {
  total: number;
  users: User[];
}