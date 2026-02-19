import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import type { AuthUser, Role, User } from "@/types/user";

interface AuthState {
  user: User | null;
  role: Role | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  role: null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }, thunkAPI) => {
    try {
      const res = await axios.post("/auth/login", data);
      return res.data.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);
export const registerUser = createAsyncThunk(
  "auth/register",
  async (data: { name:string; email: string; password: string }, thunkAPI) => {
    try {
      const res = await axios.post("/auth/register", data);
      return res.data.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async () => {
    try {
      const res = await axios.get("/auth/me");
      return res.data.user;
    } catch {
      return null;
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      await axios.post("/auth/logout");
      localStorage.removeItem("nextauth.message");
      return null;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Logout failed"
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (data: { name: string; email: string }, { rejectWithValue }) => {
    try {
      const res = await axios.put("/auth/me", data);
      return res.data.user;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Update failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.role = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.role = action.payload?.role || null;
      })
      .addCase(loginUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.role = action.payload?.role || null;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.role = null;
      })

      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.role = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
   },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
