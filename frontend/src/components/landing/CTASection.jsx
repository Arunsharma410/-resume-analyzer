// frontend/src/components/landing/CTASection.jsx
// 📞 Final Call-to-Action

import { Link } from 'react-router-dom';
import Button from '@components/ui/Button';
import { ArrowRight, Sparkles } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="relative glass-card p-8 sm:p-12 lg:p-16 text-center overflow-hidden">
          {/* 🌈 Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-secondary-500/10 to-accent-500/10" />
          <div className="absolute top-0 left-0 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

          <div className="relative z-10">
            {/* ✨ Icon */}
            <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 items-center justify-center mb-6 shadow-glow-primary">
              <Sparkles className="w-8 h-8 text-white" />
            </div>

            {/* 🎯 Headline */}
            <h2 className="text-display-md text-slate-900 dark:text-white mb-4 text-balance">
              Ready to land your{' '}
              <span className="gradient-text">dream job?</span>
            </h2>

            {/* 📝 Subheadline */}
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto text-balance">
              Join 50,000+ professionals who've transformed their careers with AI-powered resume analysis. Start your free analysis now.
            </p>

            {/* 🎯 CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                  Start Free Analysis
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="secondary" size="lg">
                  View Pricing
                </Button>
              </Link>
            </div>

            {/* ✅ Trust signal */}
            <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
              ✨ No credit card required • 5 free analyses • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;