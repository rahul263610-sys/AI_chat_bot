export type Role = "Admin" | "User";

export interface User {
  _id: string;
  name?: string;
  email?: string;
  role: Role;
}

export interface AuthUser {
  id: string;
  role: Role;
}
