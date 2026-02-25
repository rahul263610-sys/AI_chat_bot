"use client";

import { useMode } from "@/hooks/useMode";
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNext: boolean;
  hasPrev: boolean;
  loading?: boolean;
  currentLimit?: number;
  onLimitChange?: (limit: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hasNext,
  hasPrev,
  loading = false,
  currentLimit = 10,
  onLimitChange,
}: PaginationProps) {
  const mode = useMode();
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      if (startPage > 2) {
        pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-6">
        <>
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={!hasPrev || loading}
            className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>

          <div className="flex gap-1">
            {pages.map((page, idx) => (
              <button
                key={idx}
                onClick={() => typeof page === "number" && onPageChange(page)}
                disabled={page === "..." || loading || page === currentPage}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  page === currentPage
                    ? "bg-indigo-600 text-white"
                    : page === "..."
                    ? "cursor-default text-gray-400"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } disabled:cursor-not-allowed`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={!hasNext || loading}
            className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </>
      <div className="flex items-center gap-4 ml-0 sm:ml-4">
        <span className={`text-sm ${mode==="dark" ? "text-white": "text-gray-600"}`}>Page {currentPage} of {totalPages}</span>

        <div className="flex items-center gap-2">
          <label className={`text-sm ${mode==="dark" ? "text-white": "text-gray-600"}`}>Per page</label>
          <select
            aria-label="Select items per page"
            value={currentLimit ?? 10}
            onChange={(e) => onLimitChange?.(parseInt(e.target.value, 10))}
            disabled={loading}
            className="ml-1 px-3 py-1 border rounded-lg text-sm bg-white text-gray-700 focus:outline-none cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    </div>
  );
}
