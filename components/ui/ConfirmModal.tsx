"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useMode } from "@/hooks/useMode";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel: () => void;
  loading?: boolean;
  variant?: "default" | "danger";
}

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
  variant = "default",
}: ConfirmModalProps) {
  const mode = useMode();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
      />
      <div
        className={`relative z-10 w-full max-w-md mx-4 p-6 rounded-xl shadow-xl ${
          mode === "dark" ? "bg-gray-900" : "bg-white"
        }`}
      >
        <h2
          className={`text-lg font-semibold mb-2 ${
            mode === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </h2>
        {description && (
          <p
            className={`text-sm mb-6 ${
              mode === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {description}
          </p>
        )}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              mode === "dark"
                ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            } disabled:opacity-50`}
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition ${
                variant === "danger"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } disabled:opacity-50`}
            >
              {loading ? "Loading..." : confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
