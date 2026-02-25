"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { fetchSingleChat, deleteChat } from "@/redux/slices/chatSlice";
import { SidebarData } from "../helper/config/sidebarData";
import { useRole } from "@/hooks/useRole";
import { useMode } from "@/hooks/useMode";
import UserProfileDropdown from "@/components/UserProfileDropdown";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { toast } from "react-toastify";
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
  const mode = useMode();
  const role = useRole();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteChatId, setDeleteChatId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
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
  const confirmDelete = async () => {
    if (!deleteChatId) return;

    try {
      setDeleting(true);
      await dispatch(deleteChat(deleteChatId)).unwrap();
      toast.success("Chat deleted successfully")
      setDeleteChatId(null);
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setDeleting(false);
    }
  };
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed md:relative z-40 top-14 md:top-0 left-0 h-[calc(100vh-56px)] ${mode === "dark" ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} border-r transform transition-all duration-300
        flex flex-col
        ${
          isOpen
            ? "translate-x-0 w-64 md:w-64"
            : "-translate-x-full md:translate-x-0 w-64 md:w-16"
        }`}
      >
        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-3 py-2">
              {isOpen && <h2 className={`text-xs font-semibold uppercase mb-2 ${mode === "dark" ? "text-gray-400" : "text-gray-500"}`}>{role=="User" ? "Your Chats" : "Menu" }</h2>}
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
                    className={`cursor-pointer p-3 rounded-lg text-sm transition ${mode === "dark" ? "hover:bg-gray-800 text-white" : "hover:bg-gray-200 text-black"}`}
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
                    className={`group relative cursor-pointer p-2 rounded-lg text-sm transition ${
                     activeChat?._id === chat._id
                      ? (mode === "dark" ? "bg-gray-800" : "bg-gray-200")
                      : (mode === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-200")
                    } ${mode === "dark" ? "text-white" : "text-black"}`}
                  >
                    {isOpen ? (
                      <div className="flex items-center justify-between">
                        <div                  
                          className="flex-1 max-w-full overflow-hidden whitespace-nowrap text-ellipsis"
                        >
                          {chat.title || "New Chat"}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(
                              openMenuId === chat._id ? null : chat._id
                            );
                          }}
                          className="cursor-pointer opacity-0 group-hover:opacity-100 transition px-2"
                        >
                          ⋯
                        </button>
                      </div>
                    ) : (
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full mx-auto"
                      />
                    )}

                    {isOpen && openMenuId === chat._id && (
                      <div className={`absolute right-2 top-8 w-28 border rounded-md shadow-lg z-50 ${mode === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                        <button
                          onClick={() => {
                            setDeleteChatId(chat._id);
                            setOpenMenuId(null);
                          }}
                          className={`cursor-pointer w-full text-left px-3 py-2 text-sm ${mode === "dark" ? "hover:bg-gray-700 text-red-400" : "hover:bg-gray-100 text-red-500"}`}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
          </div>
        </div>

        <div className={`p-2 border-t overflow-visible ${mode === "dark" ? "border-gray-800" : "border-gray-200"}`}>
          <UserProfileDropdown isSidebarOpen={isOpen} />
        </div>
        <ConfirmModal
          isOpen={!!deleteChatId}
          title="Delete Chat?"
          description="This chat will be permanently removed from your history."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteChatId(null)}
          loading={deleting}
          variant="danger"
        />
      </div>
    </>
  );
}
