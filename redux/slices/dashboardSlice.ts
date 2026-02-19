import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import type { User } from "@/types/user";

interface DashboardState {
  stats: {
    totalUsers: number;
    totalChats: number;
    newSignups24h: number;
    chatsToday: number;
    signupsByDay: { date: string; count: number }[];
  } | null;
  recentUsers: User[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  recentUsers: [],
  loading: false,
  error: null,
};

export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/admin/stats");
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch stats");
    }
  }
);

export const fetchRecentUsers = createAsyncThunk(
  "dashboard/fetchRecentUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/admin/users");
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch recent users");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchRecentUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.recentUsers = action.payload.users || [];
      })
      .addCase(fetchRecentUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;
