"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { getCurrentUser } from "@/redux/slices/authSlice";

export default function Home() {
  const router = useRouter();
  const { user } = useSelector(
    (state: RootState) => state.auth
  );

  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchUser = async () => {
      await dispatch(getCurrentUser());
  };
    fetchUser();
  }, [dispatch]);

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!mounted) return; 
    if (!user) {
      router.replace("/login");
    }
    if (user?.role === "Admin") {
      router.replace("/admin");
    } else {
      router.replace("/chat");
    }
  }, [user, mounted, router]);


  return null;
}
