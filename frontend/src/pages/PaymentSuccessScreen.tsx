import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Copy, Check, MapPin, Printer, Clock, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { usePrintOrder } from '../context/PrintOrderContext';
import { CheckoutResponse } from '../types';

export const PaymentSuccessScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedMachine, resetWorkflow } = usePrintOrder();

  const checkout = location.state?.checkout as CheckoutResponse | undefined;
  const [copied, setCopied] = useState(false);

  const accessCode = checkout?.accessCode || 'A7K9P2';

  useEffect(() => {
    // Fire celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.4 },
        colors: ['#5835F5', '#4020D8', '#10B981', '#F59E0B', '#EC4899'],
      });
    } catch {
      // Ignored if canvas not supported
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(accessCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDone = () => {
    resetWorkflow();
    navigate('/history');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] max-w-md mx-auto p-6 flex flex-col justify-between">
      <div className="pt-4 text-center">
        {/* Animated Green Checkmark */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-100 animate-fadeIn">
          <CheckCircle2 className="w-12 h-12 stroke-2.5" />
        </div>

        <h1 className="text-2xl font-extrabold text-[#101735]">Payment Successful!</h1>
        <p className="text-xs text-[#64748B] mt-1 font-medium">
          Your print job has been created successfully.
        </p>

        {/* Access Code Highlight Card */}
        <div className="mt-6 bg-[#F1EDFF] rounded-3xl p-6 border border-indigo-200/80 shadow-md shadow-indigo-100 relative group">
          <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest block mb-2">
            Access Code
          </span>

          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl font-extrabold font-mono tracking-widest text-[#5835F5] select-all">
              {accessCode}
            </span>
            <button
              onClick={handleCopy}
              className="p-2.5 rounded-2xl bg-white text-[#5835F5] hover:bg-indigo-50 shadow-xs active:scale-90 transition-all"
              title="Copy Access Code"
            >
              {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          <p className="text-[11px] text-[#64748B] mt-3">
            Enter this code on the vending kiosk touchscreen to print
          </p>
        </div>

        {/* Machine & Expiration Details */}
        <div className="mt-5 bg-white rounded-3xl p-5 border border-gray-100 shadow-xs text-left space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F1EDFF] text-[#5835F5] flex items-center justify-center shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-[#101735] truncate">
                {selectedMachine ? selectedMachine.machineName : 'Engineering Block A'}
              </h4>
              <p className="text-[11px] text-[#64748B] truncate">
                {selectedMachine ? selectedMachine.locationDescription : 'Near Canteen, Ground Floor'}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-50 flex items-center gap-2 text-xs text-amber-700 font-semibold">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Valid for 24 hours from creation</span>
          </div>
        </div>

        {/* Instructions banner */}
        <div className="mt-4 p-3.5 bg-indigo-50/70 rounded-2xl border border-indigo-100 text-left flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-[#5835F5] shrink-0 mt-0.5" />
          <p className="text-xs text-[#101735] leading-relaxed">
            Go to the selected printer kiosk and enter this access code on the screen to instantly dispense your prints.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-6 space-y-3">
        
        <button
          onClick={handleDone}
          className="w-full py-4 rounded-2xl bg-[#5835F5] hover:bg-[#4020D8] text-white font-bold text-sm shadow-xl shadow-indigo-300/60 active:scale-98 transition-all"
        >
          Done
        </button>
      </div>

    </div>
  );
};
