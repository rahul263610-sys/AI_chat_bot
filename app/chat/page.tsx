"use client";

import { useState, useEffect } from "react";
import ChatWindow from "@/components/ChatWindow";
import ChatInput from "@/components/ChatInput";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import { sendMessage, createChat } from "@/redux/slices/chatSlice";

export default function ChatPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { activeChat } = useSelector((state: RootState) => state.chat);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeChat && activeChat?.messages?.length >= 20) {
      setShowLimitModal(true);
    }
  }, [activeChat]);
  const handleSendMessage = async () => {
    if ( !input) return;
    setLoading(true);

    let chatId: string;

    if (activeChat?._id) {
      chatId = activeChat._id;
    } else {
      const newChat = await dispatch(createChat()).unwrap();
      chatId = newChat._id; 
    }
    await dispatch(sendMessage({ chatId, message: input }));

    setInput("");
    setLoading(false);
  };

  return (
   <div className="flex flex-col h-full min-h-0"> 
      <ChatWindow activeChat={activeChat} />
      <div className="mt-auto">
        <ChatInput
          input={input}
          setInput={setInput}
          sendMessage={handleSendMessage}
          loading={loading}
          activeChat={activeChat}
        />
      </div>
      {showLimitModal && (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
       <div className="bg-gray-900 p-6 rounded-xl w-[90%] max-w-md text-center space-y-4 mx-4">
          <h2 className="text-xl font-bold">
            Message Limit Reached
          </h2>

          <p className="text-gray-400 text-sm">
            You’ve reached the message limit for this chat.
            Please create a new chat to continue.
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={async () => {
                const res = await dispatch(createChat()).unwrap();
                setShowLimitModal(false);
              }}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Create New Chat
            </button>

            <button
              onClick={() => setShowLimitModal(false)}
              className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}
