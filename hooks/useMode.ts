"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export const useMode = () => {
  return useSelector((state: RootState) => state.theme.mode);
};
