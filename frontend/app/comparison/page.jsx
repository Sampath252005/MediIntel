"use client"

import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import ProfileModal from '../components/ProfileModal';
import { 
  UploadCloud, 
  Loader2, 
  ArrowRight, 
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  Activity, 
  FileText, 
  RefreshCw,
  Scale,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const ComparisonPage = () => {
  // --- STATE ---
  const [oldFile, setOldFile] = useState(null);
  const [newFile, setNewFile] = useState(null);
  const [oldPreview, setOldPreview] = useState(null);
  const [newPreview, setNewPreview] = useState(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  // Profile State
  const [profile, setProfile] = useState({ name: "", email: "", picture: "" });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const router = useRouter();

  // --- FETCH PROFILE (Auth Check) ---
  const getProfile = async () => {
    try {
      let response = await fetch("http://localhost:8000/Profile", {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 403 || response.status === 401) {
        const refreshRes = await fetch("http://localhost:8000/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (!refreshRes.ok) {
          router.push("/login");
          return;
        }
        response = await fetch("http://localhost:8000/Profile", { method: "GET", credentials: "include" });
      }

      if (response.ok) {
        setProfile(await response.json());
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { getProfile(); }, []);

  // --- HANDLERS ---
  const handleFileChange = (e, type) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const preview = URL.createObjectURL(file);
      
      if (type === 'old') {
        setOldFile(file);
        setOldPreview(preview);
      } else {
        setNewFile(file);
        setNewPreview(preview);
      }
      setResult(null); // Reset results if image changes
    }
  };

  const handleCompare = async () => {
    if (!oldFile || !newFile) return;
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('old_image', oldFile); // Matches backend Key
      formData.append('new_image', newFile); // Matches backend Key

      const response = await fetch('http://localhost:8000/skin/compare', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error("Comparison failed");
      
      const data = await response.json();
      setResult(data);

    } catch (error) {
      console.error("Error:", error);
      alert("Failed to compare images.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- HELPERS ---
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
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-teal-100 text-teal-700 rounded-full mb-4">
            <Scale size={24} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Progression Analysis</h1>
          <p className="text-slate-500 mt-2">Compare past and present scans to track healing or progression.</p>
        </div>

        {/* --- UPLOAD SECTION (Two Columns) --- */}
        <div className="grid md:grid-cols-2 gap-8 items-stretch mb-10">
          
          {/* OLD IMAGE INPUT */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-slate-700 ml-1">1. Previous Scan (Old)</h3>
            <div className={`border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center relative overflow-hidden transition-all ${oldPreview ? 'border-teal-500 bg-white' : 'border-slate-300 bg-white hover:border-teal-400'}`}>
              {oldPreview ? (
                <>
                  <img src={oldPreview} alt="Old" className="w-full h-full object-cover" />
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition cursor-pointer">
                     <span className="text-white font-medium flex items-center gap-2"><RefreshCw size={16}/> Change</span>
                     <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'old')} />
                  </label>
                </>
              ) : (
                <label className="cursor-pointer flex flex-col items-center w-full h-full justify-center">
                  <UploadCloud size={32} className="text-slate-400 mb-2" />
                  <span className="text-sm font-semibold text-slate-600">Upload Old Image</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'old')} />
                </label>
              )}
            </div>
          </div>

          {/* NEW IMAGE INPUT */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-slate-700 ml-1">2. Current Scan (New)</h3>
            <div className={`border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center relative overflow-hidden transition-all ${newPreview ? 'border-teal-500 bg-white' : 'border-slate-300 bg-white hover:border-teal-400'}`}>
              {newPreview ? (
                <>
                  <img src={newPreview} alt="New" className="w-full h-full object-cover" />
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition cursor-pointer">
                     <span className="text-white font-medium flex items-center gap-2"><RefreshCw size={16}/> Change</span>
                     <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'new')} />
                  </label>
                </>
              ) : (
                <label className="cursor-pointer flex flex-col items-center w-full h-full justify-center">
                  <UploadCloud size={32} className="text-slate-400 mb-2" />
                  <span className="text-sm font-semibold text-slate-600">Upload New Image</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'new')} />
                </label>
              )}
            </div>
          </div>

        </div>

        {/* COMPARE ACTION */}
        <div className="flex justify-center mb-16">
          <button 
            onClick={handleCompare}
            disabled={!oldFile || !newFile || isLoading}
            className={`px-10 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center gap-2 transition-transform transform 
              ${(!oldFile || !newFile) ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-teal-600 text-white hover:bg-teal-700 hover:scale-105 active:scale-95'}`}
          >
            {isLoading ? <Loader2 className="animate-spin"/> : <Activity />}
            {isLoading ? 'Calculating Changes...' : 'Run Comparison'}
          </button>
        </div>

        {/* --- RESULTS SECTION --- */}
        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* 1. STATUS CARD */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 mb-8">
              <div className={`p-6 flex items-center justify-between ${result.diagnosis.is_dangerous ? 'bg-red-50' : 'bg-green-50'}`}>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-slate-500">Analysis Status</p>
                  <h2 className={`text-2xl font-extrabold ${result.diagnosis.is_dangerous ? 'text-red-700' : 'text-green-700'}`}>
                    {result.diagnosis.status}
                  </h2>
                </div>
                <div className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 ${result.diagnosis.is_dangerous ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                   {result.diagnosis.is_dangerous ? <AlertTriangle size={20}/> : <CheckCircle size={20}/>}
                   {result.diagnosis.severity.toUpperCase()} SEVERITY
                </div>
              </div>

              {/* 2. METRICS GRID */}
              <div className="grid md:grid-cols-3 gap-px bg-slate-100">
                
                {/* Growth Metric */}
                <div className="bg-white p-8 flex flex-col items-center justify-center text-center">
                   <span className="text-slate-500 font-medium mb-2">Change in Area</span>
                   <div className="flex items-center gap-2">
                      {result.metrics.growth_percentage < 0 
                        ? <ArrowDownRight className="text-green-500" size={32} />
                        : <ArrowUpRight className="text-red-500" size={32} />
                      }
                      <span className={`text-4xl font-extrabold ${result.metrics.growth_percentage < 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.abs(result.metrics.growth_percentage)}%
                      </span>
                   </div>
                   <span className={`text-sm font-bold mt-1 ${result.metrics.growth_percentage < 0 ? 'text-green-600' : 'text-red-600'}`}>
                     {result.metrics.growth_percentage < 0 ? 'REDUCTION' : 'GROWTH'}
                   </span>
                </div>

                {/* Old Area */}
                <div className="bg-white p-8 flex flex-col items-center justify-center text-center">
                   <span className="text-slate-500 font-medium mb-2">Initial Area (Old)</span>
                   <span className="text-3xl font-bold text-slate-800">{Math.round(result.metrics.old_area_px).toLocaleString()}</span>
                   <span className="text-xs text-slate-400">pixels</span>
                </div>

                {/* New Area */}
                <div className="bg-white p-8 flex flex-col items-center justify-center text-center">
                   <span className="text-slate-500 font-medium mb-2">Current Area (New)</span>
                   <span className="text-3xl font-bold text-slate-800">{Math.round(result.metrics.new_area_px).toLocaleString()}</span>
                   <span className="text-xs text-slate-400">pixels</span>
                </div>
              </div>

              {/* 3. AI EXPLANATION */}
              <div className="p-8 bg-white border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-4 text-slate-900">
                    <FileText className="text-teal-600" size={24} />
                    <h3 className="font-bold text-xl">Clinical Interpretation</h3>
                  </div>
                  <div className="prose prose-slate max-w-none text-sm bg-slate-50 p-6 rounded-xl border border-slate-100">
                    {formatAIAnalysis(result.ai_analysis)}
                  </div>
              </div>

            </div>
          </div>
        )}

      </main>

      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        user={profile} 
      />
    </div>
  );
};

export default ComparisonPage;