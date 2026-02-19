import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import type { User } from "@/types/user";
import type { Pagination } from "@/types/pagination";

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  pagination: Pagination;
}

const initialPagination: Pagination = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  hasNext: false,
  hasPrev: false,
};

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  pagination: initialPagination,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const res = await axios.get("/users", {
        params: { page, limit },
      });
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users || [];
        state.pagination = action.payload.pagination || initialPagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
