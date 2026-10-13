import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, AlertCircle, CreditCard, Building2, Check, ShieldCheck, Printer } from 'lucide-react';
import { usePrintOrder } from '../context/PrintOrderContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../services/api';

export const ReviewPayScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedCollege, selectedMachine, selectedDocuments, printOptions, quote } = usePrintOrder();

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    if (!selectedCollege || !selectedMachine) {
      setError('Please select a college and kiosk machine');
      return;
    }

    if (selectedDocuments.length === 0) {
      setError('Please upload at least one document');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Create authoritative order on backend
      const newOrder = await orderApi.createOrder({
        collegeId: selectedCollege.id,
        machineId: selectedMachine.id,
        documentIds: selectedDocuments.map((d) => d.id),
        colorMode: printOptions.colorMode,
        printSides: printOptions.printSides,
        copies: printOptions.copies,
      });

      // Navigate to payment processing screen
      navigate('/processing', {
        state: {
          orderId: newOrder.id,
          orderRef: newOrder.publicOrderReference,
          amount: newOrder.finalAmount,
          paymentMethod,
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create order';
      setError(msg);
      setSubmitting(false);
    }
  };

  const finalPayable = quote ? quote.finalAmount : 0;

  return (
    <div className="min-h-screen bg-[#F8F9FD] max-w-md mx-auto flex flex-col justify-between p-5">
      <div>
        {/* Top Header */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => navigate('/options')}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span className="text-xl font-bold">←</span>
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-[#101735]">Review & Pay</h1>
            <p className="text-xs text-[#64748B]">Verify order details before payment</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-red-700 text-xs font-semibold animate-fadeIn">
            <AlertCircle className="w-4.5 h-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Selected Kiosk Banner */}
        {selectedMachine && (
          <div className="mb-4 p-3.5 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#F1EDFF] text-[#5835F5] flex items-center justify-center shrink-0">
                <Printer className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#101735] truncate">{selectedMachine.machineName}</h4>
                <p className="text-[11px] text-[#64748B] truncate">{selectedMachine.locationDescription}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/home')}
              className="text-xs font-bold text-[#5835F5] hover:underline shrink-0"
            >
              Change
            </button>
          </div>
        )}

        {/* Order Summary Card */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs mb-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-[#101735]">Order Summary</h2>
            <button
              onClick={() => navigate('/options')}
              className="flex items-center gap-1 text-xs font-bold text-[#5835F5] hover:underline"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          </div>

          {/* Files List with Pages */}
          <div className="space-y-2 border-b border-gray-100 pb-3">
            {selectedDocuments.map((doc) => (
              <div key={doc.id} className="flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-700 truncate max-w-[200px]">
                  📄 {doc.originalFilename}
                </span>
                <span className="text-[#64748B] font-mono font-medium">
                  {doc.pageCount} {doc.pageCount === 1 ? 'page' : 'pages'}
                </span>
              </div>
            ))}
          </div>

          {/* Print Options Breakdown */}
          <div className="space-y-2 text-xs border-b border-gray-100 pb-3">
            <div className="flex justify-between text-gray-600">
              <span>Color Mode</span>
              <span className="font-bold text-[#101735]">
                {printOptions.colorMode === 'COLOR' ? 'Color (₹5/page)' : 'Black & White (₹1/page)'}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Print Sides</span>
              <span className="font-bold text-[#101735]">
                {printOptions.printSides === 'DOUBLE' ? 'Double Side (30% off)' : 'Single Side'}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Copies</span>
              <span className="font-bold text-[#101735]">{printOptions.copies}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Total Printable Pages</span>
              <span className="font-bold text-[#101735]">
                {quote ? quote.totalChargeablePages : 0} pages
              </span>
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="space-y-1.5 text-xs">
            {quote && (
              <>
                <div className="flex justify-between text-gray-600">
                  <span>Base Charge</span>
                  <span>₹{quote.baseAmount}</span>
                </div>
                {quote.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Double-Side 30% Discount</span>
                    <span>-₹{quote.discountAmount}</span>
                  </div>
                )}
              </>
            )}

            <div className="pt-2 flex justify-between items-center">
              <span className="text-sm font-extrabold text-[#101735]">Total Amount</span>
              <span className="text-2xl font-extrabold text-[#5835F5]">
                ₹{finalPayable}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="space-y-2.5">
          <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-wider px-1">
            Payment Method
          </h2>

          {/* UPI */}
          <div
            onClick={() => setPaymentMethod('UPI')}
            className={`p-4 rounded-2xl border-2 bg-white flex items-center justify-between cursor-pointer transition-all active:scale-98 ${
              paymentMethod === 'UPI' ? 'border-[#5835F5] shadow-xs' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#5835F5] flex items-center justify-center text-lg font-bold">
                📱
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#101735]">UPI</h4>
                <p className="text-[11px] text-[#64748B]">Google Pay, PhonePe, Paytm, BHIM</p>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'UPI' ? 'border-[#5835F5] bg-[#5835F5] text-white' : 'border-gray-300'
              }`}
            >
              {paymentMethod === 'UPI' && <Check className="w-3 h-3 stroke-3" />}
            </div>
          </div>

          {/* Card */}
          <div
            onClick={() => setPaymentMethod('CARD')}
            className={`p-4 rounded-2xl border-2 bg-white flex items-center justify-between cursor-pointer transition-all active:scale-98 ${
              paymentMethod === 'CARD' ? 'border-[#5835F5] shadow-xs' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#101735]">Cards</h4>
                <p className="text-[11px] text-[#64748B]">Credit & Debit cards</p>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'CARD' ? 'border-[#5835F5] bg-[#5835F5] text-white' : 'border-gray-300'
              }`}
            >
              {paymentMethod === 'CARD' && <Check className="w-3 h-3 stroke-3" />}
            </div>
          </div>

          {/* Net Banking */}
          <div
            onClick={() => setPaymentMethod('NETBANKING')}
            className={`p-4 rounded-2xl border-2 bg-white flex items-center justify-between cursor-pointer transition-all active:scale-98 ${
              paymentMethod === 'NETBANKING' ? 'border-[#5835F5] shadow-xs' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#101735]">Net Banking</h4>
                <p className="text-[11px] text-[#64748B]">All major banks supported</p>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'NETBANKING' ? 'border-[#5835F5] bg-[#5835F5] text-white' : 'border-gray-300'
              }`}
            >
              {paymentMethod === 'NETBANKING' && <Check className="w-3 h-3 stroke-3" />}
            </div>
          </div>
        </div>
      </div>

      {/* Pay CTA */}
      <div className="pt-6 space-y-2">
        <button
          onClick={handlePay}
          disabled={submitting}
          className="w-full py-4 rounded-2xl bg-[#5835F5] hover:bg-[#4020D8] text-white font-bold text-base shadow-xl shadow-indigo-300/60 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span>{submitting ? 'Creating Order...' : `Pay ₹${finalPayable}`}</span>
        </button>

        <p className="text-[11px] text-center text-[#64748B] flex items-center justify-center gap-1 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
          Bank-grade 256-bit SSL encrypted payment
        </p>
      </div>
    </div>
  );
};
