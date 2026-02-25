"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import { fetchChats } from "@/redux/slices/chatSlice";
import { getCurrentUser } from "@/redux/slices/authSlice";
import { useRole } from "@/hooks/useRole";
import { useMode } from "@/hooks/useMode";
import Loader from "@/components/ui/Loader";
import { fetchSubscription } from "@/redux/slices/subscriptionSlice";
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const mode = useMode();
  const [isOpen, setIsOpen] = useState(true);
  const role = useRole();
   useEffect(() => {
    const mobile = typeof window !== "undefined" && window.innerWidth <= 962;
    setIsOpen(!mobile);
  }, []);

  useEffect(() => {
    dispatch(fetchSubscription());
    dispatch(fetchChats());
    dispatch(getCurrentUser());
  }, [dispatch]);

  if(!role){
    return <Loader />
  }
  return (
    <div className={`h-screen flex flex-col overflow-hidden ${mode === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
      <Header isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex flex-1 overflow-hidden pt-14">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        <main className="flex-1 min-w-0 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
