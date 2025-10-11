"use client";
import React, { useState } from "react";
import ChatBotHistory from "./ChatBotHistory";
import { MoveHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";

const ClientWrapper = ({ children }) => {
  const [showHistory, setShowHistory] = useState(true);
  const pathname = usePathname();

  const hideHistoryRoutes = ["/login", "/register", "/"];
  const shouldHideHistory = hideHistoryRoutes.includes(pathname);

  const toggleShowHistory = () => setShowHistory(!showHistory);
  return (
    <div className="flex">
      {!shouldHideHistory && showHistory && (
        <ChatBotHistory
          showHistory={showHistory}
          toggleShowHistory={toggleShowHistory}
        />
      )}

      <div
        className={`${
          shouldHideHistory
            ? "w-full" // 👈 full width for login/register
            : showHistory
            ? "w-3/4"
            : "w-full"
        }  bg-gradient-to-r from-blue-300 to-white transition-all duration-500`}
      >
        {children}{" "}
        {/* 👈 renders either ChatbotChatInterface or ChatSessionPage */}
      </div>

      {!showHistory && (
        <div
          className="fixed top-16 left-0 bg-black text-white p-2 rounded-r-full shadow-md z-50 cursor-pointer hover:-scale-x-75 hover:bg-gray-600"
          onClick={toggleShowHistory}
        >
          <MoveHorizontal size={20} />
        </div>
      )}
    </div>
  );
};

export default ClientWrapper;
