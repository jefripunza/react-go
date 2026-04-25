export type UserRole = "admin" | "client";

export interface User {
  id?: string;
  // auth
  username: string;
  password?: string;
  // profile
  name: string;
  phone_number?: string;
  role: UserRole;
  created_at: string;
}
