"use client";
import React, { useState, useEffect } from "react";
import {
  PencilRuler,
  WalletCards,
  PanelLeftClose, // Changed icon for better context
  PanelLeftOpen,  // Changed icon for better context
  Search,
  Trash2,
  MessageSquare,
  History
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const ChatBotHistory = ({ toggleShowHistory, showHistory }) => {
  // --- EXISTING LOGIC ---
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Fetch chat history
  const fetchHistory = async () => {
    try {
      // NOTE: Ensure this ID matches your auth user ID logic
      let res = await fetch(`http://localhost:8000/chatHistory/his`,{ method: "GET", credentials: "include" });
      if (res.status === 403 || res.status === 401) {
        const refreshRes = await fetch("http://localhost:8000/refresh", { method: "POST", credentials: "include" });
        if (!refreshRes.ok) {
          router.push("/login");
          return;
        }
        res = await fetch(`http://localhost:8000/chatHistory/his`,{ method: "GET", credentials: "include" });
      }
      if (!res.ok) {
        console.log("Failed to fetch chat history");
        return;
      }
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
      const res = await fetch(
        `http://localhost:8000/chatHistory?sessionId=${sessionId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete chat");
      // Refresh the history from backend after deletion
      router.push('/chatBotPage')
      fetchHistory();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredHistory = history.filter((chat) =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- NEW UI RENDER ---
  return (
    <>
      <motion.div
        animate={{ x: showHistory ? 0 : -340, width: showHistory ? "320px" : "0px" }}
        transition={{ type: "spring", stiffness: 90, damping: 20 }}
        className="fixed inset-y-0 left-0 z-40 h-screen bg-white border-r border-slate-200 flex flex-col shadow-2xl"
      >
        <div className="flex flex-col h-full p-4 w-80">
          
          {/* Header & Icons */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-3">
              <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-teal-600 transition" title="New Chat">
                <PencilRuler size={20} />
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-teal-600 transition" title="Plans">
                <WalletCards size={20} />
              </button>
            </div>
            
            <button 
              onClick={toggleShowHistory}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-teal-600 transition"
            >
              <PanelLeftClose size={20} />
            </button>
          </div>

          {/* Title */}
          <div className="flex items-center gap-2 mb-4 px-2 text-slate-900 font-bold">
            <History size={18} className="text-teal-600" />
            <span>Chat History</span>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 text-slate-700 text-sm rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition"
            />
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((chat) => (
                <div
                  key={chat.session_id}
                  onClick={() => router.push(`/chatBotPage/${chat.session_id}`)}
                  className="group flex justify-between items-center p-3 rounded-xl cursor-pointer transition-all duration-200 border border-transparent hover:bg-teal-50 hover:border-teal-100"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <MessageSquare size={16} className="text-slate-400 group-hover:text-teal-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 truncate">
                      {chat?.title?.length > 25
                        ? chat.title.slice(0, 25) + "..."
                        : chat?.title || "Untitled Chat"}
                    </span>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(chat.session_id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                    title="Delete Chat"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center pt-10 text-slate-400">
                <History size={32} className="mb-2 opacity-50" />
                <p className="text-sm">No chats found</p>
              </div>
            )}
          </div>
          
          {/* Footer Gradient (Optional for visual polish) */}
          <div className="h-4 bg-gradient-to-t from-white to-transparent pointer-events-none -mt-4 z-10"></div>
        </div>
      </motion.div>

      {/* Toggle Button (Visible when sidebar is closed) */}
      {!showHistory && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={toggleShowHistory}
          className="fixed top-4 left-4 z-50 p-3 bg-white text-slate-600 border border-slate-200 rounded-xl shadow-lg hover:text-teal-600 hover:shadow-xl transition-all"
        >
          <PanelLeftOpen size={24} />
        </motion.button>
      )}

      {/* Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e2e8f0;
          border-radius: 20px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
        }
      `}</style>
    </>
  );
};

export default ChatBotHistory;