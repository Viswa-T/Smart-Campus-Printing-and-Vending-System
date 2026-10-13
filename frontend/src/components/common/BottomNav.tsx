import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, FileText, Printer, Clock, User } from 'lucide-react';
import { usePrintOrder } from '../../context/PrintOrderContext';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedMachine } = usePrintOrder();

  const handlePrintClick = () => {
    if (selectedMachine) {
      navigate('/upload');
    } else {
      navigate('/home');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const getNavClass = (active: boolean) =>
    `flex min-w-0 flex-1 flex-col items-center justify-center gap-1 py-1 transition-colors ${
      active ? 'text-[#5835F5]' : 'text-gray-400 hover:text-gray-600'
    }`;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 w-full border-t border-gray-200/80 bg-white/95 shadow-lg backdrop-blur-lg"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="mx-auto flex h-16 w-full max-w-md items-center justify-between px-2 sm:px-4">

        {/* Home */}
        <button
          type="button"
          onClick={() => navigate('/home')}
          className={getNavClass(isActive('/home'))}
          aria-label="Home"
          aria-current={isActive('/home') ? 'page' : undefined}
        >
          <Home className="h-5 w-5 shrink-0" />
          <span className="text-[10px] font-semibold sm:text-[11px]">
            Home
          </span>
        </button>

        {/* Orders */}
        <button
          type="button"
          onClick={() => navigate('/history')}
          className={getNavClass(
            isActive('/orders') || isActive('/history')
          )}
          aria-label="Orders"
          aria-current={
            isActive('/orders') || isActive('/history')
              ? 'page'
              : undefined
          }
        >
          <FileText className="h-5 w-5 shrink-0" />
          <span className="text-[10px] font-semibold sm:text-[11px]">
            Orders
          </span>
        </button>

        {/* Central Print Button */}
        <div className="relative flex min-w-0 flex-1 flex-col items-center justify-center">
          <button
            type="button"
            onClick={handlePrintClick}
            aria-label="Start printing"
            className="-mt-5 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#4020D8] to-[#5835F5] text-white shadow-lg shadow-indigo-400/40 transition-transform hover:shadow-indigo-500/60 active:scale-95 sm:h-14 sm:w-14"
          >
            <Printer className="h-6 w-6" />
          </button>

          <span className="mt-1 text-[10px] font-bold tracking-tight text-[#5835F5]">
            Print
          </span>
        </div>

        {/* History */}
        <button
          type="button"
          onClick={() => navigate('/history')}
          className={getNavClass(isActive('/history'))}
          aria-label="History"
          aria-current={isActive('/history') ? 'page' : undefined}
        >
          <Clock className="h-5 w-5 shrink-0" />
          <span className="text-[10px] font-semibold sm:text-[11px]">
            History
          </span>
        </button>

        {/* Profile */}
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className={getNavClass(isActive('/profile'))}
          aria-label="Profile"
          aria-current={isActive('/profile') ? 'page' : undefined}
        >
          <User className="h-5 w-5 shrink-0" />
          <span className="text-[10px] font-semibold sm:text-[11px]">
            Profile
          </span>
        </button>

      </div>
    </nav>
  );
};