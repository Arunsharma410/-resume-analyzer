// frontend/src/components/landing/FeaturesSection.jsx
// ✨ Feature Cards Grid

import { features } from '@/data/landingData';
import Card from '@components/ui/Card';
import Badge from '@components/ui/Badge';
import { Sparkles } from 'lucide-react';

const FeaturesSection = () => {
  return (
    <section className="section-padding relative">
      <div className="container-custom">
        {/* 📌 Section Header */}
        <div className="text-center mb-16">
          <Badge variant="primary" icon={Sparkles} className="mb-4">
            Powerful Features
          </Badge>
          <h2 className="text-display-md text-slate-900 dark:text-white mb-4 text-balance">
            Everything you need to{' '}
            <span className="gradient-text">land the job</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-balance">
            Powered by cutting-edge AI, our platform provides actionable insights that get real results.
          </p>
        </div>

        {/* 🎴 Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                variant="glass"
                hoverable
                className="group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* 🎨 Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* 📌 Title */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>

                {/* 📝 Description */}
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;