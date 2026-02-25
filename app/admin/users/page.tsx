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
import { useMode } from "@/hooks/useMode";

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const mode = useMode();
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
  const capitalize = (str?: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  return (
    <div className={`p-4 sm:p-6 md:p-8 min-h-screen ${
      mode === "dark" ? "bg-gray-900" : "bg-gray-100"
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className={`text-2xl sm:text-3xl font-bold ${mode === "dark" ? "text-white" : "text-gray-800"}`}>
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
            <div className={`hidden md:block shadow-xl rounded-2xl ${
              mode === "dark" ? "bg-gray-800" : "bg-white"
            }`}>
              <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
                <table className="min-w-full text-sm text-left">
                  <thead className={`border-b sticky top-0 z-10 ${
                    mode === "dark" ? "bg-gray-700" : "bg-gray-50"
                  }`}>
                    <tr>
                      <th className={`px-6 py-4 font-semibold ${
                        mode === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}>
                        Sr No
                      </th>
                      <th className={`px-6 py-4 font-semibold ${
                        mode === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}>
                        Name
                      </th>
                      <th className={`px-6 py-4 font-semibold ${
                        mode === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}>
                        Email
                      </th>
                      <th className={`px-6 py-4 font-semibold ${
                        mode === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}>
                        Role
                      </th>
                      <th className={`px-6 py-4 font-semibold ${
                        mode === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}>
                        Subsription
                      </th>
                      <th className={`px-6 py-4 font-semibold ${
                        mode === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}>
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user, i) => (
                      <tr
                        key={user._id}
                        className={`border-b transition ${
                          mode === "dark" 
                            ? "border-gray-700 hover:bg-gray-700" 
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <td className={`px-6 py-4 ${
                          mode === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}>
                          {(page - 1) * limit + i + 1}
                        </td>

                        <td className={`px-6 py-4 font-medium ${
                          mode === "dark" ? "text-white" : "text-gray-800"
                        }`}>
                          {user.name}
                        </td>

                        <td className={`px-6 py-4 ${
                          mode === "dark" ? "text-white" : "text-gray-600"
                        }`}>
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
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.subscription?.plan === "premium"
                                ? "bg-green-100 text-green-700"
                                : user.subscription?.plan==="free" ? "bg-blue-100 text-blue-700"
                                : "bg-red-100 text-red-500"
                            }`}
                          >
                           {capitalize(user.subscription?.plan)}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleViewHistory(user._id)}
                            className="cursor-pointer px-3 py-1 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                          >
                            View History
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
                <div className={`p-4 border-t rounded-b-2xl ${
                  mode === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50"
                }`}>
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
                  className={`shadow-md rounded-xl p-4 ${
                    mode === "dark" ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h2 className={`font-semibold ${
                      mode === "dark" ? "text-white" : "text-gray-800"
                    }`}>
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

                  <p className={`text-sm break-all ${
                    mode === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>
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
