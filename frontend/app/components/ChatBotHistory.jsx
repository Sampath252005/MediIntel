import React from "react";
import { PencilRuler, WalletCards, MoveHorizontal, Search } from "lucide-react";
import { motion } from "framer-motion";

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

const ChatBotHistory = ({ toggleShowHistory, showHistory }) => {
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
            <PencilRuler size={20}  className="cursor-pointer hover:scale-75"/>
            <WalletCards size={20} className="cursor-pointer hover:scale-75" />
          </div>
          <MoveHorizontal size={20} className="cursor-pointer hover:scale-75" onClick={toggleShowHistory} />
        </div>

        {/* Search Bar */}
        <div className="relative w-full  p-2">
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

        {/* History List */}
        <div className="overflow-y-scroll scrollbar-hide flex-1">
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
