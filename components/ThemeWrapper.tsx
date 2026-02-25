"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setTheme } from "@/redux/slices/themeSlice";
import { useEffect } from "react";

export default function ThemeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;

    if (savedTheme) {
      dispatch(setTheme(savedTheme));
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("theme", mode);
  }, [mode]);

  return (
     <div className={mode === "dark" ? "dark bg-black min-h-screen" : "bg-white min-h-screen"}>
      {children}
    </div>
  );
}