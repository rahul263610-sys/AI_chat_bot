"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@/components/ui/Loader";
import { fetchDashboardStats, fetchRecentUsers } from "@/redux/slices/dashboardSlice";
import type { RootState, AppDispatch } from "@/redux/store";

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const { stats, recentUsers, loading: loadingStats } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    if (!loading) {
      if (!user) router.replace("/login");
      else if (user.role !== "Admin") router.replace("/chat");
    }
  }, [user, loading, router]);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchRecentUsers());
  }, [dispatch]);

  if (loading || !user) return null;

  const StatCard = ({
    icon,
    label,
    value,
  }: {
    icon: string;
    label: string;
    value: string | number;
  }) => (
    <div className="bg-gradient-to-br from-white to-gray-50 p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600">
            {label}
          </p>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
            {loadingStats ? <Loader /> : value}
          </div>
        </div>
        <div className="text-3xl sm:text-4xl">{icon}</div>
      </div>
    </div>
  );
  const capitalize = (str?: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-6 sm:p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Welcome back, Admin! Here's your system overview.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatCard
          icon="👥"
          label="Total Users"
          value={stats?.totalUsers ?? "—"}
        />
        <StatCard
          icon="🆕"
          label="New Signups (24h)"
          value={stats?.newSignups24h ?? "—"}
        />
        <StatCard
          icon="💬"
          label="Total Chats"
          value={stats?.totalChats ?? "—"}
        />
        <StatCard
          icon="🚀"
          label="Chats (24h)"
          value={stats?.chatsToday ?? "—"}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-md border border-gray-200 p-4 sm:p-6 md:p-8 transition-all">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Recent Activity
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              User signups in the last 7 days
            </p>
          </div>

          {loadingStats ? (
            <div className="h-56 sm:h-64 md:h-72 flex items-center justify-center">
              <Loader />
            </div>
          ) : stats?.signupsByDay ? (
            <div className="relative h-56 sm:h-64 md:h-72">
              <div className="flex items-end justify-between h-full gap-2 sm:gap-4 px-2 sm:px-4">
                {stats.signupsByDay.map((d: any) => {
                  const maxValue = Math.max(
                    ...stats.signupsByDay.map((x: any) => x.count),
                    1
                  );
                  const heightPercent = (d.count / maxValue) * 100;

                  return (
                    <div
                      key={d.date}
                      className="flex-1 flex flex-col items-center justify-end h-full group"
                    >
                      <div
                        className="w-6 sm:w-8 md:w-12 bg-gradient-to-t from-indigo-600 via-indigo-500 to-indigo-400 rounded-xl shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl relative"
                        style={{
                          height: `${Math.max(heightPercent, 6)}%`,
                        }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                          {d.count} users
                        </div>
                      </div>

                      <span className="text-[10px] sm:text-xs text-gray-500 mt-3 font-medium tracking-wide">
                        {d.date.slice(5)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 border-t border-gray-100 pt-4 flex items-center justify-center">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  Daily Signup Trend
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-center py-12">
              No activity data available
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">
            Latest Users
          </h2>

          {loadingStats ? (
            <div className="h-56 sm:h-64 flex items-center justify-center">
              <Loader />
            </div>
          ) : recentUsers.length === 0 ? (
            <div className="text-gray-500 text-center py-8 text-sm">
              No users yet
            </div>
          ) : (
            <ul className="space-y-3">
              {recentUsers.map((u: any, idx: number) => (
                <li
                  key={u._id || idx}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-lg hover:from-indigo-50 transition-colors border border-gray-100"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-semibold">
                      {u.name?.[0]?.toUpperCase() || "?"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 truncate text-sm sm:text-base">
                        {u.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        Created At •{" "}
                        {new Date(u.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div
                   className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              u.subscription?.plan === "premium"
                                ? "bg-green-100 text-green-700"
                                : u.subscription?.plan==="free" ? "bg-blue-100 text-blue-700"
                                : "bg-red-100 text-red-500"
                            }`}
                          >
                           {capitalize(u.subscription?.plan)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
