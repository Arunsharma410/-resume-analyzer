// frontend/src/pages/RegisterPage.jsx
// 📝 Register Page

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import AuthLayout from '@components/auth/AuthLayout';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  // 📝 Form state
  const [formData, setFormData] = useState({
    name:            '',
    email:           '',
    password:        '',
    confirmPassword: '',
  });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed]   = useState(false);

  // 📥 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // 💪 Password strength indicator
  const getPasswordStrength = () => {
    const { password } = formData;
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (password.length >= 6)        strength++;
    if (password.length >= 10)       strength++;
    if (/[A-Z]/.test(password))      strength++;
    if (/[0-9]/.test(password))      strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { strength: 0, label: '',          color: 'bg-slate-200' },
      { strength: 1, label: 'Weak',      color: 'bg-red-500'   },
      { strength: 2, label: 'Fair',      color: 'bg-orange-500' },
      { strength: 3, label: 'Good',      color: 'bg-yellow-500' },
      { strength: 4, label: 'Strong',    color: 'bg-green-500' },
      { strength: 5, label: 'Excellent', color: 'bg-green-600' },
    ];

    return levels[strength];
  };

  const passwordStrength = getPasswordStrength();

  // ✅ Validate form
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreed) {
      newErrors.agreed = 'You must agree to the Terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🚀 Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    const { name, email, password } = formData;
    const result = await register({ name, email, password });
    setLoading(false);

    if (result.success) {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <AuthLayout type="register">
      {/* 📌 Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Create your account
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline font-semibold">
            Sign in
          </Link>
        </p>
      </div>

      {/* 📝 Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Full name"
          type="text"
          name="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          icon={User}
          required
          autoComplete="name"
        />

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

        <div>
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="At least 6 characters"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={Lock}
            required
            autoComplete="new-password"
          />

          {/* 💪 Password strength indicator */}
          {formData.password && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      i <= passwordStrength.strength
                        ? passwordStrength.color
                        : 'bg-slate-200 dark:bg-white/10'
                    }`}
                  />
                ))}
              </div>
              {passwordStrength.label && (
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Password strength: <span className="font-semibold">{passwordStrength.label}</span>
                </p>
              )}
            </div>
          )}
        </div>

        <Input
          label="Confirm password"
          type="password"
          name="confirmPassword"
          placeholder="Re-enter your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          icon={Lock}
          required
          autoComplete="new-password"
        />

        {/* ☑️ Terms checkbox */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                if (errors.agreed) setErrors((prev) => ({ ...prev, agreed: '' }));
              }}
              className="mt-1 w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              I agree to the{' '}
              <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Privacy Policy</a>
            </span>
          </label>
          {errors.agreed && (
            <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
              {errors.agreed}
            </p>
          )}
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
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      {/* ✨ What you get */}
      <div className="mt-8 p-4 rounded-xl bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20">
        <p className="text-sm font-semibold text-primary-900 dark:text-primary-300 mb-2">
          ✨ What you get for free:
        </p>
        <ul className="space-y-1">
          {[
            '5 free resume analyses per month',
            'Full ATS compatibility scoring',
            'Skills gap analysis',
            'No credit card required',
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;