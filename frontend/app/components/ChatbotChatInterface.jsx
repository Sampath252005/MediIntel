
import React, { useState } from "react";
import { User2, Search, Link, Send } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {v4 as uuidv4} from "uuid";


const ChatbotChatInterface = () => {
  const[input,setInput]=useState("");
  const router = useRouter();

  const handleSend=()=>{
    if(input.trim()==="") return;
    //create a session id
     const sessionID = uuidv4();
     router.push(`/chatBotPage/${sessionID}?msg=${encodeURIComponent(input)}`);
  }


  return (
    <div>
      <div className="col-span-2 flex flex-col border-r border-gray-300 p-4  ">
        <div className="flex justify-between items-center  z-50 top-0 ">
          <h2 className="text-2xl font-bold mb-4 ">🩺 Medical Chatbot</h2>
          <User2 size={25} color="black" />
        </div>
        <div className="flex flex-col space-y-10">
          <div className="flex flex-col justify-center items-center p-2">
            <Image
              src="/Live chatbot.gif"
              alt="Ai logo"
              width={200}
              height={200}
            />
            <div className="flex flex-col justify-center text-center gap-3">
              <h1 className="text-4xl font-bold">Welcome Back Alex</h1>
              <h2>
                An AI-powered medical chatbot that provides quick, reliable
                health information and guidance
              </h2>
            </div>
          </div>
          <div className="w-full flex justify-center">
            <div className="flex items-center bg-black text-white rounded-full px-4 py-3 w-3/4 shadow-lg">
              <div className="flex items-center space-x-2 mr-3 cursor-pointer p-2 rounded-full bg-gradient-to-r from-blue-400 to-white hover:opacity-90 transition">
                <Link size={18} className="text-white" />
              </div>
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
                value={input}
                onChange={(e)=>setInput(e.target.value)}
              />
              <button className="ml-3 p-2 rounded-full bg-gradient-to-r from-blue-400 to-orange-400 hover:opacity-90 transition" onClick={handleSend}>
                <Send size={25} className="text-black" />
              </button>
            </div>
          </div>
          <div className="flex space-x-20 justify-center items-center  mx-20  bg-gray-500 rounded-3xl p-2 bg-transparent text-white">
            <div className="flex justify-center gap-3 items-center p-5 border-black border-2 text-2xl rounded-3xl bg-black ">
              <span className="p-2  rounded-3xl bg-gray-600 cursor-pointer hover:bg-gray-300 ">
                <Link size={25} className="text-white" />
              </span>
              <span className="text-sm ">Search</span>
            </div>
            <div className=" flex gap-3 p-5 justify-center items-center  border-black  border-2 text-2xl rounded-3xl  bg-black">
              <span className="p-2  rounded-3xl bg-gray-600 cursor-pointer hover:bg-gray-300">
                <Link size={25} className="text-white" />
              </span>
              <span className="text-sm">Search</span>
            </div>
            <div className="flex p-5 gap-3 justify-center items-center   border-2 border-black text-2xl rounded-3xl  bg-black">
               <span className="p-2  rounded-3xl bg-gray-600 cursor-pointer hover:bg-gray-300">
                <Link size={25} className="text-white" />
              </span>
              <span className="text-sm">Search</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotChatInterface;
