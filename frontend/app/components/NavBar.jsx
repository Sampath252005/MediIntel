import React from 'react';
import { Activity } from 'lucide-react';
import Link from 'next/link';

const NavBar = ({ user, onProfileClick }) => {
  
  // Internal helper to render just the small navbar avatar
  const renderNavAvatar = () => {
    if (user.picture) {
      return (
        <img 
          src={user.picture}
          alt="Profile" 
          className="w-10 h-10 text-sm rounded-full object-cover border-2 border-white shadow-md cursor-pointer hover:opacity-90 transition"
          onClick={onProfileClick}
        />
      );
    }

    // Fallback Initial
    const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";
    return (
      <div 
        onClick={onProfileClick}
        className="w-10 h-10 text-sm bg-teal-600 text-white flex items-center justify-center rounded-full font-bold border-2 border-white shadow-md cursor-pointer hover:bg-teal-700 transition select-none"
      >
        {initial}
      </div>
    );
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white">
              <Activity size={20} />
            </div>
            <span className="font-bold text-xl text-teal-900 tracking-tight">DermaGuard AI</span>
          </div>

          {/* Links */}
          <div className="hidden md:flex space-x-6 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-teal-600 transition">Home</Link>
            <Link href="/classification" className="hover:text-teal-600 transition">Skin Cancer Classification</Link>
            <Link href="/comparison" className="hover:text-teal-600 transition">Comparison</Link>
            <Link href="/chatBotPage" className="hover:text-teal-600 transition">Chatbot</Link>
            <Link href="/history" className="hover:text-teal-600 transition">History</Link>
            <Link href="/about" className="hover:text-teal-600 transition">About</Link>
            <Link href="/contact" className="hover:text-teal-600 transition">Contact</Link>
          </div>

          {/* Profile Trigger */}
          <div className="flex items-center">
            {renderNavAvatar()}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;