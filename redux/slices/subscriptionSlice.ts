import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Subscription } from "@/types/subscription";
import axiosInstance from "@/lib/axios";

interface SubscriptionState {
  loading: boolean;
  error: string | null;
  data: Subscription | null;
}

const initialState: SubscriptionState = {
  loading: false,
  error: null,
  data: null,
};

export const activateFreePlan = createAsyncThunk<
  Subscription,
  void,
  { rejectValue: string }
>("subscription/free", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/subscription/free", {
      method: "POST",
    });

    const data = await res.json();

    if (!res.ok) {
      return rejectWithValue(data.message);
    }

    return data.existingSubscription;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const fetchSubscription = createAsyncThunk<
  Subscription,
  void,
  { rejectValue: string }
>("subscription/get", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/subscription/check");
    const data = await res.json();

    if (!res.ok) {
      return rejectWithValue(data.message);
    }

    return data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const upgradePlan = createAsyncThunk(
  "subscription/upgrade",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/subscription/upgrade", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message);
      }

      // window.location.href = data.paymentUrl;
      window.location.href = data.url;

    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// export const upgradePlan = createAsyncThunk(
//   "subscription/upgrade",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await fetch(
//         "https://paycoolbackend.onrender.com/api/payments/pay/6997fd039a3f0300d83e0167/stripe",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             amount: 50,
//             currency: "INR",
//             customerEmail: "testing@gmail.com",
//             orderId: "123",
//           }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         return rejectWithValue(data.message || "Payment failed");
//       }

//       return data;

//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );
const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(activateFreePlan.pending, state => {
        state.loading = true;
      })
      .addCase(activateFreePlan.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(activateFreePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      })
      .addCase(fetchSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(upgradePlan.pending, (state) => {
        state.loading = true;
      })
      .addCase(upgradePlan.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(upgradePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default subscriptionSlice.reducer;