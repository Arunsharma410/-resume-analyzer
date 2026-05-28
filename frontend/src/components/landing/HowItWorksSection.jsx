// frontend/src/components/landing/HowItWorksSection.jsx
// 🔄 3-Step Process

import { howItWorks } from '@/data/landingData';
import Badge from '@components/ui/Badge';
import { Workflow } from 'lucide-react';

const HowItWorksSection = () => {
  return (
    <section className="section-padding relative">
      {/* 🌌 Background decoration */}
      <div className="absolute inset-0 -z-10 dot-pattern opacity-30" />

      <div className="container-custom">
        {/* 📌 Section Header */}
        <div className="text-center mb-16">
          <Badge variant="info" icon={Workflow} className="mb-4">
            Simple Process
          </Badge>
          <h2 className="text-display-md text-slate-900 dark:text-white mb-4 text-balance">
            Get analyzed in{' '}
            <span className="gradient-text">3 simple steps</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            From upload to insights in under 30 seconds.
          </p>
        </div>

        {/* 🔢 Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* 🌈 Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 opacity-20" />

          {howItWorks.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* 🎯 Step Number */}
                <div className="relative inline-flex mb-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-glow-primary">
                    <Icon className="w-14 h-14 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-white dark:bg-dark-500 border-4 border-primary-500 flex items-center justify-center font-bold text-primary-600 dark:text-primary-400">
                    {step.step}
                  </div>
                </div>

                {/* 📌 Title */}
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  {step.title}
                </h3>

                {/* 📝 Description */}
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;