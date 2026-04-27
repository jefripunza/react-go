export type UserRole = "su" | "user";

export interface User {
  id?: string;
  // auth
  username: string;
  password?: string;
  // profile
  name: string;
  avatar?: string;
  phone_number?: string;
  role: UserRole;
  created_at: string;
}
