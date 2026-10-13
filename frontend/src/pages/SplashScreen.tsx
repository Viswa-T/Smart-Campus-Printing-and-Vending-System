import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Printer, ArrowRight, Zap, Shield, FileCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      const timer = setTimeout(() => {
        navigate('/home');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8FF] via-white to-[#F1EDFF]/50 flex flex-col justify-between p-6 max-w-md mx-auto relative overflow-hidden">
      {/* Decorative blurred background orbs */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#5835F5]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#4020D8]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Branding */}
      <div className="pt-10 text-center animate-fadeIn">
        <div className="inline-flex items-center justify-center p-3.5 bg-gradient-to-tr from-[#4020D8] to-[#5835F5] rounded-3xl text-white shadow-xl shadow-indigo-300/40 mb-3 pulse-glow">
          <Printer className="w-9 h-9" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#101735] tracking-tight">
          Xerox<span className="text-[#5835F5]">Go</span>
        </h1>
        <p className="text-xs uppercase tracking-widest font-bold text-[#64748B] mt-1">
          Smart Campus Printing
        </p>
      </div>

      {/* Center 3D Illustration Card */}
      <div className="my-auto py-8 flex flex-col items-center justify-center relative">
        <div className="relative w-64 h-64 bg-gradient-to-b from-[#F1EDFF] to-white rounded-3xl p-6 shadow-xl border border-indigo-100 flex flex-col items-center justify-center group hover:scale-102 transition-transform">
          {/* Floating paper elements */}
          <div className="absolute -top-4 -left-3 w-16 h-20 bg-white/90 backdrop-blur-xs rounded-xl shadow-md border border-indigo-50 rotate-[-12deg] flex flex-col justify-between p-2">
            <div className="h-1.5 w-8 bg-indigo-200 rounded-full" />
            <div className="h-1.5 w-10 bg-indigo-100 rounded-full" />
            <div className="h-1.5 w-6 bg-indigo-100 rounded-full" />
          </div>
          <div className="absolute -top-2 -right-3 w-16 h-20 bg-white/90 backdrop-blur-xs rounded-xl shadow-md border border-indigo-50 rotate-[14deg] flex flex-col justify-between p-2">
            <div className="h-1.5 w-8 bg-purple-200 rounded-full" />
            <div className="h-1.5 w-10 bg-purple-100 rounded-full" />
            <div className="h-1.5 w-7 bg-purple-100 rounded-full" />
          </div>

          {/* Center modern printer console */}
          <div className="w-36 h-28 bg-[#5835F5] rounded-2xl shadow-lg shadow-indigo-400/40 flex flex-col items-center justify-between p-3 text-white">
            <div className="w-16 h-2 bg-white/30 rounded-full" />
            <div className="w-24 h-9 bg-white rounded-lg shadow-inner flex items-center justify-center text-[#5835F5] font-mono text-xs font-bold">
              READY
            </div>
            <div className="w-20 h-1.5 bg-white/40 rounded-full" />
          </div>

          <p className="text-xs font-semibold text-[#64748B] mt-5">Instant Vending Kiosks</p>
        </div>

        {/* Feature Badges */}
        <div className="flex items-center gap-4 mt-6 text-xs text-[#64748B] font-medium">
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> Fast
          </span>
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-[#5835F5]" /> Secure
          </span>
          <span className="flex items-center gap-1">
            <FileCheck className="w-3.5 h-3.5 text-green-500" /> ₹1/page
          </span>
        </div>
      </div>

      {/* Bottom Action Section */}
      <div className="pb-8 space-y-3">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-[#101735]">
            Print Smarter <br />On Your Campus
          </h2>
          <p className="text-xs text-[#64748B] mt-1.5">
            Send documents from your phone and collect them at any nearby kiosk in seconds.
          </p>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#4020D8] to-[#5835F5] text-white font-bold text-base shadow-xl shadow-indigo-300/60 hover:shadow-indigo-400/80 active:scale-98 transition-all flex items-center justify-center gap-2 group"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        
      </div>
    </div>
  );
};
