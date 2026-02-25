"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export const useRemaining = (): number | null => {
  return useSelector((state: RootState) => state.chat.remaining);
};