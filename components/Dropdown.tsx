"use client";

import { useRef } from "react";
import { useMode } from "@/hooks/useMode";
import ClickOutside from "./ClickOutside";

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  divider?: boolean;
}

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  items: DropdownItem[];
  position?: "left" | "right";
  align?: "top" | "bottom";
  sidebarOpen?: boolean;
}

export default function Dropdown({
  isOpen,
  onClose,
  items,
  position = "left",
  align = "top",
}: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mode = useMode();

  const positionClasses = {
    left: "left-0",
    right: "right-0",
  };

  const alignClasses = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
  };

  if (!isOpen) return null;

  return (
    <ClickOutside onClick={onClose}>
      <div
        ref={dropdownRef}
        className={`absolute ${positionClasses[position]} ${alignClasses[align]} min-w-[160px] rounded-lg shadow-lg z-50 py-1 ${
          mode === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
        }`}
      >
        {items.map((item) => (
          <div key={item.id}>
            {item.divider && (
              <div
                className={`my-1 border-t ${
                  mode === "dark" ? "border-gray-700" : "border-gray-200"
                }`}
              />
            )}

            <button
              onClick={() => {
                item.onClick?.();
                onClose();
              }}
              className={`cursor-pointer w-full flex items-center gap-2 px-3 py-2 text-sm transition ${
                mode === "dark"
                  ? "text-gray-200 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          </div>
        ))}
      </div>
    </ClickOutside>
  );
}
