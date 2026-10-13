import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Check, Minus, Plus } from 'lucide-react';
import { usePrintOrder } from '../context/PrintOrderContext';

export const OptionsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { printOptions, updatePrintOptions, quote, calculatingQuote } = usePrintOrder();

  const isBW = printOptions.colorMode === 'BW';
  const isSingle = printOptions.printSides === 'SINGLE';

  return (
    <div className="min-h-screen bg-[#F8F9FD] max-w-md mx-auto flex flex-col justify-between p-5">
      <div>
        {/* Top Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/upload')}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span className="text-xl font-bold">←</span>
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-[#101735]">Print Options</h1>
            <p className="text-xs text-[#64748B]">Configure print preferences & colors</p>
          </div>
        </div>

        {/* 1. Color Mode Selection */}
        <div className="mb-6">
          <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3 px-1">
            Color Mode
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {/* Black & White */}
            <div
              onClick={() => updatePrintOptions({ colorMode: 'BW' })}
              className={`p-4 rounded-3xl border-2 cursor-pointer transition-all active:scale-97 text-center relative ${
                isBW
                  ? 'border-[#5835F5] bg-white shadow-md shadow-indigo-100'
                  : 'border-gray-200 bg-white/70 hover:border-gray-300'
              }`}
            >
              {isBW && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#5835F5] text-white flex items-center justify-center text-xs">
                  <Check className="w-3 h-3 stroke-3" />
                </div>
              )}
              <div className="text-3xl mb-2">⚫</div>
              <h3 className={`text-sm font-bold ${isBW ? 'text-[#5835F5]' : 'text-[#101735]'}`}>
                Black & White
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5 font-semibold">₹1 per page</p>
            </div>

            {/* Color */}
            <div
              onClick={() => updatePrintOptions({ colorMode: 'COLOR' })}
              className={`p-4 rounded-3xl border-2 cursor-pointer transition-all active:scale-97 text-center relative ${
                !isBW
                  ? 'border-[#5835F5] bg-white shadow-md shadow-indigo-100'
                  : 'border-gray-200 bg-white/70 hover:border-gray-300'
              }`}
            >
              {!isBW && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#5835F5] text-white flex items-center justify-center text-xs">
                  <Check className="w-3 h-3 stroke-3" />
                </div>
              )}
              <div className="text-3xl mb-2">🎨</div>
              <h3 className={`text-sm font-bold ${!isBW ? 'text-[#5835F5]' : 'text-[#101735]'}`}>
                Color
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5 font-semibold">₹5 per page</p>
            </div>
          </div>
        </div>

        {/* 2. Print Sides Selection */}
        <div className="mb-6">
          <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3 px-1">
            Print Sides
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {/* Single Side */}
            <div
              onClick={() => updatePrintOptions({ printSides: 'SINGLE' })}
              className={`p-4 rounded-3xl border-2 cursor-pointer transition-all active:scale-97 text-center relative ${
                isSingle
                  ? 'border-[#5835F5] bg-white shadow-md shadow-indigo-100'
                  : 'border-gray-200 bg-white/70 hover:border-gray-300'
              }`}
            >
              {isSingle && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#5835F5] text-white flex items-center justify-center text-xs">
                  <Check className="w-3 h-3 stroke-3" />
                </div>
              )}
              <div className="text-3xl mb-2">📄</div>
              <h3 className={`text-sm font-bold ${isSingle ? 'text-[#5835F5]' : 'text-[#101735]'}`}>
                Single Side
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">Full pages</p>
            </div>

            {/* Double Side */}
            <div
              onClick={() => updatePrintOptions({ printSides: 'DOUBLE' })}
              className={`p-4 rounded-3xl border-2 cursor-pointer transition-all active:scale-97 text-center relative ${
                !isSingle
                  ? 'border-[#5835F5] bg-white shadow-md shadow-indigo-100'
                  : 'border-gray-200 bg-white/70 hover:border-gray-300'
              }`}
            >
              {!isSingle && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#5835F5] text-white flex items-center justify-center text-xs">
                  <Check className="w-3 h-3 stroke-3" />
                </div>
              )}
              <div className="text-3xl mb-2">📑</div>
              <h3 className={`text-sm font-bold ${!isSingle ? 'text-[#5835F5]' : 'text-[#101735]'}`}>
                Double Side
              </h3>
              <span className="inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-extrabold text-[10px] mt-0.5">
                Save 30%
              </span>
            </div>
          </div>
        </div>

        {/* 3. Number of Copies Counter */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
              Number of Copies
            </h2>
            <span className="text-xs text-gray-400 font-medium">(Max 10 copies)</span>
          </div>

          <div className="bg-white rounded-3xl p-3 border border-gray-100 shadow-xs flex items-center justify-center gap-8">
            <button
              onClick={() => updatePrintOptions({ copies: printOptions.copies - 1 })}
              disabled={printOptions.copies <= 1}
              className="w-12 h-12 rounded-2xl bg-[#F1EDFF] text-[#5835F5] hover:bg-indigo-100 active:scale-90 transition-all flex items-center justify-center text-xl font-bold disabled:opacity-40"
              aria-label="Decrease copies"
            >
              <Minus className="w-5 h-5" />
            </button>

            <span className="text-3xl font-extrabold text-[#101735] w-12 text-center font-mono">
              {printOptions.copies}
            </span>

            <button
              onClick={() => updatePrintOptions({ copies: printOptions.copies + 1 })}
              disabled={printOptions.copies >= 10}
              className="w-12 h-12 rounded-2xl bg-[#F1EDFF] text-[#5835F5] hover:bg-indigo-100 active:scale-90 transition-all flex items-center justify-center text-xl font-bold disabled:opacity-40"
              aria-label="Increase copies"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Calculation Preview Card */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-3">
          <div className="flex justify-between items-center text-xs text-[#64748B]">
            <span>Total Chargeable Pages</span>
            <span className="font-bold text-[#101735]">
              {quote ? quote.totalChargeablePages : 0} pages
            </span>
          </div>

          {quote && quote.discountAmount > 0 && (
            <div className="flex justify-between items-center text-xs text-green-600 font-semibold">
              <span>Double-Sided 30% Discount</span>
              <span>-₹{quote.discountAmount}</span>
            </div>
          )}

          <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
            <div>
              <span className="text-xs text-[#64748B] block font-medium">Estimated Amount</span>
              <span className="text-2xl font-extrabold text-[#5835F5]">
                ₹{quote ? quote.finalAmount : 0}
              </span>
            </div>
            {calculatingQuote && (
              <span className="text-xs text-[#5835F5] font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 animate-spin" /> Authoritative sync...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Continue Action */}
      <div className="pt-6">
        <button
          onClick={() => navigate('/review')}
          className="w-full py-4 rounded-2xl bg-[#5835F5] hover:bg-[#4020D8] text-white font-bold text-sm shadow-xl shadow-indigo-200 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <span>Review Order & Pay</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
