"use client";

import { useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchSubscription } from "@/redux/slices/subscriptionSlice";
import { useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
export const useSubscription = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.subscription
  );
   useEffect(() => {
    if (!data) {
      dispatch(fetchSubscription());
    }
  }, [dispatch, data]);

  return {
    subscription: data,
    loading,
    error,
    isFree: data?.plan === "free",
    isPremium: data?.plan === "premium",
    isPending:
      data?.plan === "null" && data?.status !== "active",
  };
};