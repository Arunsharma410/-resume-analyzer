// frontend/src/pages/PricingPage.jsx
// 💎 Pricing Page - Plans and Features

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check, X, Zap, Crown, Building2,
  ArrowRight, Star, Shield, Sparkles,
  BarChart2, FileText, Target, Users,
  Headphones, RefreshCw, Download, Lock
} from 'lucide-react';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';
import { useAuth } from '@context/AuthContext';

// ════════════════════════════════════════
// PRICING DATA
// ════════════════════════════════════════
const plans = [
  {
    id:          'free',
    name:        'Free',
    description: 'Perfect for getting started',
    icon:        FileText,
    price:       { monthly: 0,  yearly: 0  },
    color:       'from-slate-500 to-slate-600',
    borderColor: 'border-white/10',
    popular:     false,
    features: [
      { text: '5 AI analyses per month',     included: true  },
      { text: 'ATS compatibility score',     included: true  },
      { text: 'Skills gap analysis',         included: true  },
      { text: 'Basic improvement tips',      included: true  },
      { text: 'Job match recommendations',   included: true  },
      { text: 'Analysis history (7 days)',   included: true  },
      { text: 'Unlimited analyses',          included: false },
      { text: 'Priority AI processing',      included: false },
      { text: 'Export PDF reports',          included: false },
      { text: 'Priority support',            included: false },
      { text: 'API access',                  included: false },
      { text: 'Team collaboration',          included: false },
    ],
    cta:      'Get Started Free',
    ctaStyle: 'btn-secondary',
  },
  {
    id:          'pro',
    name:        'Pro',
    description: 'For serious job seekers',
    icon:        Zap,
    price:       { monthly: 12, yearly: 8  },
    color:       'from-primary-500 to-secondary-500',
    borderColor: 'border-primary-500/50',
    popular:     true,
    features: [
      { text: 'Unlimited AI analyses',        included: true },
      { text: 'ATS compatibility score',      included: true },
      { text: 'Advanced skills gap analysis', included: true },
      { text: 'Detailed improvement tips',    included: true },
      { text: 'Job match recommendations',    included: true },
      { text: 'Unlimited history',            included: true },
      { text: 'Priority AI processing',       included: true },
      { text: 'Export PDF reports',           included: true },
      { text: 'Priority email support',       included: true },
      { text: 'API access',                   included: false },
      { text: 'Team collaboration',           included: false },
      { text: 'Custom integrations',          included: false },
    ],
    cta:      'Start Pro Trial',
    ctaStyle: 'btn-primary',
  },
  {
    id:          'enterprise',
    name:        'Enterprise',
    description: 'For teams and organizations',
    icon:        Building2,
    price:       { monthly: 49, yearly: 39 },
    color:       'from-yellow-500 to-orange-500',
    borderColor: 'border-yellow-500/30',
    popular:     false,
    features: [
      { text: 'Everything in Pro',            included: true },
      { text: 'Team collaboration tools',     included: true },
      { text: 'Bulk resume analysis',         included: true },
      { text: 'Custom AI fine-tuning',        included: true },
      { text: 'Advanced analytics dashboard', included: true },
      { text: 'API access + webhooks',        included: true },
      { text: 'SSO / SAML integration',       included: true },
      { text: 'Dedicated account manager',    included: true },
      { text: 'SLA guarantee (99.9%)',        included: true },
      { text: 'Custom integrations',          included: true },
      { text: '24/7 phone support',           included: true },
      { text: 'On-premise deployment',        included: true },
    ],
    cta:      'Contact Sales',
    ctaStyle: 'btn-secondary',
  },
];

// ════════════════════════════════════════
// FEATURE COMPARISON DATA
// ════════════════════════════════════════
const comparisonFeatures = [
  { category: '🤖 AI Analysis',   features: [
    { name: 'Resume Analysis',        free: '5/month', pro: 'Unlimited', enterprise: 'Unlimited' },
    { name: 'Match Score',            free: true,      pro: true,        enterprise: true        },
    { name: 'ATS Score',             free: true,      pro: true,        enterprise: true        },
    { name: 'Skills Gap',            free: 'Basic',   pro: 'Advanced',  enterprise: 'Advanced'  },
    { name: 'AI Suggestions',        free: 'Basic',   pro: 'Detailed',  enterprise: 'Custom'    },
    { name: 'Processing Speed',      free: 'Standard',pro: 'Priority',  enterprise: 'Dedicated' },
  ]},
  { category: '📊 Reports',        features: [
    { name: 'Analysis History',      free: '7 days',  pro: 'Unlimited', enterprise: 'Unlimited' },
    { name: 'Export PDF',            free: false,     pro: true,        enterprise: true        },
    { name: 'Bulk Export',           free: false,     pro: false,       enterprise: true        },
    { name: 'Analytics Dashboard',   free: 'Basic',   pro: 'Advanced',  enterprise: 'Custom'    },
  ]},
  { category: '🛡️ Support',        features: [
    { name: 'Email Support',         free: true,      pro: true,        enterprise: true        },
    { name: 'Priority Support',      free: false,     pro: true,        enterprise: true        },
    { name: '24/7 Phone Support',    free: false,     pro: false,       enterprise: true        },
    { name: 'Dedicated Manager',     free: false,     pro: false,       enterprise: true        },
  ]},
];

