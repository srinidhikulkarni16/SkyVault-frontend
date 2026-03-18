import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, Cloud } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);
    setLoading(false);
    
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Right Side - Branding (Reversed for variation) */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-600 items-center justify-center p-12 order-last">
        <div className="max-w-md text-pink">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
              <Cloud className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold tracking-tight">SkyVault</span>
          </div>
          <h1 className="text-4xl font-bold mb-6">Join millions of people who trust CloudDrive</h1>
          <p className="text-lg text-primary-100 leading-relaxed">
            Create an account today and get 15 GB of free storage. Experience the next level of file management.
          </p>
          
          <ul className="mt-12 space-y-4">
            {['Bank-level security', 'Real-time collaboration', 'Cross-platform sync', 'Smart organization'].map((item) => (
              <li key={item} className="flex items-center gap-3 text-primary-50">
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Left Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <Cloud className="w-10 h-10 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">CloudDrive</span>
          </div>

          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Create account</h2>
            <p className="text-gray-600 mt-2">Start your 15 GB free storage today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className={`w-5 h-5 ${errors.name ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg outline-none transition-all ${
                    errors.name 
                      ? 'border-red-300 focus:ring-4 focus:ring-red-50' 
                      : 'border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-50'
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
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

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`w-5 h-5 ${errors.confirmPassword ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 bg-white border rounded-lg outline-none transition-all ${
                    errors.confirmPassword 
                      ? 'border-red-300 focus:ring-4 focus:ring-red-50' 
                      : 'border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-50'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-700"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;