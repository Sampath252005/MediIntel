"use client";
import React, { useState, useEffect } from "react";
import ChatBotHistory from "../components/ChatBotHistory";
import ChatBotChatInterface from "../components/ChatbotChatInterface";
import { MoveHorizontal } from "lucide-react";
// import { motion } from "framer-motion";
// import { Trash2 } from "lucide-react";

const chatBotPage = () => {

  
  return (
      <div 
       className="h-screen"
      >
        <ChatBotChatInterface />
      </div>


  );
}

export default chatBotPage;
