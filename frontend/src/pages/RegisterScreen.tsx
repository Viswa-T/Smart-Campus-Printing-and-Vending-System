import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User as UserIcon, Mail, Lock, Eye, EyeOff, Printer, AlertCircle, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { collegeApi } from '../services/api';
import { College } from '../types';

export const RegisterScreen: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedCollegeId, setSelectedCollegeId] = useState<number | undefined>(undefined);
  const [colleges, setColleges] = useState<College[]>([]);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    collegeApi.searchColleges({ size: 20 })
      .then((res) => {
        setColleges(res.items);
        if (res.items.length > 0) {
          setSelectedCollegeId(res.items[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        confirmPassword,
        collegeId: selectedCollegeId,
      });
      navigate('/home');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto p-6 flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/login')}
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
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-[#101735]">Create Account</h1>
          <p className="text-sm text-[#64748B] mt-1">Join XeroxGo to start printing</p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-red-700 text-xs font-semibold animate-fadeIn">
            <AlertCircle className="w-4.5 h-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-[#101735] mb-1.5">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <UserIcon className="w-4.5 h-4.5" />
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Arun Kumar"
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:border-[#5835F5] focus:ring-2 focus:ring-[#5835F5]/20 focus:outline-hidden text-sm text-[#101735] bg-gray-50/40"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-[#101735] mb-1.5">College Email / ID</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4.5 h-4.5" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. arun@psgtech.ac.in"
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:border-[#5835F5] focus:ring-2 focus:ring-[#5835F5]/20 focus:outline-hidden text-sm text-[#101735] bg-gray-50/40"
                required
              />
            </div>
          </div>

          {/* College Selection */}
          <div>
            <label className="block text-xs font-bold text-[#101735] mb-1.5">Select Your College</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Building2 className="w-4.5 h-4.5" />
              </div>
              <select
                value={selectedCollegeId}
                onChange={(e) => setSelectedCollegeId(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:border-[#5835F5] focus:ring-2 focus:ring-[#5835F5]/20 focus:outline-hidden text-sm text-[#101735] bg-gray-50/40 appearance-none cursor-pointer"
              >
                {colleges.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.collegeName} ({c.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-[#101735] mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4.5 h-4.5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-[#101735] mb-1.5">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4.5 h-4.5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:border-[#5835F5] focus:ring-2 focus:ring-[#5835F5]/20 focus:outline-hidden text-sm text-[#101735] bg-gray-50/40"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-[#5835F5] hover:bg-[#4020D8] text-white font-bold text-sm shadow-xl shadow-indigo-200 active:scale-98 transition-all disabled:opacity-60 mt-4"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
      </div>

      <div className="pt-6 text-center text-xs text-[#64748B]">
        <span>Already have an account? </span>
        <Link to="/login" className="font-bold text-[#5835F5] hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
};
