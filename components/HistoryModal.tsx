"use client";

import React from "react";
import Loader from "@/components/ui/Loader";

interface HistoryModalProps {
  open: boolean;
  onClose: () => void;
  chats: any[];
  loading: boolean;
  onViewQuestions: (chatId: string) => void;
}

export default function HistoryModal({ open, onClose, chats, loading, onViewQuestions }: HistoryModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl relative max-h-[85vh] overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Chat History</h2>

          <button onClick={onClose} className="text-gray-500 hover:text-red-600 text-lg font-bold">
            ✕
          </button>
        </div>

        <div className="p-6 overflow-x-auto max-h-[70vh] overflow-y-auto">
          {loading ? (
            <Loader />
          ) : chats.length === 0 ? (
            <p className="text-center text-gray-500">No chat history found.</p>
          ) : (
            <table className="min-w-full text-sm text-left border rounded-lg overflow-hidden">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-4 py-3 border font-semibold text-gray-800">Sr No</th>
                  <th className="px-4 py-3 border font-semibold text-gray-800">Title</th>
                  <th className="px-4 py-3 border font-semibold text-gray-800">User Name</th>
                  <th className="px-4 py-3 border font-semibold text-gray-800">Email</th>
                  <th className="px-4 py-3 border font-semibold text-gray-800">Created At</th>
                  <th className="px-4 py-3 border font-semibold text-gray-800">View Questions</th>
                </tr>
              </thead>
              <tbody>
                {chats.map((chat: any, index: number) => (
                  <tr key={chat._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 border text-gray-800">{index + 1}</td>
                    <td className="px-4 py-3 border text-gray-800 max-w-[40ch]"><div className="truncate" title={chat.title}>{chat.title}</div></td>
                    <td className="px-4 py-3 border text-gray-800 max-w-[24ch]"><div className="truncate" title={chat.userId?.name}>{chat.userId?.name}</div></td>
                    <td className="px-4 py-3 border text-gray-800 max-w-[28ch]"><div className="truncate" title={chat.userId?.email}>{chat.userId?.email}</div></td>
                    <td className="px-4 py-3 border text-gray-800">{new Date(chat.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3 border">
                      <button onClick={() => onViewQuestions(chat._id)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">View Questions</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="px-6 py-3 border-t bg-gray-50 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">Close</button>
        </div>
      </div>
    </div>
  );
}
