"use client";

import { useRouter } from "next/navigation";
import usePaycoolSocket from "@/hooks/usePaycoolSocket";
import { useState } from "react";
import Loader from "@/components/ui/Loader";

export default function SuccessPage() {
  const [success, setSuccess]= useState(false);
  const router = useRouter();
  const paycool_id= process.env.PAYCOOL_ID;
  console.log("paycool_id", paycool_id)
  usePaycoolSocket();
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white">
        <div className="bg-white text-black p-10 rounded-2xl shadow-2xl text-center max-w-md">
          
          <h1 className="text-3xl font-bold mb-4">
            {success ?" 🎉 Payment Successful!" : "Processing your payment..."}
          </h1>

          <p className="mb-6 text-gray-600">
            {success     
              ? "Your Premium plan is now active.You can now enjoy unlimited AI chats and premium features."
              : "Please wait while we confirm your transaction."
            }
          </p>

          {success ?
            <button
              onClick={() => router.push("/chat")}
              className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition cursor-pointer"
            >
              Go to Chat 🚀
            </button>
          : <Loader />
          }

        </div>
      </div>
  </>
  );
}