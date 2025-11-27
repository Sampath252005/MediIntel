"use client"

import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import ProfileModal from '../components/ProfileModal';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Loader2, 
  CheckCircle 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const ContactPage = () => {
  // --- STATE ---
  const [profile, setProfile] = useState({ name: "", email: "", picture: "" });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const router = useRouter();

  useEffect(() => {
    // Auth Logic
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

  // --- HANDLERS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    // Simulate API Call
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      // Reset success message after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <NavBar user={profile} onProfileClick={() => setIsProfileOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Get in Touch</h1>
          <p className="text-lg text-slate-600">Have questions about the AI or need support? We are here to help.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* --- LEFT: CONTACT INFO --- */}
          <div className="flex flex-col gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Email Us</p>
                    <a href="mailto:veenaganiga96@gmail.com" className="text-slate-600 hover:text-teal-600 transition">
                      veenaganiga96@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Call Us</p>
                    <a href="tel:+917975033992" className="text-slate-600 hover:text-teal-600 transition">
                      +91 7975033992
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Location</p>
                    <p className="text-slate-600">
                      Bangalore, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Mini Section */}
            <div className="bg-slate-100 p-8 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-2">Technical Support</h4>
              <p className="text-sm text-slate-600 mb-4">
                Facing issues with image upload or analysis? Check our documentation or send us a message directly.
              </p>
              <button className="text-teal-700 font-bold text-sm hover:underline">View Documentation &rarr;</button>
            </div>
          </div>

          {/* --- RIGHT: FORM --- */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-slate-100">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">Your Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    placeholder="John Doe"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">Subject</label>
                <input 
                  type="text" 
                  name="subject" 
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  placeholder="How can we help?"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">Message</label>
                <textarea 
                  name="message" 
                  rows="5" 
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition resize-none"
                  placeholder="Describe your query..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={status === 'loading' || status === 'success'}
                className={`mt-2 py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all
                  ${status === 'success' ? 'bg-green-500 hover:bg-green-600' : 'bg-teal-600 hover:bg-teal-700 hover:scale-[1.01]'}
                  ${status === 'loading' ? 'opacity-80 cursor-wait' : ''}
                `}
              >
                {status === 'loading' && <Loader2 className="animate-spin" />}
                {status === 'success' && <CheckCircle className="animate-bounce" />}
                {status === 'idle' && <Send size={20} />}
                
                {status === 'loading' ? 'Sending...' : status === 'success' ? 'Message Sent!' : 'Send Message'}
              </button>

            </form>
          </div>

        </div>
      </main>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} user={profile} />
    </div>
  );
};

export default ContactPage;