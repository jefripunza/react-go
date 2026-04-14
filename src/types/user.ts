export type UserRole = "admin" | "client";

export interface User {
  id?: string;
  name: string;
  avatar?: string;
  phone_number?: string;
  email: string;
  username: string;
  provider: string;
  role: UserRole;
  created_at: string;
}

export interface JwtClaims {
  id: string;
  role: UserRole;
}
