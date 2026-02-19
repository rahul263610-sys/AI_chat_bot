"use client";

import React, { useState, useEffect } from "react";
import { AiOutlineLogout, AiOutlineSetting } from "react-icons/ai";
import Dropdown from "@/components/Dropdown";
import ProfileSettingsModal from "@/components/ProfileSettingsModal";
import { useDispatch } from "react-redux";
import { logoutUser,updateUser } from "@/redux/slices/authSlice";
import type { AppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { clearChats } from "@/redux/slices/chatSlice";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/types/user";
interface UserProfileDropdownProps {
  isSidebarOpen: boolean;
}
export default function UserProfileDropdownn({ isSidebarOpen }: UserProfileDropdownProps) {
  const user = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [userData, setUserData] = useState<User | null>(user);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(clearChats());
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
  };

  const handleSaveProfile = async (data: {
    name: string;
    email: string;
  }) => {
    setSaveLoading(true);
    try {
      await dispatch(updateUser(data)).unwrap();
      toast.success("Profile updated successfully");
      setProfileModalOpen(false);
    } catch (error : any) {
      toast.error(error  || "Failed to update profile");
    } finally {
      setSaveLoading(false);
    }
  };

  const dropdownItems = [
    {
      id: "settings",
      label: "Settings",
      icon: <AiOutlineSetting size={16} />,
      onClick: () => setProfileModalOpen(true),
    },
    {
      id: "logout",
      label: "Logout",
      icon: <AiOutlineLogout size={16} />,
      onClick: handleLogout,
      divider: true,
    },
  ];

  if (!user && !userData) return null;

  const userInitial = (userData?.name || user?.name)?.[0]?.toUpperCase() || "U";
  const displayName = userData?.name || user?.name || "User";
  const displayRole = userData?.role || user?.role || "User";

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="w-full p-3 rounded-lg transition hover:bg-gray-800 flex items-center gap-3"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
          {userInitial}
        </div>
          <div className="min-w-0 flex-1 text-left">
            <div className="text-sm font-medium text-white truncate">
              {displayName}
            </div>
            <div className="text-xs text-gray-400 truncate">{displayRole}</div>
          </div>
      </button>
       <Dropdown
            isOpen={dropdownOpen}
            onClose={() => setDropdownOpen(false)}
            items={dropdownItems}
            position="left"
            align="top"
            sidebarOpen={isSidebarOpen} 
       />
      <ProfileSettingsModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onSave={handleSaveProfile}
        loading={saveLoading}    
      />
    </div>
  );
}
