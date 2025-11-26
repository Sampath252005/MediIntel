import React from "react";

const Header = () => {
  return (
    <header className="h-14 border-b bg-white flex items-center justify-between px-4">
      <h1 className="font-semibold text-lg">Scan App</h1>
      <div className="flex items-center gap-4">
        <input
          placeholder="Search..."
          className="border px-3 py-1 rounded-md"
        />
        <div className="w-8 h-8 rounded-full bg-gray-300"></div>
      </div>
    </header>
  );
};

export default Header;
