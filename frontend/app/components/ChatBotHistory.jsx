"use client";
import React, { useState, useEffect } from "react";
import { PencilRuler, WalletCards, MoveHorizontal, Search, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const ChatBotHistory = ({ toggleShowHistory, showHistory}) => {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Fetch chat history
  const fetchHistory = async () => {
    try {
      const res = await fetch(`http://localhost:8000/chatHistory/1`);
      if (!res.ok) throw new Error("Failed to fetch chat history");
      const data = await res.json();
      setHistory(data.data);
    } catch (err) {
      console.error(err);
      setHistory([]);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Delete a chat
  const handleDelete = async (sessionId) => {
    try {
      const res = await fetch(`http://localhost:8000/chatHistory?sessionId=${sessionId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete chat");
      // Refresh the history from backend after deletion
      fetchHistory();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredHistory = history.filter(chat =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <motion.div
        animate={{ x: showHistory ? 0 : -340 }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
        className="relative bg-black text-white p-6 h-screen flex flex-col space-y-6 w-1/4 z-10"
      >
        {/* Top Icons */}
        <div className="flex justify-between">
          <div className="flex space-x-10">
            <PencilRuler size={20} className="cursor-pointer hover:scale-75" />
            <WalletCards size={20} className="cursor-pointer hover:scale-75" />
          </div>
          <MoveHorizontal size={20} className="cursor-pointer hover:scale-75" onClick={toggleShowHistory} />
        </div>

        {/* Search Bar */}
        <div className="relative w-full p-2">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-black"
          />
          <input
            type="text"
            placeholder="Search History"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-200 text-black w-full rounded-2xl min-h-14 pl-12 pr-4 text-center focus:outline-none"
          />
        </div>
        <h1 className="text-white text-sm font-bold p-2">History</h1>

        {/* History List */}
        <div className="overflow-y-scroll scrollbar-hide flex-1">
          <div className="space-y-4">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((chat) => (
                <div
                  key={chat.session_id}
                  className="p-2 bg-slate-600 text-lg rounded-2xl flex justify-between items-center cursor-pointer hover:bg-slate-700"
                  onClick={() => router.push(`/chatBotPage/${chat.session_id}`)}
                >
                  <span>{chat.title}</span>
                  <Trash2
                    size={18}
                    className="cursor-pointer hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(chat.session_id);
                    }}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center mt-4">No chats found</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Toggle Button */}
      {!showHistory && (
        <button
          onClick={toggleShowHistory}
          className="fixed top-10 left-0 bg-black text-white p-2 rounded-r-full shadow-md z-50"
        >
          <MoveHorizontal size={100} />
        </button>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default ChatBotHistory;
