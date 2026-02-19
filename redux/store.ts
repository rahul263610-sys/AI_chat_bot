import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./slices/chatSlice";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import historyReducer from "./slices/userHistorySlice";
import dashboardReducer from "./slices/dashboardSlice";
export const store = configureStore({
  reducer: {
    chat: chatReducer,
    auth: authReducer,
    user: userReducer,
    history: historyReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
