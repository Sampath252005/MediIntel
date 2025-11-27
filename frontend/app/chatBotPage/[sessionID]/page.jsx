"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { 
  Send, 
  User, 
  Paperclip, 
  Plus, 
  Bot 
} from "lucide-react";
import ReactMarkdown from "react-markdown"; 

// --- Components ---
import NavBar from "../../components/NavBar";
import ProfileModal from "../../components/ProfileModal";
import ChatBotHistory from "../../components/ChatBotHistory"; // Import History

export default function ChatSessionPage() {
  // --- EXISTING LOGIC ---
  const { sessionID } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const messagesEndRef = useRef(null);
  const firstMessageSentRef = useRef(false);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const loadInitialMessages = async () => {
      if (firstMessageSentRef.current) return;
      try {
        const response = await fetch(`http://localhost:8000/chats/history?sessionId=${sessionID}`, { method: "GET", credentials: "include" });
        const data = await response.json();
        let storedMessages = data.data?.map((msg) => ({
            id: Date.now() + Math.random(),
            sender: msg.type === "human" ? "human" : "ai",
            text: msg.content,
          })) || [];

        const firstMessage = searchParams.get("msg");
        if (firstMessage && storedMessages.length === 0) {
          firstMessageSentRef.current = true;
          const decoded = decodeURIComponent(firstMessage);
          setMessages([{ id: Date.now(), sender: "human", text: decoded }]);
          setIsLoading(true);

          let response1 = await fetch(`http://localhost:8000/chats/${sessionID}?userInput=${encodeURIComponent(decoded)}`, 
          { method: "POST", credentials: "include" });
          if (response1.status === 403 || response1.status === 401) {
        const refreshRes = await fetch("http://localhost:8000/refresh", { method: "POST", credentials: "include" });
        if (!refreshRes.ok) {
          router.push("/login");
          return;
        }
        response1 = await fetch(`http://localhost:8000/chats/${sessionID}?userInput=${encodeURIComponent(decoded)}`,
        { method: "POST", credentials: "include" });
      }
          const data1 = await response1.json();
          setIsLoading(false);

          if (!response1.ok) {
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
      } catch (err) { console.error("Failed to load messages:", err); setMessages([]); }
    };
    loadInitialMessages();
  }, [sessionID, searchParams, router]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), sender: "human", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/chats/${sessionID}?userInput=${encodeURIComponent(input)}`, { method: "POST", credentials: "include" });
       if (response.status === 403 || response.status === 401) {
        const refreshRes = await fetch("http://localhost:8000/refresh", { method: "POST", credentials: "include" });
        if (!refreshRes.ok) {
          router.push("/login");
          return;
        }
        response = await fetch(`http://localhost:8000/chats/${sessionID}?userInput=${encodeURIComponent(decoded)}`,
        { method: "POST", credentials: "include" });
      }
      const data = await response.json();
      setIsLoading(false);
      if (!response.ok) return;
      const botMsg = { id: Date.now() + 1, sender: "ai", text: data.data };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) { console.error("Failed to send message:", err); setIsLoading(false); }
  };

  const handleNewChat = () => { router.push("/chatBotPage"); };

  // --- UI STATE ---
  const [profile, setProfile] = useState({ name: "", email: "", picture: "" });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(true); // Default Open

  useEffect(() => {
    const getProfile = async () => {
      try {
        let response = await fetch("http://localhost:8000/Profile", { method: "GET", credentials: "include" });
        if (response.status === 403 || response.status === 401) {
          const refreshRes = await fetch("http://localhost:8000/refresh", { method: "POST", credentials: "include" });
          if (!refreshRes.ok) { router.push("/login"); return; }
          response = await fetch("http://localhost:8000/Profile", { method: "GET", credentials: "include" });
        }
        if (response.ok) setProfile(await response.json());
      } catch (err) { console.log(err); }
    };
    getProfile();
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* --- 1. HISTORY SIDEBAR --- */}
      <ChatBotHistory 
        showHistory={showHistory} 
        toggleShowHistory={() => setShowHistory(!showHistory)} 
      />

      {/* --- 2. MAIN CHAT CONTENT --- */}
      <div className={`flex-1 flex flex-col h-full transition-all duration-300 ease-in-out ${showHistory ? 'ml-80' : 'ml-0'}`}>
        
        {/* Navbar */}
        <div className="flex-shrink-0 z-30">
          <NavBar user={profile} onProfileClick={() => setIsProfileOpen(true)} />
        </div>

        {/* Chat Layout Container */}
        <div className="flex-1 flex flex-col max-w-5xl w-full mx-auto relative overflow-hidden">
          
          {/* Scrollable Messages */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 space-y-6">
            
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 shadow-sm">
                  <Bot size={40} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Medical Assistant</h3>
                  <p className="text-slate-500">I am ready to help. Start chatting below.</p>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex w-full ${msg.sender === "human" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${msg.sender === "human" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm
                      ${msg.sender === "human" ? "bg-teal-600 text-white" : "bg-white border border-slate-200 text-teal-600"}`}
                    >
                      {msg.sender === "human" ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm
                      ${msg.sender === "human" 
                        ? "bg-teal-600 text-white rounded-tr-none" 
                        : "bg-white border border-slate-200 text-slate-700 rounded-tl-none"}`}
                    >
                      {msg.sender === "ai" ? (
                        <div className="prose prose-sm prose-slate max-w-none prose-p:my-1 prose-headings:text-slate-800 prose-strong:text-slate-900">
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      ) : ( msg.text )}
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start w-full">
                <div className="flex gap-3 max-w-[75%]">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-teal-600 mt-1 shadow-sm">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                     <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                     <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                     <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <div className="max-w-3xl mx-auto flex items-end gap-2 bg-white p-2 rounded-3xl border border-slate-300 shadow-lg focus-within:ring-2 focus-within:ring-teal-500/50 focus-within:border-teal-500 transition-all">
              
              <button onClick={handleNewChat} className="p-3 rounded-full hover:bg-slate-100 text-slate-500 transition" title="Start New Chat">
                <Plus size={20} />
              </button>

              <button className="p-3 rounded-full hover:bg-slate-100 text-slate-500 transition hidden sm:block">
                <Paperclip size={20} />
              </button>

              <textarea
                placeholder="Type your health query..."
                className="flex-1 max-h-32 min-h-[44px] bg-transparent border-none outline-none text-slate-700 placeholder-slate-400 py-3 px-2 resize-none"
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if(e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
              />

              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className={`p-3 rounded-full mb-1 transition-all duration-200 
                  ${input.trim() ? "bg-teal-600 text-white hover:bg-teal-700 shadow-md" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-center text-xs text-slate-400 mt-2">
              DermaGuard AI can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </div>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} user={profile} />
    </div>
  );
}