"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import { fetchChats, setActiveChat, createChat } from "@/redux/slices/chatSlice";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const { chats, activeChat } = useSelector((state: RootState) => state.chat);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const mobile = typeof window !== "undefined" && window.innerWidth <= 962;
    setIsOpen(!mobile);
  }, []);

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-black text-white">
      <Header isOpen={isOpen} setIsOpen={setIsOpen} createChat={() => dispatch(createChat())}/>

      <div className="flex flex-1 overflow-hidden pt-14">
        <Sidebar
          chats={chats}
          activeChat={activeChat}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />

        <main className="flex-1 min-w-0 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
