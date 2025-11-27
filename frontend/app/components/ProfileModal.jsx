"use client"

import React from 'react';
import { X, LogOut } from 'lucide-react'; // Added LogOut icon
import { useRouter } from 'next/navigation'; // Added Router for redirect
import Link from 'next/link';

const ProfileModal = ({ isOpen, onClose, user }) => {
  const router = useRouter();

  // If the modal isn't open, don't render anything
  if (!isOpen) return null;

  // --- INTERNAL LOGOUT LOGIC ---
  const handleLogout = async () => {
    const response = await fetch("http://localhost:8000/logout", {
          method: "POST",
          credentials: "include",
        });

    console.log(await response.json());
    router.push('/login')
    onClose()
    // In a real app, this would clear authentication tokens
  };

  // Helper specific to this component (Large Image)
  const renderLargeProfileImage = () => {
    if (user.avatar) {
      return (
        <img 
          src={user.avatar} 
          alt="Profile" 
          className="w-24 h-24 text-3xl rounded-full object-cover border-2 border-white shadow-md"
        />
      );
    }
    const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";
    return (
      <div className="w-24 h-24 text-3xl bg-teal-600 text-white flex items-center justify-center rounded-full font-bold border-2 border-white shadow-md select-none">
        {initial}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      {/* Modal Content */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:text-slate-200 transition"
        >
          <X size={24} />
        </button>

        {/* Header / Banner */}
        <div className="h-24 bg-gradient-to-r from-teal-500 to-blue-600"></div>

        {/* Profile Info */}
        <div className="px-6 pb-8 text-center relative">
          <div className="flex justify-center -mt-12 mb-4">
            {renderLargeProfileImage()}
          </div>

          <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
          <p className="text-slate-500 font-medium mb-6">{user.email}</p>

          {/* Action Buttons Stack */}
          <div className="flex flex-col gap-3 w-full">
            
            {/* My Scans */}
            <Link href="/history">
            <button className="w-full py-2.5 px-4 bg-teal-50 text-teal-700 font-semibold rounded-lg hover:bg-teal-100 transition shadow-sm border border-teal-100">
              My Scans
            </button>
            </Link>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="w-full py-2.5 px-4 flex items-center justify-center gap-2 text-red-600 font-medium rounded-lg hover:bg-red-50 transition border border-transparent hover:border-red-100"
            >
              <LogOut size={18} />
              Logout
            </button>
            
          </div>
        </div>
      </div>
      
      {/* Click outside to close */}
      <div 
        className="absolute inset-0 -z-10" 
        onClick={onClose}
      ></div>
    </div>
  );
};

export default ProfileModal;