"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Send, User2, Link, Plus } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown"; // ✅ Import react-markdown

export default function ChatSessionPage() {
  const { sessionID } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const messagesEndRef = useRef(null);
  const firstMessageSentRef = useRef(false);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Scroll to bottom on messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load initial messages including first message handling
  useEffect(() => {
    const loadInitialMessages = async () => {
      if (firstMessageSentRef.current) return;

      try {
        const response = await fetch(
          `http://localhost:8000/chats/history?sessionId=${sessionID}`,
          { method: "GET", credentials: "include" }
        );
        const data = await response.json();

        let storedMessages =
          data.data?.map((msg) => ({
            id: Date.now() + Math.random(),
            sender: msg.type === "human" ? "human" : "ai",
            text: msg.content,
          })) || [];

        const firstMessage = searchParams.get("msg");

        if (firstMessage && storedMessages.length === 0) {
          firstMessageSentRef.current = true;

          const decoded = decodeURIComponent(firstMessage);

          const response1 = await fetch(
            `http://localhost:8000/chats/${sessionID}?userInput=${encodeURIComponent(
              decoded
            )}`,
            { method: "POST", credentials: "include" }
          );
          const data1 = await response1.json();

          if (!response1.ok) {
            console.log("Error sending first message:", data1);
            alert("Sorry! Try again later.");
            setMessages([]);
            return;
          }

          const newMessages = [
            { id: Date.now(), sender: "human", text: decoded },
            { id: Date.now() + 1, sender: "ai", text: data1.data },
          ];

          router.replace(`/chatBotPage/${sessionID}`, { scroll: false });
          setMessages(newMessages);
          return;
        }

        setMessages(storedMessages);
      } catch (err) {
        console.error("Failed to load messages:", err);
        setMessages([]);
      }
    };

    loadInitialMessages();
  }, [sessionID, searchParams, router]);

  // Send new message
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), sender: "human", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const response = await fetch(
        `http://localhost:8000/chats/${sessionID}?userInput=${encodeURIComponent(
          input
        )}`,
        { method: "POST", credentials: "include" }
      );
      const data = await response.json();

      if (!response.ok) {
        console.log("Error sending message:", data);
        return;
      }

      const botMsg = { id: Date.now() + 1, sender: "ai", text: data.data };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleNewChat = () => {
    router.push("/chatBotPage");
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
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "human" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-2xl max-w-xs break-words ${
                  msg.sender === "human"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {/* ✅ Render Markdown for AI messages */}
                {msg.sender === "ai" ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="mt-4 w-full flex justify-center">
        <div className="flex items-center bg-black text-white rounded-full px-4 py-3 w-3/4 shadow-lg">
          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="flex items-center justify-center mr-3 p-2 rounded-full bg-gradient-to-r from-green-400 to-teal-400 hover:opacity-90 transition"
            title="Start New Chat"
          >
            <Plus size={18} className="text-white" />
          </button>

          {/* Link Icon */}
          <div className="flex items-center space-x-2 mr-3 cursor-pointer p-2 rounded-full bg-gradient-to-r from-blue-400 to-orange-400 hover:opacity-90 transition">
            <Link size={18} className="text-white" />
          </div>

          {/* Input */}
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          {/* Send Button */}
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
