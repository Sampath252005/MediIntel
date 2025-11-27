"use client"

import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import ProfileModal from '../components/ProfileModal';
import { 
  Calendar, 
  Clock, 
  ChevronRight, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  FileText, 
  Search,
  LayoutGrid
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const HistoryPage = () => {
  // --- STATE ---
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState(null); // Controls the Detail Modal

  // Profile State
  const [profile, setProfile] = useState({ name: "", email: "", picture: "" });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const router = useRouter();

  // --- 1. FETCH DATA (Auth + History) ---
  const fetchData = async () => {
    try {
      // A. Check Auth & Profile
      let response = await fetch("http://localhost:8000/Profile", { method: "GET", credentials: "include" });
      
      if (response.status === 403 || response.status === 401) {
        const refreshRes = await fetch("http://localhost:8000/refresh", { method: "POST", credentials: "include" });
        if (!refreshRes.ok) {
          router.push("/login");
          return;
        }
        response = await fetch("http://localhost:8000/Profile", { method: "GET", credentials: "include" });
      }

      if (response.ok) {
        setProfile(await response.json());
        
        // B. Fetch History (Only if auth passed)
        // Note: Replace with your actual endpoint, assuming /history based on context
        const historyRes = await fetch("http://localhost:8000/skin/skinHistory", { method: "GET", credentials: "include" });

        if (historyRes.ok) {
          const data = await historyRes.json();
          // Sort by newest first
          const sorted = data.sort((a, b) => new Date(b.date_time) - new Date(a.date_time));
          setHistoryData(sorted);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. HELPERS ---
  
  // Format Date: "Nov 27, 2025"
  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  // Format Time: "04:04 PM"
  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit'
    });
  };

  // Severity Color Logic
  const getSeverityColor = (level) => {
    if (level < 3) return "bg-green-100 text-green-700 border-green-200";
    if (level < 6) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  // AI Text Formatter (Preserves bolding and lines)
  const formatAIAnalysis = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, index) => {
      if (!line.trim()) return <br key={index} />;
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={index} className="mb-2 text-slate-700 leading-relaxed">
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i} className="text-slate-900 font-bold">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      
      <NavBar user={profile} onProfileClick={() => setIsProfileOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <LayoutGrid className="text-teal-600" /> Medical History
            </h1>
            <p className="text-slate-500 mt-2">Track your past scans, diagnoses, and AI recommendations over time.</p>
          </div>
          {/* <div className="bg-white border border-slate-200 rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm text-slate-400 w-full md:w-auto">
            <Search size={18} />
            <input placeholder="Search records..." className="bg-transparent outline-none text-sm text-slate-700 w-full" />
          </div> */}
        </div>

        {/* --- LIST VIEW (GRID) --- */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full"></div>
          </div>
        ) : historyData.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <Activity className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-lg font-bold text-slate-500">No records found</h3>
            <p className="text-slate-400">Your scan history will appear here.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historyData.map((scan) => (
              <div 
                key={scan.id}
                onClick={() => setSelectedScan(scan)}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-300 transition cursor-pointer group flex flex-col justify-between"
              >
                {/* Card Header */}
                <div className="p-5 border-b border-slate-50">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      <Calendar size={14} />
                      {formatDate(scan.date_time)}
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold border ${getSeverityColor(scan.severity_level)}`}>
                      Severity: {scan.severity_level}/10
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 capitalize mb-1 group-hover:text-teal-700 transition">
                    {scan.diagnosis}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Activity size={16} className="text-teal-500" />
                    <span>{scan.confidence_score}% Confidence</span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 bg-slate-50 rounded-b-xl flex justify-between items-center">
                   <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock size={14} /> {formatTime(scan.date_time)}
                   </div>
                   <span className="text-sm font-bold text-teal-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                     View Report <ChevronRight size={16} />
                   </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* --- DETAILED REPORT MODAL --- */}
      {selectedScan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <div>
                  <h2 className="text-xl font-bold text-slate-900 capitalize flex items-center gap-2">
                    {selectedScan.diagnosis}
                  </h2>
                  <p className="text-sm text-slate-500">{formatDate(selectedScan.date_time)} at {formatTime(selectedScan.date_time)}</p>
               </div>
               <button onClick={() => setSelectedScan(null)} className="p-2 hover:bg-slate-200 rounded-full transition">
                 <X size={20} className="text-slate-500" />
               </button>
            </div>

            {/* Modal Content (Scrollable) */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              
              {/* Metrics Row */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                  <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Confidence</span>
                  <span className="text-xl font-bold text-slate-800">{selectedScan.confidence_score}%</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                  <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Severity</span>
                  <span className={`text-xl font-bold ${selectedScan.severity_level >= 6 ? 'text-red-600' : 'text-slate-800'}`}>
                    {selectedScan.severity_level}/10
                  </span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                  <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Urgency</span>
                  <span className="text-xl font-bold text-slate-800">{selectedScan.urgency_score}</span>
                </div>
              </div>

              {/* Action Banner */}
              <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 ${selectedScan.urgency_score > 5 ? 'bg-red-50 border border-red-100' : 'bg-teal-50 border border-teal-100'}`}>
                {selectedScan.urgency_score > 5 ? <AlertTriangle className="text-red-600 shrink-0" /> : <CheckCircle className="text-teal-600 shrink-0" />}
                <div>
                  <h4 className={`font-bold text-sm uppercase mb-1 ${selectedScan.urgency_score > 5 ? 'text-red-700' : 'text-teal-700'}`}>Recommended Action</h4>
                  <p className={`font-semibold ${selectedScan.urgency_score > 5 ? 'text-red-900' : 'text-teal-900'}`}>
                    {selectedScan.recommended_action}
                  </p>
                </div>
              </div>

              {/* AI Analysis Text */}
              <div>
                 <div className="flex items-center gap-2 mb-3 text-slate-800">
                    <FileText size={18} className="text-teal-600" />
                    <h3 className="font-bold">AI Suggestions & Analysis</h3>
                 </div>
                 <div className="text-sm bg-slate-50 p-5 rounded-xl border border-slate-100 text-slate-600 leading-relaxed">
                   {formatAIAnalysis(selectedScan.ai_analysis)}
                 </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setSelectedScan(null)}
                className="px-6 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 font-semibold hover:bg-slate-100 transition"
              >
                Close
              </button>
            </div>

          </div>
          {/* Backdrop Click to Close */}
          <div className="absolute inset-0 -z-10" onClick={() => setSelectedScan(null)}></div>
        </div>
      )}

      {/* Standard Profile Modal */}
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} user={profile} />
    </div>
  );
};

export default HistoryPage;
