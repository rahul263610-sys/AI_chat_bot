"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser, getCurrentUser } from "@/redux/slices/authSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const toastId = toast.loading("Logging in...");
      try {
        const res = await dispatch(
          loginUser({ email, password })
        ).unwrap();

        toast.update(toastId, {
          render: "Logged in successfully ✅",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

     router.replace(
      res.role === "Admin"
        ? "/admin/dashboard"
        : "/chat"
    );

      } catch (err: any) {
        const message =
          typeof err === "string"
            ? err
            : err?.message || "Login failed";

        toast.update(toastId, {
          render: message,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });

        setPassword("");
        passwordRef.current?.focus();
      }
    },
    [dispatch, email, password, router]
  );

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const toastId = toast.loading("Creating account...");

    try {
      await dispatch(
        registerUser({ name, email, password })
      ).unwrap();

      toast.update(toastId, {
        render: "Account created successfully ✅ Now you can login",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setIsSignup(false);
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const message =
        typeof err === "string"
          ? err
          : err?.message || "Signup failed";

      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-5">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-br from-indigo-50 to-white p-10 flex flex-col items-center justify-center">
          <img
            src="/images/logo/logo-icon.svg"
            alt="Logo"
            className="w-14 mb-4"
          />
          <p className="text-gray-500 text-center mb-6 text-sm">
            You’ll get smarter responses and can upload files, images, and more.
          </p>
          <img
            src="/images/logo/login_template_front.png"
            alt="Illustration"
            className="w-60 max-w-full"
          />
        </div>

        <div className="p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {isSignup ? "Create your account" : "Sign in to your account"}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {isSignup
              ? "Fill the details below to register"
              : "Enter your credentials below"}
          </p>

          <form
            onSubmit={isSignup ? handleSignup : handleLogin}
            className="space-y-4"
          >
            {isSignup && (
              <div className="flex flex-col">
                <label className="text-gray-700 text-sm mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-black"
                  required
                />
              </div>
            )}
            <div className="flex flex-col">
              <label className="text-gray-700 text-sm mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-black"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 text-sm mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                ref={passwordRef}
                className="p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-black"
                required
              />
            </div>
            {isSignup && (
              <div className="flex flex-col">
                <label className="text-gray-700 text-sm mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  className="p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-black"
                  required
                />
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-all"
            >
              {isSignup
                ? "Sign Up"
                : loading
                ? "Logging in..."
                : "Login"}
            </button>
            {error && !isSignup && (
              <p className="text-red-500 text-center text-sm mt-2">
                {error}
              </p>
            )}
            <p className="text-center text-sm text-gray-600 mt-4">
              {isSignup
                ? "Already have an account?"
                : "Don't have an account?"}
              <button
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                className="ml-2 text-indigo-600 font-medium hover:underline cursor-pointer"
              >
                {isSignup ? "Sign In" : "Sign Up"}
              </button>
            </p>
            {!isSignup && (
              <>
                <div className="flex items-center my-4">
                  <hr className="flex-1 border-gray-300" />
                  <span className="mx-3 text-gray-400 text-sm">
                    OR
                  </span>
                  <hr className="flex-1 border-gray-300" />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    signIn("google", {
                      callbackUrl: "/api/auth/googleLogin",
                    })
                  }
                  className="cursor-pointer w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-3 bg-white text-black hover:shadow-md transition-all"
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  Continue with Google
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