// ════════════════════════════════════════
// FAQ DATA
// ════════════════════════════════════════
const faqs = [
  {
    q: 'Can I cancel my subscription anytime?',
    a: 'Yes! You can cancel your Pro or Enterprise subscription at any time. You\'ll continue to have access until the end of your billing period.',
  },
  {
    q: 'How accurate is the AI analysis?',
    a: 'Our AI uses Google Gemini to provide highly accurate analysis. It evaluates keyword matching, ATS compatibility, and industry standards with 90%+ accuracy.',
  },
  {
    q: 'What file formats are supported?',
    a: 'Currently we support PDF format. We recommend keeping your resume as a PDF for best ATS compatibility and accurate parsing.',
  },
  {
    q: 'Is my resume data secure?',
    a: 'Absolutely. Your resume data is encrypted, processed securely, and never shared with third parties. We delete uploaded files after analysis.',
  },
  {
    q: 'Can I upgrade or downgrade my plan?',
    a: 'Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades take effect at the next billing cycle.',
  },
  {
    q: 'Do you offer student discounts?',
    a: 'Yes! Students get 50% off the Pro plan. Contact our support team with your student email to claim the discount.',
  },
];

// ════════════════════════════════════════
// PLAN CARD COMPONENT
// ════════════════════════════════════════
const PlanCard = ({ plan, billing, currentPlan, index }) => {
  const price = billing === 'monthly' ? plan.price.monthly : plan.price.yearly;
  const isCurrentPlan = currentPlan === plan.id;

  return (
    <div
      className={`
        relative glass-card p-8 flex flex-col
        ${plan.popular ? `border-primary-500/50 shadow-glow-primary` : ''}
        hover:-translate-y-1 transition-all duration-300
        animate-fade-up
      `}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm font-semibold rounded-full shadow-glow-primary">
            <Star className="w-3.5 h-3.5 fill-current" />
            Most Popular
          </span>
        </div>
      )}

      {/* Plan Header */}
      <div className="mb-6">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 shadow-lg`}>
          <plan.icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
        <p className="text-slate-400 text-sm">{plan.description}</p>
      </div>

      {/* Price */}
      <div className="mb-6 pb-6 border-b border-white/5">
        {price === 0 ? (
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-white">Free</span>
            <span className="text-slate-400">forever</span>
          </div>
        ) : (
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-slate-400 text-lg">$</span>
              <span className="text-4xl font-bold text-white">{price}</span>
              <span className="text-slate-400">/month</span>
            </div>
            {billing === 'yearly' && (
              <p className="text-green-400 text-sm mt-1">
                Save ${(plan.price.monthly - plan.price.yearly) * 12}/year
              </p>
            )}
          </div>
        )}
      </div>

      {/* Features List */}
      <div className="flex-1 space-y-3 mb-8">
        {plan.features.map((feature, i) => (
          <div key={i} className="flex items-center gap-3">
            {feature.included ? (
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
            ) : (
              <X className="w-4 h-4 text-slate-600 flex-shrink-0" />
            )}
            <span className={`text-sm ${feature.included ? 'text-slate-300' : 'text-slate-600'}`}>
              {feature.text}
            </span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      {isCurrentPlan ? (
        <div className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-center text-slate-400 text-sm font-medium">
          ✓ Current Plan
        </div>
      ) : plan.id === 'enterprise' ? (
        <a
          href="mailto:sales@resumeai.com"
          className="btn-secondary w-full text-center py-3 flex items-center justify-center gap-2"
        >
          Contact Sales
          <ArrowRight className="w-4 h-4" />
        </a>
      ) : (
        <Link
          to={plan.id === 'free' ? '/register' : '/register'}
          className={`${plan.ctaStyle} w-full text-center py-3 flex items-center justify-center gap-2`}
        >
          {plan.cta}
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
};

// ════════════════════════════════════════
// FAQ ITEM COMPONENT
// ════════════════════════════════════════
const FAQItem = ({ faq, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="glass-card overflow-hidden animate-fade-up"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className="font-medium text-white pr-4">{faq.q}</span>
        <span className={`text-primary-400 transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-45' : ''}`}>
          <Zap className="w-5 h-5" />
        </span>
      </button>
      {open && (
        <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-4">
          {faq.a}
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════
// COMPARISON ROW VALUE
// ════════════════════════════════════════
const CellValue = ({ value }) => {
  if (value === true)  return <Check className="w-5 h-5 text-green-400 mx-auto" />;
  if (value === false) return <X     className="w-5 h-5 text-slate-600 mx-auto" />;
  return <span className="text-slate-300 text-sm">{value}</span>;
};

// ════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════
const PricingPage = () => {
  const [billing, setBilling] = useState('monthly');
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-dark-600">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Hero Section ── */}
          <div className="text-center mb-16 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Simple, Transparent Pricing
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Choose Your{' '}
              <span className="gradient-text">Perfect Plan</span>
            </h1>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-8">
              Start free and upgrade when you need more. No hidden fees, cancel anytime.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 p-1.5 rounded-2xl">
              <button
                onClick={() => setBilling('monthly')}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  billing === 'monthly'
                    ? 'bg-primary-600 text-white shadow-glow-primary'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling('yearly')}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  billing === 'yearly'
                    ? 'bg-primary-600 text-white shadow-glow-primary'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Yearly
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                  Save 33%
                </span>
              </button>
            </div>
          </div>

          {/* ── Pricing Cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {plans.map((plan, i) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                billing={billing}
                currentPlan={user?.plan}
                index={i}
              />
            ))}
          </div>

          {/* ── Trust Badges ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
            {[
              { icon: Shield,      label: 'SSL Encrypted',        sub: 'Bank-level security'     },
              { icon: RefreshCw,   label: 'Cancel Anytime',       sub: 'No lock-in contracts'    },
              { icon: Headphones,  label: '24/7 Support',         sub: 'We\'re always here'      },
              { icon: Star,        label: '4.9/5 Rating',         sub: 'From 2,000+ users'       },
            ].map((badge, i) => (
              <div key={i} className="glass-card p-4 text-center">
                <badge.icon className="w-6 h-6 text-primary-400 mx-auto mb-2" />
                <div className="text-white font-semibold text-sm">{badge.label}</div>
                <div className="text-slate-400 text-xs">{badge.sub}</div>
              </div>
            ))}
          </div>

          {/* ── Feature Comparison Table ── */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-white text-center mb-10">
              Detailed Feature Comparison
            </h2>
            <div className="glass-card overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-4 gap-4 p-6 border-b border-white/10 bg-white/5">
                <div className="text-slate-400 text-sm font-medium">Feature</div>
                {plans.map(plan => (
                  <div key={plan.id} className="text-center">
                    <span className={`font-bold text-white`}>{plan.name}</span>
                  </div>
                ))}
              </div>

              {/* Table Body */}
              {comparisonFeatures.map((section, si) => (
                <div key={si}>
                  <div className="px-6 py-3 bg-white/3 border-y border-white/5">
                    <span className="text-sm font-semibold text-slate-300">{section.category}</span>
                  </div>
                  {section.features.map((feature, fi) => (
                    <div
                      key={fi}
                      className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-white/5 hover:bg-white/3 transition-colors"
                    >
                      <div className="text-slate-400 text-sm">{feature.name}</div>
                      <div className="text-center"><CellValue value={feature.free}       /></div>
                      <div className="text-center"><CellValue value={feature.pro}        /></div>
                      <div className="text-center"><CellValue value={feature.enterprise} /></div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* ── FAQ Section ── */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-white text-center mb-10">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, i) => (
                <FAQItem key={i} faq={faq} index={i} />
              ))}
            </div>
          </div>

          {/* ── Bottom CTA ── */}
          <div className="glass-card p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-secondary-600/10" />
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />
            <div className="relative z-10">
              <Crown className="w-12 h-12 text-primary-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Land Your Dream Job?
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                Join 10,000+ professionals who use ResumeAI to optimize their resumes and get hired faster.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="btn-primary flex items-center justify-center gap-2 px-8 py-4 text-lg">
                  <Zap className="w-5 h-5" />
                  Start For Free
                </Link>
                <Link to="/register" className="btn-secondary flex items-center justify-center gap-2 px-8 py-4 text-lg">
                  <Crown className="w-5 h-5" />
                  Try Pro - $12/mo
                </Link>
              </div>
              <p className="text-slate-500 text-sm mt-4">
                No credit card required for free plan • Cancel anytime
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;