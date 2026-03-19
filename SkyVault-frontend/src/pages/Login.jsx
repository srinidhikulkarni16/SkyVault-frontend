import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, Cloud, Loader2, ShieldCheck, Zap, Globe } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

const FEATURES = [
  { icon: ShieldCheck, label: 'AES-256 Encryption',       sub: 'Military-grade security' },
  { icon: Zap,         label: 'Lightning Fast Uploads',   sub: 'Multipart & resumable' },
  { icon: Globe,       label: 'Access Anywhere',          sub: 'Web, mobile, desktop' },
];

const Login = () => {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();

  const [form,           setForm]           = useState({ email: '', password: '' });
  const [showPwd,        setShowPwd]        = useState(false);
  const [loading,        setLoading]        = useState(false);
  const [googleLoading,  setGoogleLoading]  = useState(false);
  const [errors,         setErrors]         = useState({});

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
    if (ok) { toast.success('Welcome back!'); navigate('/', { replace: true }); }
  };

  const handleGoogle = async (res) => {
    setGoogleLoading(true);
    const { success } = await googleLogin({ token: res.credential });
    setGoogleLoading(false);
    if (success) { toast.success('Signed in with Google'); navigate('/', { replace: true }); }
  };

  return (
    <div className="auth-bg" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left panel */}
      <div className="auth-panel" style={{ display: 'none', width: '48%', margin: 24, borderRadius: 'var(--radius-xl)', flexDirection: 'column', justifyContent: 'space-between' }}
        ref={(el) => { if (el) el.style.display = window.innerWidth >= 1024 ? 'flex' : 'none'; }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cloud size={22} color="#fff" />
            </div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.4rem', color: '#fff' }}>SkyVault</span>
          </div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2.25rem', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: 16 }}>
            Your files.<br />Your vault.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9375rem', lineHeight: 1.7 }}>
            Store, share, and access your files from anywhere with enterprise-grade security.
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {FEATURES.map(({ icon: Icon, label, sub }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-md)', backdropFilter: 'blur(8px)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={16} color="#fff" />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>{label}</p>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)' }}>{sub}</p>
              </div>
            </div>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
            {[['15 GB', 'Free storage'], ['AES-256', 'Encryption']].map(([val, lbl]) => (
              <div key={lbl} style={{ padding: '14px', background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', fontFamily: 'Syne, sans-serif' }}>{val}</p>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)' }}>{lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel – form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div className="auth-card">
          {/* Mobile logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28, justifyContent: 'center' }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cloud size={18} color="#fff" />
            </div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.15rem' }}>SkyVault</span>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>Welcome back</h1>
            <p style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Email */}
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }} />
                <input type="email" name="email" value={form.email} onChange={onChange} className="input" placeholder="you@example.com" style={{ paddingLeft: 32, borderColor: errors.email ? 'var(--danger)' : undefined }} />
              </div>
              {errors.email && <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: 4 }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }} />
                <input type={showPwd ? 'text' : 'password'} name="password" value={form.password} onChange={onChange} className="input" placeholder="••••••••" style={{ paddingLeft: 32, paddingRight: 36, borderColor: errors.password ? 'var(--danger)' : undefined }} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}>
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: 4 }}>{errors.password}</p>}
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : null}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {googleLoading
              ? <Loader2 size={20} style={{ color: 'var(--brand)', animation: 'spin 1s linear infinite' }} />
              : <GoogleLogin onSuccess={handleGoogle} onError={() => toast.error('Google login failed')} theme="filled_black" shape="rectangular" />
            }
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-3)', marginTop: 20 }}>
            No account?{' '}
            <Link to="/register" style={{ color: 'var(--brand-light)', fontWeight: 600, textDecoration: 'none' }}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;