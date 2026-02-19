"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "@/redux/slices/userSlice";
import {
  fetchUserHistory,
  clearHistory,
} from "@/redux/slices/userHistorySlice";
import type { RootState, AppDispatch } from "@/redux/store";
import Loader from "@/components/ui/Loader";
import Pagination from "@/components/Pagination";
import HistoryModal from "@/components/HistoryModal";
import QuestionModal from "@/components/QuestionModal";
import { fetchChatQuestions } from "@/redux/slices/chatSlice";

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { users, loading, error, pagination } = useSelector(
    (state: RootState) => state.user
  );

  const { chats, loading: historyLoading } = useSelector(
    (state: RootState) => state.history
  );

  const { questions, questionTitle, questionLoading } = useSelector(
    (state: RootState) => state.chat
  );

  const [historyModal, setHistoryModal] = useState(false);
  const [questionModal, setQuestionModal] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers({ page, limit }));
  }, [dispatch, page, limit]);

  const handleViewHistory = (id: string) => {
    dispatch(fetchUserHistory(id));
    setHistoryModal(true);
  };

  const closeModal = () => {
    setHistoryModal(false);
    dispatch(clearHistory());
  };

  const handleViewQuestions = (chatId: string) => {
    dispatch(fetchChatQuestions(chatId));
    setQuestionModal(true);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            User Management
          </h1>
        </div>

        {loading && <Loader />}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white shadow-xl rounded-2xl">
              <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-gray-50 border-b sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-gray-600">
                        Sr No
                      </th>
                      <th className="px-6 py-4 font-semibold text-gray-600">
                        Name
                      </th>
                      <th className="px-6 py-4 font-semibold text-gray-600">
                        Email
                      </th>
                      <th className="px-6 py-4 font-semibold text-gray-600">
                        Role
                      </th>
                      <th className="px-6 py-4 font-semibold text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user, i) => (
                      <tr
                        key={user._id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 text-gray-500">
                          {(page - 1) * limit + i + 1}
                        </td>

                        <td className="px-6 py-4 font-medium text-gray-800">
                          {user.name}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {user.email}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.role === "Admin"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleViewHistory(user._id)}
                            className="px-3 py-1 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                          >
                            View History
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
                <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={setPage}
                    hasNext={pagination.hasNext}
                    hasPrev={pagination.hasPrev}
                    loading={loading}
                    currentLimit={limit}
                    onLimitChange={(l: number) => {
                      setLimit(l);
                      setPage(1);
                    }}
                  />
                </div>
            </div>
            <div className="grid gap-4 md:hidden">
              {users.map((user, i) => (
                <div
                  key={user._id}
                  className="bg-white shadow-md rounded-xl p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="font-semibold text-gray-800">
                      {(page - 1) * limit + i + 1}. {user.name}
                    </h2>

                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.role === "Admin"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 break-all">
                    {user.email}
                  </p>

                  <button
                    onClick={() => handleViewHistory(user._id)}
                    className="mt-3 w-full px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    View History
                  </button>
                </div>
              ))}
            </div>
              <div className="md:hidden mt-4">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={setPage}
                  hasNext={pagination.hasNext}
                  hasPrev={pagination.hasPrev}
                  loading={loading}
                  currentLimit={limit}
                  onLimitChange={(l: number) => {
                    setLimit(l);
                    setPage(1);
                  }}
                />
              </div>
          </>
        )}

        <HistoryModal
          open={historyModal}
          onClose={() => {
            setHistoryModal(false);
            dispatch(clearHistory());
          }}
          chats={chats}
          loading={historyLoading}
          onViewQuestions={(chatId: string) => {
            dispatch(fetchChatQuestions(chatId));
            setQuestionModal(true);
          }}
        />

        <QuestionModal
          open={questionModal}
          onClose={() => setQuestionModal(false)}
          title={questionTitle}
          questions={questions}
          loading={questionLoading}
        />
      </div>
    </div>
  );
}
