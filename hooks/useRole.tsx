"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export const useRole = () => {
  return useSelector((state: RootState) => state.auth.role);
};
