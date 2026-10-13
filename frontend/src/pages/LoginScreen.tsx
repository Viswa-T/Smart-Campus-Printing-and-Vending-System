import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Printer, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import { GoogleLogin } from '@react-oauth/google';


export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot password dialog state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide both your college email and password');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/home');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;

    try {
      await authApi.forgotPassword(forgotEmail.trim());
      setForgotMsg('If your account exists, a reset instruction has been sent.');
    } catch {
      setForgotMsg('If your account exists, a reset instruction has been sent.');
    }
  };

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto p-6 flex flex-col justify-between">
      {/* Top Bar with Branding */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span className="text-xl font-bold">←</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#5835F5] flex items-center justify-center text-white">
              <Printer className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-[#101735]">XeroxGo</span>
          </div>
          <div className="w-10" />
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-[#101735]">Welcome Back</h1>
          <p className="text-sm text-[#64748B] mt-1">Login to continue printing</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-red-700 text-xs font-semibold animate-fadeIn">
            <AlertCircle className="w-4.5 h-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#101735] mb-1.5">
              College Email / ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4.5 h-4.5" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:border-[#5835F5] focus:ring-2 focus:ring-[#5835F5]/20 focus:outline-hidden text-sm text-[#101735] bg-gray-50/40"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#101735] mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4.5 h-4.5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-11 py-3.5 rounded-2xl border border-gray-200 focus:border-[#5835F5] focus:ring-2 focus:ring-[#5835F5]/20 focus:outline-hidden text-sm text-[#101735] bg-gray-50/40"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => setShowForgot(true)}
              className="text-xs font-semibold text-[#5835F5] hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-[#5835F5] hover:bg-[#4020D8] text-white font-bold text-sm shadow-xl shadow-indigo-200 active:scale-98 transition-all disabled:opacity-60 mt-3"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-7 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <span className="relative bg-white px-3 text-xs text-[#64748B] font-medium">
            or continue with
          </span>
        </div>

        {/* Google Continue Button */}
        {/* Google Sign-In */}
        <div className="w-full flex justify-center">
          <GoogleLogin
            text="continue_with"
            shape="rectangular"
            theme="outline"
            width="320"
            onSuccess={async (response) => {
              if (!response.credential) {
                setError('Google did not return a credential.');
                return;
              }

              setError(null);
              setLoading(true);

              try {
                await googleLogin(response.credential);
                navigate('/home');
              } catch (err: unknown) {
                const message =
                  err instanceof Error
                    ? err.message
                    : 'Google login failed. Please try again.';

                setError(message);
              } finally {
                setLoading(false);
              }
            }}
            onError={() => {
              setError('Google sign-in failed. Please try again.');
            }}
          />
        </div>
      </div>

      {/* Bottom Registration Link */}
      <div className="pt-6 text-center text-xs text-[#64748B]">
        <span>Don't have an account? </span>
        <Link to="/register" className="font-bold text-[#5835F5] hover:underline">
          Register
        </Link>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl modal-enter">
            <h3 className="text-lg font-bold text-[#101735]">Reset Password</h3>
            <p className="text-xs text-[#64748B] mt-1 mb-4">
              Enter your college email address to receive reset instructions.
            </p>

            {forgotMsg ? (
              <div className="p-3 bg-green-50 text-green-800 rounded-xl text-xs font-semibold mb-4">
                {forgotMsg}
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="your.email@college.edu"
                  className="w-full px-3.5 py-3 rounded-xl border border-gray-200 text-xs text-[#101735]"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#5835F5] text-white font-bold text-xs"
                >
                  Send Reset Link
                </button>
              </form>
            )}

            <button
              onClick={() => {
                setShowForgot(false);
                setForgotMsg(null);
              }}
              className="w-full mt-3 py-2 text-xs text-gray-500 font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
