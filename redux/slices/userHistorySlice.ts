import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios";

interface ChatHistory {
  _id: string;
  title: string;
  createdAt: string;
  userId: {
    name: string;
    email: string;
  };
}

interface HistoryState {
  chats: ChatHistory[];
  loading: boolean;
  error: string | null;
}

const initialState: HistoryState = {
  chats: [],
  loading: false,
  error: null,
};

export const fetchUserHistory = createAsyncThunk(
  "history/fetchUserHistory",
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/users/${userId}/chats`);
      return res.data;
    } catch (error: any) {
      return rejectWithValue("Failed to fetch history");
    }
  }
);

const userHistorySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    clearHistory: (state) => {
      state.chats = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchUserHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearHistory } = userHistorySlice.actions;
export default userHistorySlice.reducer;
