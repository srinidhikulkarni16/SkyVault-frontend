import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, Cloud, Loader2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const PERKS = ['15 GB free storage', 'AES-256 encryption', 'File sharing & public links', 'Access from any device'];

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form,    setForm]    = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState({ pwd: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())               e.name = 'Name is required';
    if (!form.email)                     e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password)                  e.password = 'Password is required';
    else if (form.password.length < 6)   e.password = 'At least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    const { confirmPassword, ...data } = form;
    const result = await register(data);
    setLoading(false);
    if (result.success) { toast.success('Account created! Welcome 🎉'); navigate('/', { replace: true }); }
  };

  const Field = ({ label, name, type = 'text', placeholder, showToggle, showVal, onToggle }) => (
    <div>
      <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={showToggle ? (showVal ? 'text' : 'password') : type}
          name={name}
          value={form[name]}
          onChange={onChange}
          className="input"
          placeholder={placeholder}
          style={{ borderColor: errors[name] ? 'var(--danger)' : undefined, paddingRight: showToggle ? 36 : undefined }}
        />
        {showToggle && (
          <button type="button" onClick={onToggle} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}>
            {showVal ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {errors[name] && <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: 4 }}>{errors[name]}</p>}
    </div>
  );

  return (
    <div className="auth-bg" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Form side */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div className="auth-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28, justifyContent: 'center' }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cloud size={18} color="#fff" />
            </div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.15rem' }}>SkyVault</span>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>Create account</h1>
            <p style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>Get 15 GB free storage, no credit card needed</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Full name" name="name" placeholder="John Doe" />
            <Field label="Email address" name="email" type="email" placeholder="you@example.com" />
            <Field label="Password" name="password" placeholder="Min. 6 characters"
              showToggle onToggle={() => setShowPwd((p) => ({ ...p, pwd: !p.pwd }))} showVal={showPwd.pwd} />
            <Field label="Confirm password" name="confirmPassword" placeholder="Repeat password"
              showToggle onToggle={() => setShowPwd((p) => ({ ...p, confirm: !p.confirm }))} showVal={showPwd.confirm} />

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : null}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-3)', marginTop: 20 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--brand-light)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>

      {/* Branding side */}
      <div className="auth-panel" style={{ display: 'none', width: '44%', margin: 24, borderRadius: 'var(--radius-xl)', flexDirection: 'column', justifyContent: 'center', gap: 32 }}
        ref={(el) => { if (el) el.style.display = window.innerWidth >= 1024 ? 'flex' : 'none'; }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <Cloud size={28} color="#fff" />
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.4rem', color: '#fff' }}>SkyVault</span>
          </div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 12 }}>
            Join millions who trust us with their files
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontSize: '0.9375rem' }}>
            Cloud storage built for speed, security, and simplicity.
          </p>
        </div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {PERKS.map((perk) => (
            <div key={perk} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CheckCircle size={16} color="rgba(255,255,255,0.8)" />
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9375rem' }}>{perk}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Register;