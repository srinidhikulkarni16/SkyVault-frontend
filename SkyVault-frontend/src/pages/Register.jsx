import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Cloud, Loader2, User, Mail, Lock, ShieldCheck } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: ''
  });

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    const res = await register(form);
    setLoading(false);
    if (res?.success) navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row-reverse bg-stone-50 font-sans text-stone-800 selection:bg-lime-800 selection:text-white">
      
      {/* Branding Section (Hidden on mobile, split screen on desktop) */}
      <section className="hidden md:flex md:w-1/2 bg-gradient-to-bl from-stone-900 to-lime-950 text-stone-100 p-12 lg:p-20 flex-col justify-between relative overflow-hidden shadow-2xl">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-lime-800/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-stone-900/80 to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-col h-full justify-center">
          <div className="flex items-center gap-3 mb-16">
            <div className="p-2 bg-lime-800 rounded-xl shadow-lg shadow-lime-900/50">
              <Cloud size={28} className="text-lime-100" />
            </div>
            <span className="text-2xl font-bold tracking-widest uppercase text-stone-100">SkyVault</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
            Secure your <br />
            <span className="text-lime-400">digital space.</span>
          </h2>
          <p className="text-lg text-stone-300 mb-12 max-w-md leading-relaxed">
            Create an account to securely store, manage, and sign your most important documents from anywhere.
          </p>
          
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm w-max">
             <ShieldCheck size={24} className="text-lime-400" />
             <span className="font-medium text-stone-200">Start with 10GB of encrypted storage</span>
          </div>
        </div>
      </section>

      {/* Register Form Section */}
      <section className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-stone-50 relative">
        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile logo fallback */}
          <div className="flex md:hidden items-center justify-center gap-3 mb-8">
            <div className="p-2 bg-lime-800 rounded-xl shadow-md">
              <Cloud size={24} className="text-lime-100" />
            </div>
            <span className="text-xl font-bold tracking-widest uppercase text-stone-800">SkyVault</span>
          </div>

          <header className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-stone-900 mb-3 tracking-tight">Create Account</h1>
            <p className="text-stone-500 text-lg">Join us and secure your files today</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5 mt-8">
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-stone-700 block">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400 group-focus-within:text-lime-700 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  required
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-300 bg-white focus:outline-none focus:border-lime-700 focus:ring-4 focus:ring-lime-700/10 transition-all duration-300 shadow-sm"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-stone-700 block">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400 group-focus-within:text-lime-700 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-300 bg-white focus:outline-none focus:border-lime-700 focus:ring-4 focus:ring-lime-700/10 transition-all duration-300 shadow-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-stone-700 block">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400 group-focus-within:text-lime-700 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPwd ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-stone-300 bg-white focus:outline-none focus:border-lime-700 focus:ring-4 focus:ring-lime-700/10 transition-all duration-300 shadow-sm"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-400 hover:text-stone-700 transition-colors focus:outline-none"
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-stone-700 block">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400 group-focus-within:text-lime-700 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showConfirmPwd ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={onChange}
                  required
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 py-3 rounded-xl border bg-white focus:outline-none focus:ring-4 transition-all duration-300 shadow-sm ${
                    error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-stone-300 focus:border-lime-700 focus:ring-lime-700/10'
                  }`}
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-400 hover:text-stone-700 transition-colors focus:outline-none"
                >
                  {showConfirmPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {error && <span className="text-sm text-red-500 font-medium inline-block mt-1">{error}</span>}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 mt-4 bg-lime-800 hover:bg-lime-900 text-white rounded-xl font-bold shadow-lg shadow-lime-900/20 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <footer className="text-center pt-6">
            <p className="text-stone-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-lime-700 font-bold hover:text-lime-800 hover:underline decoration-2 underline-offset-4 transition-all">
                Sign in instead
              </Link>
            </p>
          </footer>
        </div>
      </section>
    </div>
  );
};

export default Register;