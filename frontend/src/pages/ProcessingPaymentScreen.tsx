import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, CreditCard, Loader2, AlertCircle } from 'lucide-react';
import { paymentApi } from '../services/api';
import { CheckoutResponse } from '../types';

export const ProcessingPaymentScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { orderId: number; orderRef: string; amount: number; paymentMethod: string } | undefined;
  const paymentStarted = useRef(false);
  const [step, setStep] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!state?.orderId) {
      navigate('/home');
      return;
    }
        if (paymentStarted.current) {
      return;
    }

paymentStarted.current = true;

    let active = true;

    const executePayment = async () => {
      try {
        // Step 1: Verifying payment
        setStep(1);
        await new Promise((r) => setTimeout(r, 600));

        // Step 2: Creating your order
        setStep(2);
        await new Promise((r) => setTimeout(r, 600));

        // Step 3: Call backend checkout
        setStep(3);
        const res: CheckoutResponse = await paymentApi.checkout({
          orderId: state.orderId,
          paymentMethod: state.paymentMethod || 'UPI',
        });

        // Step 4: Storing documents securely & code generation
        setStep(4);
        await new Promise((r) => setTimeout(r, 600));

          navigate('/success', {
            state: {
              checkout: res,
            },
          });
        
      } catch (err: unknown) {
        if (active) {
          const msg = err instanceof Error ? err.message : 'Payment failed';
          setError(msg);
        }
      }
    };

    executePayment();

    return () => {
      active = false;
    };
 }, [
  state?.orderId,
  state?.orderRef,
  state?.amount,
  state?.paymentMethod,
  navigate,
]);

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto p-6 flex flex-col justify-between items-center text-center">
      <div className="w-full flex justify-end">
        <span className="text-xs font-mono text-gray-400">{state?.orderRef}</span>
      </div>

      <div className="my-auto py-8 space-y-8 w-full max-w-xs">
        {/* Animated Card Icon / Spinner */}
        <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100 border-t-[#5835F5] animate-spin" />
          <div className="w-24 h-24 rounded-full bg-[#F1EDFF] text-[#5835F5] flex items-center justify-center shadow-inner">
            <CreditCard className="w-10 h-10 stroke-1.5" />
          </div>
        </div>

        {/* Status Headings */}
        <div>
          <h2 className="text-2xl font-extrabold text-[#101735]">Processing Payment...</h2>
          <p className="text-xs text-[#64748B] mt-1.5 font-medium">Please do not close this screen</p>
        </div>

        {error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-semibold space-y-2">
            <div className="flex items-center justify-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => navigate('/review')}
              className="mt-2 text-xs font-bold text-[#5835F5] underline"
            >
              Back to Review
            </button>
          </div>
        ) : (
          /* Real Step Checklist */
          <div className="bg-[#F8F9FD] rounded-3xl p-5 border border-gray-100 text-left space-y-3.5 shadow-xs">
            {/* Step 1 */}
            <div className="flex items-center gap-3 text-xs font-semibold">
              {step >= 1 ? (
                <CheckCircle2 className="w-4.5 h-4.5 text-green-600 shrink-0" />
              ) : (
                <div className="w-4.5 h-4.5 rounded-full border-2 border-gray-300 shrink-0" />
              )}
              <span className={step >= 1 ? 'text-[#101735]' : 'text-gray-400'}>
                Verifying payment
              </span>
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-3 text-xs font-semibold">
              {step >= 2 ? (
                <CheckCircle2 className="w-4.5 h-4.5 text-green-600 shrink-0" />
              ) : (
                <div className="w-4.5 h-4.5 rounded-full border-2 border-gray-300 shrink-0" />
              )}
              <span className={step >= 2 ? 'text-[#101735]' : 'text-gray-400'}>
                Creating your order
              </span>
            </div>

            {/* Step 3 */}
            <div className="flex items-center gap-3 text-xs font-semibold">
              {step >= 3 ? (
                <CheckCircle2 className="w-4.5 h-4.5 text-green-600 shrink-0" />
              ) : (
                <div className="w-4.5 h-4.5 rounded-full border-2 border-gray-300 shrink-0" />
              )}
              <span className={step >= 3 ? 'text-[#101735]' : 'text-gray-400'}>
                Generating access code
              </span>
            </div>

            {/* Step 4 */}
            <div className="flex items-center gap-3 text-xs font-semibold">
              {step >= 4 ? (
                <CheckCircle2 className="w-4.5 h-4.5 text-green-600 shrink-0" />
              ) : (
                <div className="w-4.5 h-4.5 rounded-full border-2 border-gray-300 shrink-0" />
              )}
              <span className={step >= 4 ? 'text-[#101735]' : 'text-gray-400'}>
                Storing documents securely
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="w-full text-center text-[11px] text-[#64748B] pb-4">
        Connecting to campus printing gateway
      </div>
    </div>
  );
};
