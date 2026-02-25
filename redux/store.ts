import { configureStore, combineReducers } from "@reduxjs/toolkit";
import chatReducer from "./slices/chatSlice";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import historyReducer from "./slices/userHistorySlice";
import dashboardReducer from "./slices/dashboardSlice";
import subscriptionReducer from "./slices/subscriptionSlice";
import themeReducer from "./slices/themeSlice";


const appReducer = combineReducers({
  chat: chatReducer,
  auth: authReducer,
  user: userReducer,
  history: historyReducer,
  dashboard: dashboardReducer,
  subscription: subscriptionReducer,
   theme: themeReducer,
});

// 👇 THIS IS THE MAGIC
const rootReducer = (state: any, action: any) => {
  if (action.type === "auth/logoutUser/fulfilled") {
    state = undefined;
  }

  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;