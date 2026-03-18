import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, Cloud } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const result = await login(formData);
    setLoading(false);
    
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-600 items-center justify-center p-12">
        <div className="max-w-md text-pink">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
              <Cloud className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold tracking-tight">SkyVault</span>
          </div>
          <h1 className="text-4xl font-bold mb-6">Secure Cloud Storage for Your Digital Life</h1>
          <p className="text-lg text-primary-100 leading-relaxed">
            Store, share, and collaborate on your files from anywhere. Simple, secure, and built for you.
          </p>
          
          <div className="mt-12 grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <p className="text-2xl font-bold">15 GB</p>
              <p className="text-sm text-primary-100">Free storage</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <p className="text-2xl font-bold">AES-256</p>
              <p className="text-sm text-primary-100">Encryption</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <Cloud className="w-10 h-10 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">CloudDrive</span>
          </div>

          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-600 mt-2">Log in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`w-5 h-5 ${errors.email ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg outline-none transition-all ${
                    errors.email 
                      ? 'border-red-300 focus:ring-4 focus:ring-red-50' 
                      : 'border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-50'
                  }`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Link to="/forgot-password" title="Coming soon" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`w-5 h-5 ${errors.password ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 bg-white border rounded-lg outline-none transition-all ${
                    errors.password 
                      ? 'border-red-300 focus:ring-4 focus:ring-red-50' 
                      : 'border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-50'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-pink py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-8">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-50 text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              onClick={() => toast.error('Google login is not configured yet')}
              className="w-full py-3 px-4 bg-white border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
          </div>

          {/* Register Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;