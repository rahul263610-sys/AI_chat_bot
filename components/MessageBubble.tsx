"use client";

import ReactMarkdown from "react-markdown";
import { useMode } from "@/hooks/useMode";

export default function MessageBubble({ msg }: any) {
  const mode = useMode();

  return (
    <div
      className={`px-4 py-2 rounded-2xl w-fit max-w-[85%] break-words overflow-hidden 
        ${
          msg.role === "user"
            ? "bg-blue-600 ml-auto text-white"
            : mode === "dark" 
              ? "bg-gray-800 text-gray-100" 
              : "bg-gray-200 text-gray-900"
        }`}
    >
      <ReactMarkdown
        components={{
          p({ children }) {
            return <div>{children}</div>;
          },
          code({ inline, children, ...props }: any) {
            if (inline) {
              return (
                <code className={`px-1 py-0.5 rounded text-xs sm:text-sm break-words ${mode === "dark" ? "bg-black/70" : "bg-gray-400"}`}>
                  {children}
                </code>
              );
            }
            return (
              <div className="w-full rounded-lg">
                <pre className={`w-full overflow-x-auto p-3 text-xs sm:text-sm whitespace-pre ${mode === "dark" ? "bg-black" : "bg-gray-300"}`}>
                  <code {...props}>{children}</code>
                </pre>
              </div>
            );
          },
        }}
      >
        {msg.content}
      </ReactMarkdown>
    </div>
  );
}
