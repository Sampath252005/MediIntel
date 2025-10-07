"use client";
import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Send, User2, Link } from "lucide-react";
import Image from "next/image";

export default function ChatSessionPage() {
  const { sessionID } = useParams();
  const searchParams = useSearchParams();
  const firstMessage = searchParams.get("msg");

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Load the first message (from navigation query)
  useEffect(() => {
    if (firstMessage) {
      setMessages([{ sender: "user", text: firstMessage }]);
    }
  }, [firstMessage]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user's message
    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // Simulate AI reply (you’ll replace this later with backend)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `You said: "${newMessage.text}"` },
      ]);
    }, 800);
  };

  return (
    <div className="flex flex-col border-r border-gray-300 p-4 h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-4">🩺 Medical Chatbot</h2>
        <User2 size={25} color="black" />
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent rounded-xl">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-full text-gray-600">
            <Image
              src="/Live chatbot.gif"
              alt="AI Logo"
              width={200}
              height={200}
              className="mb-4"
            />
            <p>Start chatting with your medical assistant 👩‍⚕️</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-2xl max-w-xs ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="mt-4 w-full flex justify-center">
        <div className="flex items-center bg-black text-white rounded-full px-4 py-3 w-3/4 shadow-lg">
          <div className="flex items-center space-x-2 mr-3 cursor-pointer p-2 rounded-full bg-gradient-to-r from-blue-400 to-orange-400 hover:opacity-90 transition">
            <Link size={18} className="text-white" />
          </div>

          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          <button
            className="ml-3 p-2 rounded-full bg-gradient-to-r from-blue-400 to-orange-400 hover:opacity-90 transition"
            onClick={handleSend}
          >
            <Send size={25} className="text-black" />
          </button>
        </div>
      </div>
    </div>
  );
}
