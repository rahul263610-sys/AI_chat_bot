export type Role = "Admin" | "User";

export interface User {
  _id: string;
  name?: string;
  email?: string;
  role: Role;
   subscription?: {
    plan: string;
  } | null;
}


export interface AuthUser {
  id: string;
  role: Role;
}
