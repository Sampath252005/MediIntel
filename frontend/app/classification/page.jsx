"use client"

import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar'; 
import ProfileModal from '../components/ProfileModal';
import { 
  UploadCloud, 
  Loader2, 
  AlertTriangle, 
  CheckCircle, 
  Activity, 
  FileText, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const ClassificationPage = () => {
  // --- STATE ---
  const [selectedImage, setSelectedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [profile, setProfile] = useState({ name: "", email: "", picture: "" });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const router = useRouter();
    
  // --- FETCH PROFILE ---
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

        response = await fetch("http://localhost:8000/Profile", {
          method: "GET",
          credentials: "include",
        });
      }

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (err) {
      console.log("Error fetching profile:", err);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  // --- HANDLERS ---
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const imgFile = e.target.files[0];
      setFile(imgFile);
      setSelectedImage(URL.createObjectURL(imgFile));
      setResult(null); // Reset result to center the box again
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      let response = await fetch('http://localhost:8000/skin/predict', {
        method: 'POST',
        body: formData,
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

        response = await fetch('http://localhost:8000/skin/predict', {
        method: 'POST',
        body: formData,
        credentials: "include",
      });
      }
      
      if (!response.ok) throw new Error("Analysis failed");
      
      const data = await response.json();
      setResult(data);

    } catch (error) {
      console.error("Error:", error);
      alert("Failed to analyze image.");
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

  const getSeverityColor = (level) => {
    if (level < 3) return "bg-green-500";
    if (level < 6) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      
      <NavBar 
        user={profile} 
        onProfileClick={() => setIsProfileOpen(true)} 
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-slate-900">AI Skin Lesion Analysis</h1>
          <p className="text-slate-500 mt-2">Upload a clear image of the affected area for instant classification.</p>
        </div>

        {/* --- DYNAMIC LAYOUT CONTAINER --- */}
        {/* If result exists: Grid (Split Screen). If not: Flex Center (Focused) */}
        <div className={`transition-all duration-500 ease-in-out ${result ? 'grid lg:grid-cols-2 gap-8 items-start' : 'flex justify-center'}`}>
          
          {/* --- LEFT COLUMN: UPLOAD --- */}
          {/* We restrict width to max-w-xl when centered so it looks nice */}
          <div className={`flex flex-col gap-6 transition-all duration-500 ${result ? 'w-full' : 'w-full max-w-xl'}`}>
            
            <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${selectedImage ? 'border-teal-200 bg-teal-50/30' : 'border-slate-300 hover:border-teal-400 bg-white'}`}>
              
              {!selectedImage ? (
                <label className="cursor-pointer flex flex-col items-center justify-center h-64">
                  <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-4">
                    <UploadCloud size={32} />
                  </div>
                  <span className="text-lg font-semibold text-slate-700">Click to upload image</span>
                  <span className="text-sm text-slate-400 mt-2">JPEG, PNG supports (Max 5MB)</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              ) : (
                <div className="relative group">
                  <img src={selectedImage} alt="Preview" className="w-full h-96 object-cover rounded-xl shadow-md" />
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer rounded-xl">
                    <div className="bg-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium text-slate-900">
                      <RefreshCw size={16} /> Change Image
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>
              )}
            </div>

            <button 
              onClick={handleAnalyze}
              disabled={!selectedImage || isLoading}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2
                ${!selectedImage 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : isLoading 
                    ? 'bg-teal-700 text-white cursor-wait' 
                    : 'bg-teal-600 text-white hover:bg-teal-700 hover:scale-[1.01]'
                }`}
            >
              {isLoading ? (
                <> <Loader2 className="animate-spin" /> Analyzing Texture... </>
              ) : (
                <> <Activity /> Analyze Skin </>
              )}
            </button>
          </div>

          {/* --- RIGHT COLUMN: RESULTS --- */}
          {result && (
            <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in w-full">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                
                {/* Result Header */}
                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Diagnosis Result</span>
                    <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full font-bold">
                      {result.filename}
                    </span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-slate-900 capitalize flex items-center gap-3">
                    {result.diagnosis}
                    <CheckCircle className="text-teal-500" size={28} />
                  </h2>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-px bg-slate-100">
                  <div className="bg-white p-6">
                    <span className="text-sm text-slate-500 block mb-1">Confidence Score</span>
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-3xl font-bold text-slate-800">{result.confidence_score}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500" style={{ width: `${result.confidence_score}%` }}></div>
                    </div>
                  </div>

                  <div className="bg-white p-6">
                    <span className="text-sm text-slate-500 block mb-1">Severity Level</span>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-3xl font-bold text-slate-800">{result.severity_level}</span>
                      <span className="text-sm text-slate-400">/ 10</span>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(10)].map((_, i) => (
                        <div key={i} className={`h-2 w-full rounded-full ${i < result.severity_level ? getSeverityColor(result.severity_level) : 'bg-slate-100'}`}></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Urgency */}
                <div className={`p-6 ${result.urgency_score > 5 ? 'bg-red-50' : 'bg-teal-50'} border-b border-slate-100`}>
                   <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${result.urgency_score > 5 ? 'bg-red-100 text-red-600' : 'bg-teal-100 text-teal-600'}`}>
                        <AlertTriangle size={24} />
                      </div>
                      <div>
                        <h4 className={`text-lg font-bold ${result.urgency_score > 5 ? 'text-red-900' : 'text-teal-900'}`}>Recommended Action</h4>
                        <p className={`text-lg font-medium mt-1 ${result.urgency_score > 5 ? 'text-red-700' : 'text-teal-700'}`}>{result.recommended_action}</p>
                      </div>
                   </div>
                </div>

                {/* AI Analysis */}
                <div className="p-8 bg-white">
                  <div className="flex items-center gap-2 mb-4 text-slate-900">
                    <FileText className="text-teal-600" size={20} />
                    <h3 className="font-bold text-lg">Detailed AI Analysis</h3>
                  </div>
                  <div className="prose prose-slate max-w-none text-sm bg-slate-50 p-6 rounded-xl border border-slate-100">
                    {formatAIAnalysis(result.ai_analysis)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        user={profile} 
      />
    </div>
  );
};

export default ClassificationPage;