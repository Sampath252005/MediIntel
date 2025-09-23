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
const chatBotHistory = () => {
  return (
    <div className="text-white px-8 py-5 flex flex-col space-y-10">
      <div className="flex justify-between">
        <div className="flex space-x-10">
          <span>
            <PencilRuler size={20} />
          </span>
          <span>
            <WalletCards size={20} />
          </span>
        </div>
        <div>
          <span>
            <MoveHorizontal size={20} />
          </span>
        </div>
      </div>
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
      <div className="overflow-y-hidden">
        <h1 className="text white text-sm font-bold">History</h1>
        <div className="space-y-4">
          {history.map((history, index) => (
            <div
              key={index}
              className="p-2  bg-slate-600 text-lg rounded-2xl text-white space-y-2"
            >
              {history}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default chatBotHistory;
