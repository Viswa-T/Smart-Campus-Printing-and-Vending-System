import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Printer, Bell, User, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePrintOrder } from '../../context/PrintOrderContext';

export const Navbar: React.FC<{ title?: string; showBack?: boolean; onBack?: () => void }> = ({
  title,
  showBack,
  onBack,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedCollege } = usePrintOrder();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={onBack || (() => navigate(-1))}
              className="w-9 h-9 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 transition-all"
              aria-label="Go back"
            >
              <span className="text-xl font-bold">←</span>
            </button>
          )}

          {title ? (
            <h1 className="text-lg font-bold text-[#101735]">{title}</h1>
          ) : (
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4020D8] to-[#5835F5] flex items-center justify-center text-white shadow-md shadow-indigo-200">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-[#101735] flex items-center gap-1">
                  Xerox<span className="text-[#5835F5]">Go</span>
                </span>
                <p className="text-[10px] -mt-1 font-semibold text-[#64748B] tracking-wider uppercase">
                  Smart Campus Printing
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {selectedCollege && !title && (
            <button
              onClick={() => navigate('/colleges')}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F1EDFF] text-[#5835F5] text-xs font-semibold hover:bg-indigo-100 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate max-w-[120px]">{selectedCollege.abbreviation || selectedCollege.city}</span>
            </button>
          )}

          <button
            onClick={() => navigate('/history')}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
          </button>

          <button
            onClick={() => navigate('/profile')}
            className="w-9 h-9 rounded-full bg-[#F1EDFF] text-[#5835F5] flex items-center justify-center font-bold text-sm border border-indigo-200/60 hover:ring-2 hover:ring-[#5835F5]/30 transition-all"
            aria-label="User Profile"
          >
            {user ? user.fullName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
