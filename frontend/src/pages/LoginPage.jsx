// frontend/src/pages/LoginPage.jsx
// 🔑 Login Page

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import AuthLayout from '@components/auth/AuthLayout';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 🎯 Where to redirect after login (default: dashboard)
  const from = location.state?.from?.pathname || '/dashboard';

  // 📝 Form state
  const [formData, setFormData] = useState({
    email:    '',
    password: '',
  });
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);

  // 📥 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // ✅ Validate form
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🚀 Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    const result = await login(formData);
    setLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    }
    // Error toast is shown automatically by AuthContext
  };

  return (
    <AuthLayout type="login">
      {/* 📌 Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Sign in to your account
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 dark:text-primary-400 hover:underline font-semibold">
            Sign up free
          </Link>
        </p>
      </div>

      {/* 📝 Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email address"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={Mail}
          required
          autoComplete="email"
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          icon={Lock}
          required
          autoComplete="current-password"
        />

        {/* 🔐 Remember me + Forgot password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-slate-600 dark:text-slate-400">Remember me</span>
          </label>

          <a href="#" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
            Forgot password?
          </a>
        </div>

        {/* 🚀 Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          icon={ArrowRight}
          iconPosition="right"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      {/* ➖ Divider */}
      <div className="my-6 flex items-center gap-4">
        <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
        <span className="text-sm text-slate-500 dark:text-slate-400">Or</span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
      </div>

      {/* 🌐 Social Login (UI only — would need OAuth setup to work) */}
      <Button
        variant="secondary"
        fullWidth
        size="lg"
        onClick={() => alert('Social login coming soon!')}
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </Button>

      {/* 📜 Terms */}
      <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
        By signing in, you agree to our{' '}
        <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Terms</a>
        {' '}and{' '}
        <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Privacy Policy</a>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;