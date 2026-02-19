"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
// import { useEffect } from "react";
// import { getCurrentUser } from "@/redux/slices/authSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function InitAuth({ children }: { children: React.ReactNode }) {
  // useEffect(() => {
  //   store.dispatch(getCurrentUser());
  // }, []);

  return <>{children}</>;
}

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <InitAuth>
        {children}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
      </InitAuth>
    </Provider>
  );
}
