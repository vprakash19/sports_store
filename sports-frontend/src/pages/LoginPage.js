import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  User,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  CheckCircle2,
  Phone
} from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login: userLogin, register: userRegister, isAuthenticated: isUserAuth } = useUser();
  const { loginAdmin, isAdminAuthenticated } = useAdminAuth();

  // Mode: null (selection screen), 'user', or 'admin'
  const [selectedRole, setSelectedRole] = useState(null);

  // User tab: 'login' or 'register'
  const [userTab, setUserTab] = useState('login');

  // User form fields
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [showUserPassword, setShowUserPassword] = useState(false);

  // Registration fields
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Admin form fields
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Status feedback
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Inspect path & query param e.g. /admin/login or /login?type=admin
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    if (type === 'admin' || location.pathname === '/admin/login') {
      setSelectedRole('admin');
    } else if (type === 'user') {
      setSelectedRole('user');
    }
  }, [location.search, location.pathname]);

  // If already logged in, redirect accordingly
  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    } else if (isUserAuth) {
      navigate('/', { replace: true });
    }
  }, [isAdminAuthenticated, isUserAuth, navigate]);

  // Clear errors on role change
  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setError('');
    setSuccessMsg('');
  };

  const handleBackToSelection = () => {
    setSelectedRole(null);
    setError('');
    setSuccessMsg('');
  };

  // Submit User Login
  const handleUserLoginSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent duplicate submission
    setError('');
    setSuccessMsg('');

    if (!userEmail.trim() || !userPassword.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      const result = await userLogin(userEmail, userPassword);
      if (result && result.success) {
        setSuccessMsg(`Welcome, ${result.customer.firstName}! Redirecting to Storefront...`);
        navigate('/', { replace: true });
      } else {
        setError(result?.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login submit error:', err);
      setError(err?.friendlyMessage || err?.message || 'An unexpected error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Submit User Registration
  const handleUserRegisterSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent duplicate submission
    setError('');
    setSuccessMsg('');

    if (!regFirstName.trim()) {
      setError('Please enter your first name.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (regPassword.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const result = await userRegister({
        firstName: regFirstName,
        lastName: regLastName,
        email: regEmail,
        phone: regPhone,
        password: regPassword
      });

      if (result && result.success) {
        setSuccessMsg(`Account created! Welcome, ${result.customer.firstName}. Redirecting...`);
        navigate('/', { replace: true });
      } else {
        setError(result?.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration submit error:', err);
      setError(err?.friendlyMessage || err?.message || 'An unexpected error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Admin Login
  const handleAdminLoginSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent duplicate submission
    setError('');
    setSuccessMsg('');

    if (!adminEmail.trim() || !adminPassword.trim()) {
      setError('Please provide both admin email and password.');
      return;
    }

    setLoading(true);
    try {
      const result = await loginAdmin(adminEmail, adminPassword);
      if (result && result.success) {
        setSuccessMsg('Admin authorized! Opening Dashboard...');
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError(result?.error || 'Access denied. Invalid admin credentials.');
      }
    } catch (err) {
      console.error('Admin login submit error:', err);
      setError(err?.friendlyMessage || err?.message || 'An error occurred during admin authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Branding Header */}
        <div className="bg-[#1e293b] text-white p-6 sm:p-7 text-center relative">
          <Link to="/" className="inline-flex items-center gap-2 group mb-3">
            <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center shadow-md">
              {/* Runner Logo */}
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
                <circle cx="16" cy="4" r="2" />
                <path d="M19 8.5c-.8 0-1.5.3-2.1.8L15 11l-2.4-1.2c-.8-.4-1.8-.3-2.4.3L6.5 13.5l1.4 1.4 2.8-2.6 1.8.9-2.2 5.3 1.8.8 2.5-6.1 1.7.9V20h2v-7.2l-2-1 1.6-1.5c.3-.3.7-.4 1.1-.4h1.7V8.5H19z" />
              </svg>
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              SPORTS<span className="text-amber-400">STORE</span>
            </span>
          </Link>

          <p className="text-xs text-slate-300 font-medium">
            {selectedRole === null
              ? 'Welcome! Please select your account type.'
              : selectedRole === 'user'
              ? 'Customer Authentication Portal'
              : 'Administrative Management Portal'}
          </p>
        </div>

        {/* Feedback Banners */}
        {error && (
          <div className="mx-6 mt-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mx-6 mt-5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* STEP 1: ACCOUNT TYPE SELECTION SCREEN */}
        {selectedRole === null && (
          <div className="p-6 sm:p-8 space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center mb-2">
              Select Your Portal
            </p>

            {/* Option 1: USER LOGIN */}
            <button
              onClick={() => handleSelectRole('user')}
              className="w-full text-left p-4 rounded-2xl border-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50/40 transition group flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition">
                    USER LOGIN
                  </h3>
                  <p className="text-xs text-slate-500">
                    Shop sports products and manage your orders.
                  </p>
                </div>
              </div>
              <ArrowRight size={18} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
            </button>

            {/* Option 2: ADMIN LOGIN */}
            <button
              onClick={() => handleSelectRole('admin')}
              className="w-full text-left p-4 rounded-2xl border-2 border-slate-200 hover:border-amber-500 hover:bg-amber-50/40 transition group flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-slate-950 transition">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-amber-700 transition">
                      ADMIN LOGIN
                    </h3>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      Staff
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Manage customers and orders.
                  </p>
                </div>
              </div>
              <ArrowRight size={18} className="text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition" />
            </button>

            {/* Guest Storefront Link */}
            <div className="pt-4 text-center border-t border-slate-100">
              <Link
                to="/shop"
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition inline-flex items-center gap-1.5"
              >
                <ShoppingBag size={14} />
                <span>Browse Store as Guest</span>
              </Link>
            </div>
          </div>
        )}

        {/* STEP 2A: USER LOGIN / SIGNUP FORM */}
        {selectedRole === 'user' && (
          <div className="p-6 sm:p-8 space-y-4">
            {/* Back Button */}
            <button
              type="button"
              onClick={handleBackToSelection}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1.5 transition mb-1"
            >
              <ArrowLeft size={14} />
              <span>Back to Account Selection</span>
            </button>

            {/* Tab Switcher: Sign In vs Sign Up */}
            <div className="flex border-b border-slate-200 pt-1">
              <button
                type="button"
                onClick={() => {
                  setUserTab('login');
                  setError('');
                }}
                className={`flex-1 pb-3 text-center text-xs font-black uppercase tracking-wider border-b-2 transition ${
                  userTab === 'login'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setUserTab('register');
                  setError('');
                }}
                className={`flex-1 pb-3 text-center text-xs font-black uppercase tracking-wider border-b-2 transition ${
                  userTab === 'register'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* User Sign In Tab */}
            {userTab === 'login' && (
              <form onSubmit={handleUserLoginSubmit} className="space-y-4 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showUserPassword ? 'text' : 'password'}
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowUserPassword(!showUserPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showUserPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      <span>Authenticating...</span>
                    </span>
                  ) : (
                    <>
                      <span>Sign In to Store</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* User Registration Tab */}
            {userTab === 'register' && (
              <form onSubmit={handleUserRegisterSubmit} className="space-y-3 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={regFirstName}
                      onChange={(e) => setRegFirstName(e.target.value)}
                      placeholder="First name"
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={regLastName}
                      onChange={(e) => setRegLastName(e.target.value)}
                      placeholder="Last name"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 4 chars"
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Confirm *
                    </label>
                    <input
                      type="password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Repeat"
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      <span>Creating Account...</span>
                    </span>
                  ) : (
                    <span>Create Account & Log In</span>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* STEP 2B: ADMIN LOGIN FORM */}
        {selectedRole === 'admin' && (
          <div className="p-6 sm:p-8 space-y-4">
            {/* Back Button */}
            <button
              type="button"
              onClick={handleBackToSelection}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1.5 transition mb-1"
            >
              <ArrowLeft size={14} />
              <span>Back to Account Selection</span>
            </button>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 flex items-center gap-2">
              <ShieldCheck size={18} className="text-amber-600 shrink-0" />
              <span>Restricted management portal. Authorized administrative credentials required.</span>
            </div>

            <form onSubmit={handleAdminLoginSubmit} className="space-y-4 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@sportsstore.com"
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Admin Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter admin password"
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showAdminPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1e293b] hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Verifying credentials...</span>
                  </span>
                ) : (
                  <>
                    <span>Log In to Admin Dashboard</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
