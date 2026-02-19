"use client";

import ReactMarkdown from "react-markdown";

export default function MessageBubble({ msg }: any) {
  return (
    <div
      className={`px-4 py-2 rounded-2xl w-fit max-w-[85%] break-words overflow-hidden
        ${msg.role === "user" ? "bg-blue-600 ml-auto text-white" : "bg-gray-800 text-gray-100"}`}
    >
      <ReactMarkdown
        components={{
          p({ children }) {
            return <div>{children}</div>;
          },
          code({ inline, children, ...props }: any) {
            if (inline) {
              return (
                <code className="bg-black/70 px-1 py-0.5 rounded text-xs sm:text-sm break-words">
                  {children}
                </code>
              );
            }
            return (
              <div className="w-full rounded-lg">
                <pre className="w-full overflow-x-auto bg-black p-3 text-xs sm:text-sm whitespace-pre">
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
