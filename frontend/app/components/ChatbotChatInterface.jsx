"use client"

import React, { useState, useEffect } from "react";
import { 
  Send, 
  Bot, 
  Sparkles, 
  Pill, 
  Stethoscope, 
  Activity 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

// --- Components ---
import NavBar from "./NavBar"; 
import ProfileModal from "./ProfileModal"; 
import ChatBotHistory from "./ChatBotHistory"; // Import History Component

const ChatbotChatInterface = () => {
  // --- EXISTING LOGIC ---
  const [input, setInput] = useState("");
  const router = useRouter();

  const handleSend = () => {
    if (input.trim() === "") return;
    const sessionID = uuidv4();
    router.push(`/chatBotPage/${sessionID}?msg=${encodeURIComponent(input)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  // --- UI STATE ---
  const [profile, setProfile] = useState({ name: "", email: "", picture: "" });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(true); // Default to open for desktop

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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex">
      
      {/* --- 1. HISTORY SIDEBAR --- */}
      <ChatBotHistory 
        showHistory={showHistory} 
        toggleShowHistory={() => setShowHistory(!showHistory)} 
      />

      {/* --- 2. MAIN CONTENT WRAPPER --- */}
      {/* adjusts margin based on sidebar state */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${showHistory ? 'ml-80' : 'ml-0'}`}>
        
        <NavBar user={profile} onProfileClick={() => setIsProfileOpen(true)} />

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 flex flex-col items-center justify-center">
          
          {/* Hero Section */}
          <div className="flex flex-col items-center text-center space-y-6 mb-12 animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-slate-100">
               <Bot size={48} className="text-teal-600" />
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-extrabold text-slate-900">
                Welcome Back, <span className="text-teal-600">{profile.name ? profile.name.split(' ')[0] : 'User'}</span>
              </h1>
              <p className="text-lg text-slate-500 max-w-xl">
                I am your AI medical assistant. Ask me about symptoms, skin conditions, or general health guidance.
              </p>
            </div>
          </div>

          {/* Input Area */}
          <div className="w-full max-w-2xl relative mb-12">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative flex items-center bg-white rounded-full shadow-xl border border-slate-200 p-2">
                <div className="pl-4 pr-2 text-slate-400">
                  <Sparkles size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Describe your symptoms or ask a question..."
                  className="flex-1 bg-transparent outline-none text-slate-700 placeholder-slate-400 text-lg py-3 px-2"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button 
                  onClick={handleSend}
                  disabled={input.trim() === ""}
                  className={`p-3 rounded-full transition-all duration-300 transform 
                    ${input.trim() === "" 
                      ? 'bg-slate-100 text-slate-300' 
                      : 'bg-teal-600 text-white hover:bg-teal-700 hover:scale-110 shadow-md'}`}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Suggestion Cards */}
          <div className="grid md:grid-cols-3 gap-4 w-full max-w-4xl">
            <button 
              onClick={() => setInput("What are the early signs of melanoma?")}
              className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-300 hover:-translate-y-1 transition-all group"
            >
              <div className="p-3 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-100 transition">
                <Activity size={24} />
              </div>
              <span className="text-sm font-bold text-slate-600 group-hover:text-teal-700">Skin Cancer Signs</span>
            </button>

            <button 
              onClick={() => setInput("How to treat mild sunburn at home?")}
              className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-300 hover:-translate-y-1 transition-all group"
            >
              <div className="p-3 bg-teal-50 text-teal-600 rounded-full group-hover:bg-teal-100 transition">
                <Pill size={24} />
              </div>
              <span className="text-sm font-bold text-slate-600 group-hover:text-teal-700">Treatment Advice</span>
            </button>

            <button 
               onClick={() => setInput("Interpret my skin analysis results")}
               className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-300 hover:-translate-y-1 transition-all group"
            >
              <div className="p-3 bg-purple-50 text-purple-600 rounded-full group-hover:bg-purple-100 transition">
                <Stethoscope size={24} />
              </div>
              <span className="text-sm font-bold text-slate-600 group-hover:text-teal-700">Result Interpretation</span>
            </button>
          </div>

        </main>
      </div>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} user={profile} />
    </div>
  );
};

export default ChatbotChatInterface;