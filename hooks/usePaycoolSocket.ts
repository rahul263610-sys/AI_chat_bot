"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";

export default function usePaycoolSocket() {

  useEffect(() => {
    const socket = io("https://paycoolbackend.onrender.com", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      socket.emit("joinRoom", "6997fd039a3f0300d83e0167");
    });

    socket.on("payment.status.updated", (data) => {
      console.log("Payment Data:", data);
    });

    return () => {
      socket.disconnect();
    };

  }, []);
}