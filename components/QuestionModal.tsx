"use client";

import React from "react";
import Loader from "@/components/ui/Loader";

interface QuestionModalProps {
  open: boolean;
  onClose: () => void;
  title: string | null;
  questions: any[];
  loading: boolean;
}

export default function QuestionModal({ open, onClose, title, questions, loading }: QuestionModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate max-w-[60vw]" title={typeof title === 'string' ? title : undefined}>{title}</h3>
            <p className="text-sm text-gray-500 truncate max-w-[60vw]">Questions for this chat</p>
          </div>
          <button onClick={onClose} aria-label="Close questions" className="cursor-pointer inline-flex items-center justify-center w-9 h-9 rounded-md text-gray-600 hover:bg-gray-100">✕</button>
        </div>

        <div className="px-6 py-4 bg-gray-50">
          <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-2">
            {loading ? (
              <div className="flex items-center justify-center py-10"><Loader /></div>
            ) : questions.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No questions found for this chat.</div>
            ) : (
              <ol className="space-y-3">
                {questions.map((q: any, i: number) => (
                  <li key={i} className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-800 whitespace-pre-wrap break-words">{q.content}</div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        <div className="px-6 py-3 bg-white border-t flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition cursor-pointer">Close</button>
        </div>
      </div>
    </div>
  );
}
