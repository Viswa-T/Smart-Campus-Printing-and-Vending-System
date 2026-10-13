import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Printer, X, Sparkles } from 'lucide-react';
import { collectionApi } from '../../services/api';
import { CollectionValidationResult } from '../../types';

export const KioskValidatorModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<CollectionValidationResult | null>(null);
  const [dispensed, setDispensed] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setDispensed(false);

    try {
      const res = await collectionApi.validateCode(code.trim().toUpperCase());
      setResult(res);
      if (!res.valid) {
        setError(res.message);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Validation failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDispense = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await collectionApi.completeCollection(code.trim().toUpperCase());
      setDispensed(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Dispensing failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-gray-100 modal-enter">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#F1EDFF] text-[#5835F5] flex items-center justify-center font-bold text-2xl shadow-inner">
            🖨️
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#101735]">Vending Kiosk Terminal</h2>
            <p className="text-xs text-[#64748B]">Simulate printer kiosk code verification</p>
          </div>
        </div>

        {!dispensed ? (
          <div>
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#101735] uppercase tracking-wider mb-2">
                  Enter 6-Character Access Code
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. A7K9P2"
                  className="w-full text-center text-2xl tracking-widest font-mono font-bold py-3.5 px-4 rounded-xl border-2 border-gray-200 focus:border-[#5835F5] focus:outline-hidden transition-all bg-gray-50/50"
                  autoFocus
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {result && result.valid && (
                <div className="p-4 bg-[#F1EDFF] rounded-2xl border border-indigo-100 space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#5835F5] flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-green-600" /> Print Job Verified
                    </span>
                    <span className="text-xs font-mono font-bold text-gray-700">{result.orderReference}</span>
                  </div>
                  <div className="text-xs text-gray-700 space-y-1">
                    <p><span className="font-semibold">Kiosk:</span> {result.machineName}</p>
                    <p><span className="font-semibold">Specs:</span> {result.totalPages} pages • {result.copies} copy • {result.colorMode} • {result.printSides}</p>
                    {result.documentNames && result.documentNames.length > 0 && (
                      <p><span className="font-semibold">Files:</span> {result.documentNames.join(', ')}</p>
                    )}
                  </div>
                </div>
              )}

              {result && result.valid ? (
                <button
                  type="button"
                  onClick={handleDispense}
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-sm shadow-lg shadow-green-200 hover:shadow-green-300 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Printer className="w-5 h-5" />
                  <span>Dispense Prints & Collect</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !code.trim()}
                  className="w-full py-3.5 rounded-2xl bg-[#5835F5] hover:bg-[#4020D8] text-white font-bold text-sm shadow-md shadow-indigo-200 active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? 'Verifying Code...' : 'Verify Access Code'}
                </button>
              )}
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto text-3xl shadow-inner">
              ✓
            </div>
            <h3 className="text-xl font-bold text-[#101735]">Printing Complete!</h3>
            <p className="text-xs text-gray-600 max-w-xs mx-auto">
              The vending unit has successfully printed and dispensed the job. Order status updated to <span className="font-bold text-green-700">COLLECTED</span>.
            </p>
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-[#5835F5] text-white font-bold text-sm shadow-md shadow-indigo-200 hover:bg-[#4020D8] active:scale-95 transition-all"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
