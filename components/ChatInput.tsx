"use client";
import { useRemaining } from "@/hooks/useRemaining";
import { useEffect } from "react";
import { useRef, useState } from "react";
import { useMode } from "@/hooks/useMode";
import ConfirmModal from "./ui/ConfirmModal";

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
  const [showRemainingModal, setShowRemainingModal]= useState(false);
  const mode = useMode();
  const remaining = useRemaining();

  const message =
    remaining === 0
      ? `Free plan limit reached (25 messages/day). Please upgrade to Pro for unlimited access.`
      : `You have ${remaining} messages remaining today.`;

  useEffect(() => {
    if (remaining !== null && remaining <= 3) {
      setShowRemainingModal(true);
    }
  }, [remaining]);

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    const maxHeight = 24 * 10;
    el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
  };

  const isLimitReached = activeChat?.messages?.length >= 20;

  return (
    <div className={`border-t px-3 py-3 ${mode === "dark" ? "border-gray-800 bg-black" : "border-gray-200 bg-white"}`}>
      <div className="max-w-4xl mx-auto w-full">
        {isLimitReached ? (
          <div className={`border p-3 rounded-lg text-center ${mode === "dark" ? "bg-red-600/20 border-red-600 text-red-400" : "bg-red-100 border-red-300 text-red-600"}`}>
            You've reached the message limit for this chat. Please create a new
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
              className={`flex-1 p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 overflow-y-auto ${mode === "dark" ? "bg-gray-800 text-white placeholder-gray-400" : "bg-gray-100 text-black placeholder-gray-500"}`}
              placeholder="Ask anything..."
            />

            <button
              onClick={sendMessage}
              disabled={loading || remaining===0}
              className="bg-blue-600 px-6 h-[48px] rounded-lg disabled:opacity-50 hover:bg-blue-700 transition self-end cursor-pointer disabled:cursor-not-allowed text-white"
            >
              {loading ? "Responding..." : "Send"}
            </button>
          </div>
        )}
      </div>
      {showRemainingModal && 
        <ConfirmModal
          isOpen={showRemainingModal}
          title="Today Limit"
          description={message}
          cancelText="Close"
          onCancel={()=> setShowRemainingModal(false)}
        />
      }
    </div>
  );
}
