"use client";

import { useRef } from "react";

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  sendMessage: () => void;
  loading: boolean;
  activeChat: any;
}

export default function ChatInput({
  input,
  setInput,
  sendMessage,
  loading,
  activeChat,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    const maxHeight = 24 * 10;
    el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
  };

  const isLimitReached = activeChat?.messages?.length >= 20;

  return (
    <div className="border-t border-gray-800 bg-black px-3 py-3">
      <div className="max-w-4xl mx-auto w-full">
        {isLimitReached ? (
          <div className="bg-red-600/20 border border-red-600 text-red-400 p-3 rounded-lg text-center">
            You’ve reached the message limit for this chat. Please create a new
            chat to continue.
          </div>
        ) : (
          <div className="flex gap-2 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                handleInput();
              }}
              rows={1}
              className="flex-1 bg-gray-800 p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 overflow-y-auto"
              placeholder="Ask anything..."
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-blue-600 px-6 h-[48px] rounded-lg disabled:opacity-50 hover:bg-blue-700 transition self-end cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? "Responding..." : "Send"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
