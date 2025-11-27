"use client"

import React, { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import ProfileModal from './components/ProfileModal';
import { 
  X, 
  ScanLine, 
  History, 
  MessageCircle, 
  Layers 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const HomePage = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profile, setProfile] = useState({name: "",email: "",picture: ""});
  const router = useRouter();

  const getProfile = async () => {
    try {
      let response = await fetch("http://localhost:8000/Profile",{
        method: "GET",
        credentials: "include",
      });

      console.log(response);

      if (response.status === 403 || response.status === 401) {
        const refreshRes = await fetch("http://localhost:8000/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (!refreshRes.ok) {
          console.warn("Refresh token invalid or expired");
          router.push("/login");
          return;
        }

        response = await fetch("http://localhost:8000/Profile", {
          method: "GET",
          credentials: "include",
        });
      }

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getProfile()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 relative">
      
      {/* --- REUSABLE NAVBAR COMPONENT --- */}
      <NavBar 
        user={profile} 
        onProfileClick={() => setIsProfileOpen(true)} 
      />

      {/* --- Hero Section --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-semibold uppercase tracking-wide mb-6">
            <span>AI-Powered Dermatology</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Early Detection for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600">
              Healthier Skin
            </span>
          </h1>
          <p className="text-lg text-slate-600 mb-10 leading-relaxed">
            Utilize advanced AI to classify skin lesions and track changes over time. 
            Compare past scans with current images to monitor improvements and detect potential risks early.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/classification">
            <button className="flex items-center justify-center gap-2 px-8 py-4 bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-500/30 hover:bg-teal-700 hover:scale-105 transition transform">
              <ScanLine size={20} />
              Start Scan
            </button>
            </Link>
            <Link href="/comparison">
            <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold shadow-sm hover:bg-slate-50 hover:border-teal-300 transition">
              <Layers size={20} />
              Run Comparison
            </button>
            </Link>
          </div>
        </div>

        {/* --- Feature Grid --- */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
              <ScanLine size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">AI Classification</h3>
            <p className="text-slate-600">Upload an image of a skin lesion. Our deep learning model analyzes texture and color to provide an instant risk assessment.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4">
              <History size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Smart Comparison</h3>
            <p className="text-slate-600">See the difference. We overlay your old image with the new one to highlight healing progress or concerning changes.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Medical Chatbot</h3>
            <p className="text-slate-600">Have questions about symptoms? Chat with our AI assistant trained on dermatological data for instant guidance.</p>
          </div>
        </div>
      </main>

      {/* --- Profile Modal Overlay --- */}
      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        user={profile} 
      />

    </div>
  );
};

export default HomePage;