"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { activateFreePlan, upgradePlan } from "@/redux/slices/subscriptionSlice";
import type { AppDispatch } from "@/redux/store";
import { useSubscription } from "@/hooks/useSubscription";
export default function ChoosePlanPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const handleFree = async () => {
      await dispatch(activateFreePlan()).unwrap();
      router.replace("/chat");
  };

  const {isFree, isPremium} = useSubscription();
  const handlePremium = async() => {
    await dispatch(upgradePlan()).unwrap();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-6">

      <h1 className="text-4xl font-bold mb-3 text-gray-900">
        Choose Your Plan
      </h1>

      <p className="text-gray-700 mb-10 text-lg">
        Start free and upgrade anytime 🚀
      </p>
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div
          className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200
                     hover:shadow-2xl hover:-translate-y-2
                     transition-all duration-300"
        >
          <h2 className="text-xl font-semibold mb-2 text-gray-900">
            🆓 Free Plan
          </h2>

          <p className="text-3xl font-bold mb-6 text-gray-900">
            ₹0
          </p>

          <ul className="space-y-3 text-gray-700 mb-6">
            <li>✔ 25 messages/day</li>
            <li>✔ Have short chats for common questions</li>
            <li>✔ Limited features</li>
          </ul>

          <button
            onClick={handleFree}
             disabled={isPremium || isFree}
            className="w-full bg-gray-900 text-white py-3 rounded-xl
              hover:bg-black transition duration-300 cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Free
          </button>
        </div>
        <div className="bg-indigo-600 text-white rounded-2xl shadow-lg p-8 relative hover:scale-105 transition">
          <span className="absolute top-4 right-4 bg-white text-indigo-600 text-xs px-3 py-1 rounded-full font-medium">
            Most Popular
          </span>

          <h2 className="text-xl font-semibold mb-2">
            💎 Premium Plan
          </h2>

          <p className="text-3xl font-bold mb-6">
            ₹499 / month
          </p>

          <ul className="space-y-3 mb-6">
            <li>✔ Unlimited messages</li>
            <li>✔ GPT-5.3 Model</li>
            <li>✔ Faster responses</li>
            <li>✔ Have long chats over multiple sessions</li>
            <li>✔ File uploads</li>
          </ul>

          <button
            onClick={handlePremium}
            disabled={isPremium}
            className="cursor-pointer w-full bg-white text-indigo-600 py-3 rounded-xl font-semibold
               hover:bg-gray-100 transition
               disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Upgrade Now
          </button>
        </div>

      </div>
    </div>
  );
}