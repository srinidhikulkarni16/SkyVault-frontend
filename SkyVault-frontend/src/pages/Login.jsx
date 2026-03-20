import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, Cloud, Loader2, ShieldCheck, Zap, Globe } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

const FEATURES = [
  { icon: ShieldCheck, label: 'AES-256 Encryption', sub: 'Military-grade security' },
  { icon: Zap, label: 'Lightning Fast Uploads', sub: 'Multipart & resumable' },
  { icon: Globe, label: 'Access Anywhere', sub: 'Web, mobile, desktop' },
];

const Login = () => {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    const ok = await login(form);
    setLoading(false);
    if (ok) {
      toast.success('Welcome back!');
      navigate('/', { replace: true });
    }
  };

  const handleGoogle = async (res) => {
    setGoogleLoading(true);
    const { success } = await googleLogin({ token: res.credential });
    setGoogleLoading(false);
    if (success) {
      toast.success('Signed in with Google');
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-stone-50 font-sans text-stone-800 selection:bg-lime-800 selection:text-white">
      
      {/* Branding Section (Hidden on mobile, split screen on desktop) */}
      <section className="hidden md:flex md:w-1/2 bg-gradient-to-br from-stone-900 to-lime-950 text-stone-100 p-12 lg:p-20 flex-col justify-between relative overflow-hidden shadow-2xl">
        {/* Decorative background blur */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-lime-800/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-t from-stone-900/80 to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-col h-full justify-center">
          <div className="flex items-center gap-3 mb-16">
            <div className="p-2 bg-lime-800 rounded-xl shadow-lg shadow-lime-900/50">
              <Cloud size={28} className="text-lime-100" />
            </div>
            <span className="text-2xl font-bold tracking-widest uppercase text-stone-100">SkyVault</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
            Your files.<br />
            <span className="text-lime-400">Your vault.</span>
          </h2>
          <p className="text-lg text-stone-300 mb-12 max-w-md leading-relaxed">
            Store, share, and access your files from anywhere with enterprise-grade security tailored for modern teams.
          </p>

          <div className="space-y-6">
            {FEATURES.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 cursor-default">
                <div className="p-3 bg-lime-800/40 rounded-xl text-lime-400">
                  <Icon size={22} />
                </div>
                <div>
                  <p className="font-semibold text-stone-100 text-lg">{label}</p>
                  <p className="text-stone-400 text-sm mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Login Form Section */}
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
            <h1 className="text-4xl font-bold text-stone-900 mb-3 tracking-tight">Welcome back</h1>
            <p className="text-stone-500 text-lg">Sign in to your account to continue</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            {/* Email Field */}
            <div className="space-y-2">
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
                  placeholder="you@example.com"
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl border bg-white focus:outline-none focus:ring-4 transition-all duration-300 shadow-sm ${
                    errors.email 
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-100' 
                      : 'border-stone-300 focus:border-lime-700 focus:ring-lime-700/10'
                  }`}
                />
              </div>
              {errors.email && <span className="text-sm text-red-500 font-medium">{errors.email}</span>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
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
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 py-3.5 rounded-xl border bg-white focus:outline-none focus:ring-4 transition-all duration-300 shadow-sm ${
                    errors.password 
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-100' 
                      : 'border-stone-300 focus:border-lime-700 focus:ring-lime-700/10'
                  }`}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-400 hover:text-stone-700 transition-colors focus:outline-none"
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="text-sm text-red-500 font-medium">{errors.password}</span>}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-lime-800 hover:bg-lime-900 text-white rounded-xl font-bold shadow-lg shadow-lime-900/20 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-stone-200"></div>
            <span className="flex-shrink-0 mx-4 text-stone-400 text-sm font-medium uppercase tracking-wider">Or continue with</span>
            <div className="flex-grow border-t border-stone-200"></div>
          </div>

          <div className="flex justify-center w-full">
            {googleLoading ? (
              <div className="w-full py-3 flex justify-center border border-stone-200 rounded-xl bg-stone-100 shadow-sm">
                 <Loader2 size={24} className="text-stone-400 animate-spin" />
              </div>
            ) : (
              <div className="w-full flex justify-center [&>div]:w-full transition-transform hover:scale-[1.01] active:scale-[0.99]">
                <GoogleLogin 
                  onSuccess={handleGoogle} 
                  onError={() => toast.error('Google login failed')} 
                  width="100%"
                  size="large"
                  theme="outline"
                  shape="rectangular"
                />
              </div>
            )}
          </div>

          <footer className="text-center pt-6">
            <p className="text-stone-500 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-lime-700 font-bold hover:text-lime-800 hover:underline decoration-2 underline-offset-4 transition-all">
                Create one free
              </Link>
            </p>
          </footer>
        </div>
      </section>
    </div>
  );
};

export default Login;