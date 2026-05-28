// frontend/src/components/auth/AuthLayout.jsx
// 🎨 Shared layout for Login + Register pages (split-screen design)

import { Link } from 'react-router-dom';
import { Sparkles, Shield, Zap, CheckCircle2 } from 'lucide-react';
import { useTheme } from '@context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const AuthLayout = ({ children, type = 'login' }) => {
  const { toggleTheme, isDark } = useTheme();

  // 🎯 Different content for login vs register
  const brandContent = type === 'login'
    ? {
        title: 'Welcome back!',
        subtitle: 'Continue your journey to landing your dream job with AI-powered insights.',
      }
    : {
        title: 'Start your journey',
        subtitle: 'Join 50,000+ professionals using AI to land their dream jobs.',
      };

  const benefits = [
    { icon: Zap,           text: 'AI-powered resume analysis in seconds'   },
    { icon: Shield,        text: 'Bank-grade security, your data is safe'  },
    { icon: CheckCircle2,  text: 'Free tier - no credit card needed'       },
  ];

  return (
    <div className="min-h-screen flex">
      {/* ════════════════════════════════════ */}
      {/* 🎨 LEFT SIDE - Branded Panel        */}
      {/* (hidden on mobile)                   */}
      {/* ════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600">
        {/* 🌌 Animated background blobs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 grid-pattern opacity-10" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* 🎯 Logo */}
          <Link to="/" className="flex items-center gap-2 group w-fit">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">ResumeAI</span>
          </Link>

          {/* 📝 Main Content */}
          <div>
            <h1 className="text-5xl font-extrabold mb-6 leading-tight">
              {brandContent.title}
            </h1>
            <p className="text-xl text-white/90 mb-12 max-w-md">
              {brandContent.subtitle}
            </p>

            {/* ✅ Benefits */}
            <ul className="space-y-4">
              {benefits.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <li
                    key={i}
                    className="flex items-center gap-3 animate-fade-in-up"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-white/90">{benefit.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 💬 Quote */}
          <div className="glass-card !bg-white/10 !border-white/20 p-6">
            <p className="text-white/95 italic mb-4">
              "ResumeAI helped me land my dream job at Google. The ATS score feature alone was a game-changer!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                SC
              </div>
              <div>
                <div className="font-semibold">Sarah Chen</div>
                <div className="text-sm text-white/70">Software Engineer at Google</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════ */}
      {/* 📝 RIGHT SIDE - Form                 */}
      {/* ════════════════════════════════════ */}
      <div className="flex-1 flex flex-col">
        {/* 🌗 Top bar (theme toggle + back link) */}
        <div className="flex justify-between items-center p-6">
          <Link
            to="/"
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition flex items-center gap-2"
          >
            ← Back to home
          </Link>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          </button>
        </div>

        {/* 📝 Form content (passed as children) */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md animate-fade-in-up">
            {/* 📱 Mobile logo (shown only when left panel is hidden) */}
            <Link to="/" className="lg:hidden flex items-center gap-2 mb-8 justify-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">ResumeAI</span>
            </Link>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;