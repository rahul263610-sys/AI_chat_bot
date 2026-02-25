import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";
import type { Chat, Message } from "@/types/chat";

interface UsageCheck {
  allowed: boolean;
  remaining: number;
  message: string;
}
interface ChatState {
  chats: Chat[];
  remaining: number | null;
  activeChat: Chat | null;

  questions: Message[];
  questionTitle: string;
  questionLoading: boolean;

  loading: boolean;
  error: string | null;
}


const initialState: ChatState = {
  chats: [],
  remaining: null,
  activeChat: null,

  questions: [],
  questionTitle: "",
  questionLoading: false,

  loading: false,
  error: null,
};

export const fetchChats = createAsyncThunk("chat/fetchChats", async () => {
  const res = await axiosInstance.get("/chat/list");
  return res.data;
});

export const createChat = createAsyncThunk("chat/createChat", async () => {
  const res = await axiosInstance.post("/chat/create");
  return res.data;
});

// export const sendMessage = createAsyncThunk(
//   "chat/sendMessage",
//   async ({ chatId, message }: { chatId: string; message: string }) => {
//     const res = await axiosInstance.post(`/chat/${chatId}`, { message });
//     return res.data;
//   }
// );
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ chatId, message }: { chatId: string; message: string }) => {
    const res = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_API_URL}/chat/${chatId}`,
      { message },
      {
        withCredentials: true,
      }
    );

    return res.data;
  }
);


export const fetchSingleChat = createAsyncThunk<
  { chat: Chat; usageCheck: UsageCheck },
  string
>("chat/fetchSingleChat", async (chatId) => {
  const res = await axiosInstance.get(`/chat/${chatId}`);
  return res.data;
});

export const fetchChatQuestions = createAsyncThunk(
  "chat/fetchChatQuestions",
  async (chatId: string) => {
    const res = await axiosInstance.get(`/chat/questions/${chatId}`);
    return res.data; 
  }
);

export const deleteChat = createAsyncThunk(
  "chat/deleteChat",
  async (chatId: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(
        `/chat/delete/${chatId}`
      );

      return chatId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Delete failed"
      );
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveChat(state, action: PayloadAction<Chat | null>) {
      state.activeChat = action.payload;
    },
    clearChats(state) {
      state.chats = [];
      state.activeChat = null;
    },
    clearQuestions(state) {
      state.questions = [];
      state.questionTitle = "";
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChats.fulfilled, (state, action: PayloadAction<Chat[]>) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch chats";
      })
      .addCase(createChat.fulfilled, (state, action: PayloadAction<Chat>) => {
        state.chats.unshift(action.payload);
        state.activeChat = action.payload;
      })

      .addCase(sendMessage.fulfilled, (state, action) => {
        const updatedChat = action.payload.chat;

        state.chats = state.chats.map((chat) =>
          chat._id === updatedChat._id ? updatedChat : chat
        );

        state.activeChat = updatedChat;
        state.remaining= action.payload.usageCheck.remaining;
      })

      .addCase(fetchSingleChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleChat.fulfilled, (state, action) => {
        state.loading = false;
        state.activeChat = action.payload.chat;
        state.remaining = action.payload.usageCheck.remaining;
      })
      .addCase(fetchSingleChat.rejected, (state) => {
        state.loading = false;
      })

      .addCase(fetchChatQuestions.pending, (state) => {
        state.questionLoading = true;
      })
      .addCase(
        fetchChatQuestions.fulfilled,
        (
          state,
          action: PayloadAction<{ title: string; questions: Message[] }>
        ) => {
          state.questionLoading = false;
          state.questions = action.payload.questions;
          state.questionTitle = action.payload.title;
        }
      )
      .addCase(fetchChatQuestions.rejected, (state) => {
        state.questionLoading = false;
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        state.chats = state.chats.filter(
          (chat) => chat._id !== action.payload
        );

        if (state.activeChat?._id === action.payload) {
          state.activeChat = null;
        }
      });
  },
});

export const { setActiveChat, clearChats, clearQuestions } =
  chatSlice.actions;

export default chatSlice.reducer;
