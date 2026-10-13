import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Building2, FileText, CreditCard, HelpCircle, Settings, LogOut, CheckCircle2, AlertCircle, ChevronRight, QrCode } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePrintOrder } from '../context/PrintOrderContext';
import { authApi } from '../services/api';
import { BottomNav } from '../components/common/BottomNav';

export const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();
  const { selectedCollege } = usePrintOrder();

  const [verifyToken, setVerifyToken] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState<string | null>(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleVerify = async () => {
    if (!verifyToken.trim()) return;
    setVerifying(true);
    setVerifyMsg(null);
    try {
      await authApi.verifyEmail(verifyToken.trim());
      await refreshUser();
      setVerifyMsg('Account verified successfully!');
      setVerifyToken('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid token';
      setVerifyMsg(`Error: ${msg}`);
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!user?.email) return;
    try {
      const res = await authApi.resendVerification(user.email);
      setVerifyToken(res.token);
      setVerifyMsg('Verification token generated! Click verify below.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to resend';
      setVerifyMsg(`Error: ${msg}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] max-w-md mx-auto flex flex-col justify-between pb-24">
      <div>
        {/* Top Header */}
        <div className="bg-white p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/home')}
              className="w-9 h-9 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <span className="text-xl font-bold">←</span>
            </button>
            <h1 className="text-xl font-extrabold text-[#101735]">My Profile</h1>
          </div>
        </div>

        {/* Profile Card */}
        <div className="p-5">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs text-center space-y-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#5835F5] to-indigo-600 text-white flex items-center justify-center text-3xl font-extrabold mx-auto shadow-lg shadow-indigo-200">
              {user ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-[#101735]">
                {user ? user.fullName : 'Guest account'}
              </h2>
              <p className="text-xs text-[#64748B]">
                {user ? user.email : 'guest@campus.edu'}
              </p>
            </div>

            
          </div>

          {/* Settings Menu List */}
          <div className="mt-5 bg-white rounded-3xl p-2 border border-gray-100 shadow-xs divide-y divide-gray-50">
            {/* My College */}
            <div
              onClick={() => navigate('/colleges')}
              className="p-3.5 flex items-center justify-between hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#5835F5] flex items-center justify-center">
                  <Building2 className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#101735]">My College</h4>
                  <p className="text-[11px] text-[#64748B] truncate max-w-[200px]">
                    {selectedCollege?.collegeName || user?.selectedCollegeName || 'Select campus'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>

            {/* My Orders */}
            <div
              onClick={() => navigate('/history')}
              className="p-3.5 flex items-center justify-between hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileText className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-xs font-bold text-[#101735]">My Orders & History</h4>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>

           
            {/* Payment Methods */}
            <div
              onClick={() => navigate('/review')}
              className="p-3.5 flex items-center justify-between hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CreditCard className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-xs font-bold text-[#101735]">Payment Methods</h4>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>

            {/* Help & Support */}
            <div
              onClick={() => alert('Support line: support@xeroxgo.campus / Call: 1800-CAMPUS-PRINT')}
              className="p-3.5 flex items-center justify-between hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <HelpCircle className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-xs font-bold text-[#101735]">Help & Support</h4>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>

            {/* Settings */}
            <div
              onClick={() => alert('Campus notification preferences and printing presets are enabled.')}
              className="p-3.5 flex items-center justify-between hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center">
                  <Settings className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-xs font-bold text-[#101735]">Settings</h4>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>

            {/* Logout */}
            <div
              onClick={handleLogout}
              className="p-3.5 flex items-center justify-between hover:bg-red-50 rounded-2xl cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  <LogOut className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-bold text-red-600">Logout</span>
              </div>
              <ChevronRight className="w-4 h-4 text-red-300" />
            </div>
          </div>
        </div>
      </div>


      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
};
