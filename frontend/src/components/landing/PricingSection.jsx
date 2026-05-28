// frontend/src/components/landing/PricingSection.jsx
// 💰 Pricing Preview

import { Link } from 'react-router-dom';
import { pricingPlans } from '@/data/landingData';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import Badge from '@components/ui/Badge';
import { Check, Crown, Sparkles } from 'lucide-react';
import clsx from 'clsx';

const PricingSection = () => {
  return (
    <section className="section-padding relative">
      {/* 🌌 Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom">
        {/* 📌 Section Header */}
        <div className="text-center mb-16">
          <Badge variant="warning" icon={Crown} className="mb-4">
            Simple Pricing
          </Badge>
          <h2 className="text-display-md text-slate-900 dark:text-white mb-4 text-balance">
            Choose the perfect{' '}
            <span className="gradient-text">plan for you</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Start free, upgrade when you need more. Cancel anytime.
          </p>
        </div>

        {/* 💰 Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              variant={plan.popular ? 'gradient' : 'glass'}
              className={clsx(
                'relative animate-fade-in-up',
                plan.popular && 'border-2 border-primary-500 shadow-glow-primary md:scale-105'
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* 🌟 Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge variant="primary" icon={Sparkles} size="lg">
                    Most Popular
                  </Badge>
                </div>
              )}

              {/* 📌 Plan Name */}
              <div className="text-center mb-6 mt-2">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {plan.description}
                </p>
              </div>

              {/* 💵 Price */}
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  {plan.price !== 'Custom' && (
                    <span className="text-2xl text-slate-600 dark:text-slate-400">$</span>
                  )}
                  <span className="text-5xl font-extrabold text-slate-900 dark:text-white">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-slate-500 dark:text-slate-400">
                      /{plan.period}
                    </span>
                  )}
                </div>
              </div>

              {/* ✅ Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-green-500" strokeWidth={3} />
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* 🎯 CTA Button */}
              <Link to="/register">
                <Button variant={plan.variant} fullWidth size="lg">
                  {plan.cta}
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        {/* 📞 Footer note */}
        <p className="text-center mt-12 text-sm text-slate-500 dark:text-slate-400">
          All plans include a 14-day money-back guarantee. No questions asked.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;