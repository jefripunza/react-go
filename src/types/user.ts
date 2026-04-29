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
  is_fu: boolean; // first user
  is_active: boolean;
  created_at: string;
}
