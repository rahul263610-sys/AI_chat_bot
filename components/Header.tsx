"use client";

import { Menu } from "lucide-react";
import { useRole } from "@/hooks/useRole";
interface HeaderProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  createChat?: () => void;
}

export default function Header({ isOpen, setIsOpen,createChat = () => {}, }: HeaderProps) {
  const role = useRole();
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-gray-800 bg-black flex items-center px-4 justify-between">
      
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-gray-800 transition cursor-pointer"
        >
          <Menu size={20} />
        </button>

        <h1 className="text-lg font-semibold tracking-wide">
          AI Assistant
        </h1>
       {role === "User" && (
          <button
            onClick={createChat}
            className="m-3 w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md transition transform hover:scale-105 cursor-pointer"
            title="New Chat"
          >
            <span className="text-xl font-bold">+</span>
          </button>
        )}
      </div>

      {/* Right Section */}
      <div className="text-sm text-gray-400">
        Powered by OpenAI
      </div>
    </div>
  );
}
