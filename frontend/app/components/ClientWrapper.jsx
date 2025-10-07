"use client";
import React, { useState } from "react";
import ChatBotHistory from "./ChatBotHistory";
import { MoveHorizontal } from "lucide-react";

const 
ClientWrapper = ({ children }) => {
  const [showHistory, setShowHistory] = useState(true);

  const toggleShowHistory = () => setShowHistory(!showHistory);
  return (
    <div className="flex">
      {showHistory && (
        <ChatBotHistory
          showHistory={showHistory}
          toggleShowHistory={toggleShowHistory}
        />
      )}

      <div
        className={`${
          showHistory ? "w-3/4" : "w-full"
        }  bg-gradient-to-r from-sky-300 to-orange-300 transition-all duration-500`}
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
