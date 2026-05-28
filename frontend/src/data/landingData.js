// frontend/src/data/landingData.js
// 📊 All landing page content

import {
  Zap, Target, BarChart3, Shield, FileText, Briefcase,
  Upload, Brain, CheckCircle2, Users, TrendingUp, Star,
  Trophy, Sparkles
} from 'lucide-react';

// ════════════════════════════════════════════════════════════
// ✨ FEATURES
// ════════════════════════════════════════════════════════════
export const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Advanced Gemini AI analyzes your resume against job descriptions with surgical precision.',
    color: 'from-primary-500 to-secondary-500',
  },
  {
    icon: Target,
    title: 'ATS Compatibility',
    description: 'Get a detailed ATS score and ensure your resume passes Applicant Tracking Systems.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: BarChart3,
    title: 'Match Score',
    description: 'Instant 0-100 match score showing how well your resume fits the job requirements.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Zap,
    title: 'Skills Gap Analysis',
    description: 'Identify missing skills and get actionable suggestions to bridge the gap.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Briefcase,
    title: 'Job Recommendations',
    description: 'AI suggests the best job roles for your unique skill set and experience.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data stays yours. Bank-grade encryption with no data sharing, ever.',
    color: 'from-red-500 to-rose-500',
  },
];

// ════════════════════════════════════════════════════════════
// 🔄 HOW IT WORKS
// ════════════════════════════════════════════════════════════
export const howItWorks = [
  {
    step: '01',
    icon: Upload,
    title: 'Upload Your Resume',
    description: 'Drag and drop your PDF resume. We support all standard formats with instant parsing.',
  },
  {
    step: '02',
    icon: FileText,
    title: 'Paste Job Description',
    description: 'Add the job you\'re targeting. Our AI compares every detail with precision.',
  },
  {
    step: '03',
    icon: CheckCircle2,
    title: 'Get Instant Analysis',
    description: 'Receive a detailed report with match score, ATS rating, and actionable improvements.',
  },
];

// ════════════════════════════════════════════════════════════
// 📊 STATS
// ════════════════════════════════════════════════════════════
export const stats = [
  { icon: Users,      value: '50,000+', label: 'Active Users'        },
  { icon: FileText,   value: '250,000+', label: 'Resumes Analyzed'   },
  { icon: TrendingUp, value: '94%',     label: 'Success Rate'        },
  { icon: Trophy,     value: '4.9/5',   label: 'User Rating'         },
];

// ════════════════════════════════════════════════════════════
// 💬 TESTIMONIALS
// ════════════════════════════════════════════════════════════
export const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer at Google',
    avatar: 'SC',
    rating: 5,
    text: 'ResumeAI helped me land my dream job at Google. The ATS score feature alone was a game-changer — I went from 0 interviews to 8 in a week!',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Product Manager at Stripe',
    avatar: 'MR',
    rating: 5,
    text: 'The skills gap analysis was incredibly insightful. It pointed out exactly what I needed to add. I got 3x more callbacks after optimizing my resume.',
  },
  {
    name: 'Priya Sharma',
    role: 'Data Scientist at Meta',
    avatar: 'PS',
    rating: 5,
    text: 'I\'ve tried many resume tools, but nothing comes close to ResumeAI. The AI suggestions are spot-on and the interface is beautiful.',
  },
  {
    name: 'James Wilson',
    role: 'UX Designer at Airbnb',
    avatar: 'JW',
    rating: 5,
    text: 'As a designer, I appreciate good UX. This product delivers on both design AND substance. The match score helped me tailor each application perfectly.',
  },
];

// ════════════════════════════════════════════════════════════
// 💰 PRICING
// ════════════════════════════════════════════════════════════
export const pricingPlans = [
  {
    name: 'Free',
    price: '0',
    period: 'forever',
    description: 'Perfect for trying out',
    features: [
      '5 analyses per month',
      'ATS compatibility score',
      'Basic match analysis',
      'Skills gap detection',
      'Email support',
    ],
    cta: 'Get Started',
    popular: false,
    variant: 'secondary',
  },
  {
    name: 'Pro',
    price: '19',
    period: 'month',
    description: 'For active job seekers',
    features: [
      'Unlimited analyses',
      'Advanced ATS scoring',
      'Detailed match reports',
      'Job recommendations',
      'Resume version history',
      'Priority support',
      'Export PDF reports',
    ],
    cta: 'Start Free Trial',
    popular: true,
    variant: 'primary',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For teams & recruiters',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'API access',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
      'White-label option',
    ],
    cta: 'Contact Sales',
    popular: false,
    variant: 'secondary',
  },
];

// ════════════════════════════════════════════════════════════
// 🏢 TRUSTED BY (company names — could be SVG logos later)
// ════════════════════════════════════════════════════════════
export const trustedBy = [
  'Google', 'Microsoft', 'Meta', 'Apple', 'Amazon', 'Netflix',
];