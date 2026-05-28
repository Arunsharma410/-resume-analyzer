// frontend/src/components/landing/HeroSection.jsx
// 🎯 Hero Section - Big headline + CTA

import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Play } from 'lucide-react';
import Button from '@components/ui/Button';
import Badge from '@components/ui/Badge';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* 🌌 Animated Background Mesh */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow" />

        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-30" />
      </div>

      <div className="container-custom relative z-10 text-center">
        {/* 🏷️ Top Badge */}
        <div className="inline-flex animate-fade-in-down">
          <Badge variant="primary" size="lg" icon={Sparkles}>
            Powered by Google Gemini AI
          </Badge>
        </div>

        {/* 🎯 Main Headline */}
        <h1 className="mt-8 text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight animate-fade-in-up text-balance">
          <span className="block text-slate-900 dark:text-white">
            Land Your Dream Job
          </span>
          <span className="block gradient-text mt-2">
            With AI Precision
          </span>
        </h1>

        {/* 📝 Subheadline */}
        <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-300 animate-fade-in-up text-balance" style={{ animationDelay: '0.1s' }}>
          Get instant AI-powered resume analysis, ATS compatibility scores, and personalized improvements to stand out from thousands of applicants.
        </p>

        {/* 🎯 CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Link to="/register">
            <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
              Analyze My Resume Free
            </Button>
          </Link>
          <Button variant="secondary" size="lg" icon={Play}>
            Watch Demo
          </Button>
        </div>

        {/* ✅ Trust signals */}
        <div className="mt-8 flex flex-wrap gap-6 justify-center items-center text-sm text-slate-500 dark:text-slate-400 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            No credit card required
          </span>
          <span className="hidden sm:block">•</span>
          <span>5 free analyses</span>
          <span className="hidden sm:block">•</span>
          <span>Setup in 30 seconds</span>
        </div>

        {/* 🖼️ Hero Visual (Floating Cards Preview) */}
        <div className="mt-20 relative max-w-5xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="glass-card p-2 sm:p-4 shadow-2xl">
            <div className="bg-gradient-to-br from-primary-500/5 via-secondary-500/5 to-accent-500/5 rounded-xl p-8 sm:p-12">
              <div className="grid grid-cols-3 gap-4">
                {/* Match Score Card */}
                <div className="glass-card p-4 sm:p-6 text-center">
                  <div className="text-3xl sm:text-5xl font-bold gradient-text mb-2">92</div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Match Score</div>
                </div>
                {/* ATS Score Card */}
                <div className="glass-card p-4 sm:p-6 text-center">
                  <div className="text-3xl sm:text-5xl font-bold text-green-500 mb-2">88</div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">ATS Score</div>
                </div>
                {/* Skills Card */}
                <div className="glass-card p-4 sm:p-6 text-center">
                  <div className="text-3xl sm:text-5xl font-bold text-primary-500 mb-2">12</div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Matched Skills</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;