import React from "react";
import { PencilRuler, WalletCards, MoveHorizontal, Search } from "lucide-react";

const history = [
  "Learn React",
  "Build Project",
  "Deploy App",
  "Learn React",
  "Build Project",
  "Deploy App",
  "Learn React",
  "Build Project",
  "Deploy App",
  "Learn React",
  "Build Project",
  "Deploy App",
  "Learn React",
  "Build Project",
  "Deploy App",
  "Learn React",
  "Build Project",
  "Deploy App",
];

const ChatBotHistory = () => {
  return (
    <div className="text-white px-8 py-5 flex flex-col space-y-10 h-screen">
      {/* Top Icons */}
      <div className="flex justify-between">
        <div className="flex space-x-10">
          <PencilRuler size={20} />
          <WalletCards size={20} />
        </div>
        <MoveHorizontal size={20} />
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
          className="bg-gray-200 text-black w-full rounded-2xl min-h-14 pl-12 pr-4 text-center focus:outline-none"
        />
      </div>
      <h1 className="text-white text-sm font-bold p-2">History</h1>

      {/* History List with invisible scrollbar */}
      <div className="overflow-y-scroll  scrollbar-hide">
        <div className="space-y-4">
          {history.map((item, index) => (
            <div
              key={index}
              className="p-2 bg-slate-600 text-lg rounded-2xl text-white"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none; 
          scrollbar-width: none; 
      `}</style>
    </div>
  );
};

export default ChatBotHistory;
