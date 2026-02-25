"use client";

import { useState, useEffect } from "react";
import ChatWindow from "@/components/ChatWindow";
import ChatInput from "@/components/ChatInput";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import { sendMessage, createChat } from "@/redux/slices/chatSlice";
import { useSubscription } from "@/hooks/useSubscription";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function ChatPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { activeChat } = useSelector((state: RootState) => state.chat);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const {subscription, isPending} = useSubscription();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    if(isPending){
      router.replace("/choose-plan");
    }
  }, [router]);

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

  const createNewChat = async()=>{
      await dispatch(createChat()).unwrap();
      setShowLimitModal(false);
  }
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
      <ConfirmModal
        isOpen={showLimitModal} 
        title="Message Limit Reached"
        description=" You’ve reached the message limit for this chat. Please create a new chat to continue."
        confirmText="Create New Chat"
        cancelText="Cancel"
        onConfirm={createNewChat}
        onCancel={()=>setShowLimitModal(false)}
        variant="default"
      />
    </div>
  );
}
