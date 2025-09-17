"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    setHistory(savedHistory);
  }, []);

  // Save history whenever it updates
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(history));
  }, [history]);

  // Handle sending a message
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setHistory((prev) => [...prev, input]);

    // Simulated AI response (replace with Gemini / API call)
    const aiMessage = {
      role: "ai",
      text: `🤖 Medical AI response for: "${input}"`,
    };

    setMessages((prev) => [...prev, aiMessage]);
    setInput("");
  };

  // Clear history
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("chatHistory");
  };

  return (
    <div className="grid grid-cols-3 h-screen font-['PT_Sans']">
      {/* Left: Chatbot */}
      <div className="col-span-2 flex flex-col border-r border-gray-300 p-4">
        <h2 className="text-2xl font-bold mb-4">🩺 Medical Chatbot</h2>

        <div className="flex-1 overflow-y-auto bg-white rounded-xl p-4 shadow">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`mb-2 p-2 rounded-lg max-w-[75%] ${
                msg.role === "user"
                  ? "bg-cyan-100 self-end text-right ml-auto"
                  : "bg-purple-100 self-start text-left mr-auto"
              }`}
            >
              {msg.text}
            </motion.div>
          ))}
        </div>

        <div className="flex mt-4">
          <input
            type="text"
            value={input}
            placeholder="Enter your symptoms or questions..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            onClick={handleSend}
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>

      {/* Right: History */}
      <div className="flex flex-col p-4 bg-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Search History</h3>
          <button
            onClick={clearHistory}
            className="p-2 rounded-full hover:bg-gray-200"
            title="Clear history"
          >
            <Trash2 size={18} />
          </button>
        </div>
        <ul className="mt-4 space-y-2">
          {history.map((item, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="border-b pb-1 text-gray-700"
            >
              {item}
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
