"use client";

import { useEffect, useRef } from "react";
import { useMode } from "@/hooks/useMode";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ activeChat }: any) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mode = useMode();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages?.length]);

  if (!activeChat || activeChat.messages.length === 0) {
    return (
      <div className={`flex-1 flex items-center justify-center ${mode === "dark" ? "text-gray-400" : "text-gray-500"}`}>
        Start a new chat to begin.
      </div>
    );
  }

  return (
     <div className={`flex-1 overflow-y-auto px-2 space-y-1 sidebar-scroll pt-4 ${mode === "dark" ? "bg-black" : "bg-white"}`}>
      <div className="max-w-3xl mx-auto w-full space-y-6">
        {activeChat.messages.map((msg: any, i: number) => (
          <MessageBubble key={i} msg={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
