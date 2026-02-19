"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { fetchSingleChat } from "@/redux/slices/chatSlice";
import { SidebarData } from "../helper/config/sidebarData";
import { useRole } from "@/hooks/useRole";
import UserProfileDropdown from "@/components/UserProfileDropdown";
import { useAuth } from "@/hooks/useAuth";
interface SidebarProps {
  chats?: any[];
  activeChat?: any;
  isOpen?: boolean;
  setIsOpen?: (val: boolean) => void;
}

export default function Sidebar({
  chats = [],
  activeChat = null,
  isOpen = true,
  setIsOpen = () => {},
}: SidebarProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const role = useRole();
  const handleSelectChat = async (chat: any) => {
    if (!chat?._id) return;

    try {
      await dispatch(fetchSingleChat(chat._id)).unwrap();

      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Failed to load chat:", error);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed md:relative z-40 top-14 md:top-0 left-0 h-[calc(100vh-56px)]
        bg-gray-900 border-r border-gray-800 transform transition-all duration-300
        flex flex-col
        ${
          isOpen
            ? "translate-x-0 w-64 md:w-64"
            : "-translate-x-full md:translate-x-0 w-64 md:w-16"
        }`}
      >
        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-3 py-2">
              {isOpen && <h2 className="text-gray-400 text-xs font-semibold uppercase mb-2">{role=="User" ? "Your Chats" : "Menu" }</h2>}
            </div>   

          <div className="flex-1 overflow-y-auto px-2 space-y-1 sidebar-scroll">
            {role === "Admin" &&
              SidebarData.filter((item) =>
                item.roles.includes("Admin")
              ).map((item, i) => {
                const Icon = item.icon;

                return (
                  <div
                    key={i}
                    onClick={() => {
                      router.push(item.path);
                      if (window.innerWidth < 768) {
                        setIsOpen(false);
                      }
                    }}
                    className="cursor-pointer p-3 rounded-lg text-sm transition hover:bg-gray-800"
                  >
                    {isOpen ? (
                      <div className="flex items-center space-x-2">
                        <Icon />
                        <span>{item.title}</span>
                      </div>
                    ) : (
                      <div><Icon /></div>
                    )}
                  </div>
                );
              })}
            {role === "User" &&
              chats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => handleSelectChat(chat)}
                  className={`cursor-pointer p-2 rounded-lg text-sm transition ${
                    activeChat?._id === chat._id
                      ? "bg-gray-800"
                      : "hover:bg-gray-800"
                  }`}
                >
                  {isOpen ? (
                    <div className="max-w-full overflow-hidden whitespace-nowrap text-ellipsis">
                      {chat.title || "New Chat"}
                    </div>
                  ) : (
                    <div className="w-2 h-2 bg-gray-400 rounded-full mx-auto" />
                  )}
                </div>
              ))}
          </div>
        </div>

        <div className="p-2 border-t border-gray-800">
          <UserProfileDropdown isSidebarOpen={isOpen} />
        </div>
      </div>
    </>
  );
}
