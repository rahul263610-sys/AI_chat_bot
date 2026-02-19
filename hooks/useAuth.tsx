"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import type { User } from "@/types/user";

export const useAuth = (): User | null => {
  return useSelector((state: RootState) => state.auth.user);
};
