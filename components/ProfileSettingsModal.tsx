"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useMode } from "@/hooks/useMode";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; email: string }) => Promise<void>;
  loading: boolean;
}

export default function ProfileSettingsModal({
  isOpen,
  onClose,
  onSave,
  loading,
}: ProfileSettingsModalProps) {
  const mode = useMode();
  const user = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    await onSave({ name, email });
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div
        className={`relative z-10 w-full max-w-md mx-4 p-6 rounded-xl shadow-xl ${
          mode === "dark" ? "bg-gray-900" : "bg-white"
        }`}
      >
        <h2
          className={`text-lg font-semibold mb-4 ${
            mode === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Profile Settings
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-1 ${
                mode === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-2 rounded-lg border ${
                mode === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-6">
            <label
              className={`block text-sm font-medium mb-1 ${
                mode === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-2 rounded-lg border ${
                mode === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
              placeholder="Enter your email"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                mode === "dark"
                  ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              } disabled:opacity-50`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition bg-blue-600 hover:bg-blue-700 disabled:opacity-50`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
