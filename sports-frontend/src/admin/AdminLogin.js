import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight, ArrowLeft, KeyRound } from 'lucide-react';

export default function AdminLogin() {
  const { loginAdmin, isAdminAuthenticated, loading } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // If already authenticated as admin, redirect to dashboard
  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdminAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide both admin email and password.');
      return;
    }

    const result = await loginAdmin(email, password);
    if (result.success) {
      navigate('/admin/dashboard', { replace: true });
    } else {
      setError(result.error);
    }
  };

  const handleFillCredentials = () => {
    setEmail('admin@sportsstore.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#1e293b] text-white p-6 text-center relative">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-3">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <div className="inline-block bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-1">
            Restricted Access
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            SPORTS<span className="text-amber-400">STORE</span> ADMIN
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Management Portal • Authorized Staff Only
          </p>
        </div>

        {/* Login Form Body */}
        <div className="p-6 sm:p-8 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sportsstore.com"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Master Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1e293b] hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer pt-3"
            >
              {loading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>Log In to Dashboard</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Quick Credential Pre-fill for Reviewers */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-900 flex items-center gap-1">
                <KeyRound size={13} className="text-amber-700" />
                Evaluation Credentials:
              </span>
              <button
                type="button"
                onClick={handleFillCredentials}
                className="text-[11px] font-bold text-blue-700 hover:underline bg-white px-2 py-0.5 rounded border border-amber-300 shadow-2xs"
              >
                Auto-fill
              </button>
            </div>
            <div className="text-[11px] text-amber-800">
              <p>Email: <span className="font-mono font-bold">admin@sportsstore.com</span></p>
              <p>Password: <span className="font-mono font-bold">admin123</span></p>
            </div>
          </div>

          {/* Return to Storefront */}
          <div className="text-center pt-2 border-t border-slate-100">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition"
            >
              <ArrowLeft size={14} />
              <span>Return to Customer Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
