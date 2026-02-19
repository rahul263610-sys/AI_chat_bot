"use client";

import React, { useRef, useEffect } from "react";

interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  divider?: boolean;
  variant?: "default" | "danger";
}

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  items: DropdownItem[];
  trigger?: React.ReactNode;
  position?: "left" | "right";
  align?: "top" | "bottom";
  sidebarOpen?: boolean;
}

export default function Dropdown({
  isOpen,
  onClose,
  items,
  trigger,
  position = "right",
  align = "bottom",
  sidebarOpen = true,
}: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
        ref={dropdownRef}
        className={`absolute ${
            align === "top" ? "bottom-full mb-2" : "top-full mt-2"
        } ${
            position === "right" ? "right-0" : "left-0"
        } bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 w-full`}
        >
        {items.map((item) => (
            <React.Fragment key={item.id}>
            {item.divider && <div className="border-t border-gray-700" />}
            <button
                onClick={() => {
                item.onClick();
                onClose();
                }}
                className={`w-full px-4 py-2 text-sm text-left flex items-center gap-2 transition ${
                item.variant === "danger"
                    ? "text-red-600 hover:bg-gray-700"
                    : "text-gray-200 hover:bg-gray-700"
                }`}
            >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                 {sidebarOpen && <span>{item.label}</span>}
            </button>
            </React.Fragment>
        ))}
    </div>
  );
}
