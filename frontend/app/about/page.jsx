"use client"

import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import ProfileModal from '../components/ProfileModal';
import { 
  ShieldCheck, 
  Cpu, 
  Users, 
  Target, 
  ArrowRight,
  Heart
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const AboutPage = () => {
  // --- AUTH & STATE ---
  const [profile, setProfile] = useState({ name: "", email: "", picture: "" });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Reusing your auth logic to keep navbar consistent
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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <NavBar user={profile} onProfileClick={() => setIsProfileOpen(true)} />

      {/* --- HERO SECTION --- */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-bold uppercase tracking-wide mb-6">
            Our Mission
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
            Bridging Technology & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600">Dermatological Care</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            DermaGuard AI uses state-of-the-art Deep Learning to assist in the early detection of skin cancer, making professional-grade analysis accessible to everyone.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* --- CORE VALUES GRID --- */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition group">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Privacy First</h3>
            <p className="text-slate-600 leading-relaxed">
              Your medical data is sensitive. We employ end-to-end encryption and do not store your images longer than necessary for analysis.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition group">
            <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <Cpu size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Advanced AI Models</h3>
            <p className="text-slate-600 leading-relaxed">
              Powered by Convolutional Neural Networks (CNNs) trained on the ISIC archive, achieving high accuracy in lesion classification.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition group">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <Target size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Early Detection</h3>
            <p className="text-slate-600 leading-relaxed">
              Our comparison tools allow users to track lesion growth over time, a critical factor in diagnosing malignant melanoma early.
            </p>
          </div>
        </div>

        {/* --- STORY / DEVELOPER SECTION --- */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 grid md:grid-cols-2">
          <div className="p-10 md:p-14 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-teal-600 font-bold mb-4">
              <Users size={20} />
              <span>The Team</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Built with Passion & Precision</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              This project was developed to solve a critical gap in healthcare: the waiting time between noticing a spot and seeing a doctor.
            </p>
            <p className="text-slate-600 mb-8 leading-relaxed">
              By leveraging computer vision, we aim to provide an instant "second opinion" that encourages users to seek professional help sooner rather than later.
            </p>
            
            <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
               <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">
                 VG
               </div>
               <div>
                 <p className="font-bold text-slate-900">Veena Ganiga</p>
                 <p className="text-sm text-slate-500">Lead Developer & AI Researcher</p>
               </div>
            </div>
          </div>
          <div className="bg-slate-100 relative h-64 md:h-auto">
             {/* Placeholder for a team image or abstract tech image */}
             <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                <Heart size={64} />
             </div>
             <img 
               src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" 
               alt="Medical Tech" 
               className="w-full h-full object-cover opacity-80"
             />
          </div>
        </div>

      </main>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} user={profile} />
    </div>
  );
};

export default AboutPage;