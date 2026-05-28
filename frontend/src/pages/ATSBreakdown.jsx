// frontend/src/pages/ATSBreakdown.jsx
// 🎯 ATS Compatibility Breakdown Page

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Target, CheckCircle, XCircle,
  AlertTriangle, FileText, Hash, Eye, Layout,
  TrendingUp, Zap, Award, Info, BarChart3,
  ScanLine, Briefcase, Shield, ChevronRight
} from 'lucide-react';
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  PolarAngleAxis, BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';
import { analysisAPI } from '@services/api';
import LoadingSkeleton from '@components/ui/LoadingSkeleton';
import toast from 'react-hot-toast';

// ════════════════════════════════════════
// SCORE HELPERS
// ════════════════════════════════════════
const getScoreColor = (score) => {
  if (score >= 80) return '#10b981'; // green
  if (score >= 60) return '#f59e0b'; // yellow
  return '#ef4444'; // red
};

const getScoreLabel = (score) => {
  if (score >= 90) return { text: 'Excellent', emoji: '🏆', color: 'text-green-400' };
  if (score >= 75) return { text: 'Good',      emoji: '✅', color: 'text-green-400' };
  if (score >= 60) return { text: 'Fair',      emoji: '⚠️', color: 'text-yellow-400' };
  if (score >= 40) return { text: 'Poor',      emoji: '❌', color: 'text-orange-400' };
  return                  { text: 'Critical',  emoji: '🚨', color: 'text-red-400' };
};

// ════════════════════════════════════════
// ATS HERO SCORE CARD
// ════════════════════════════════════════
const ATSHeroScore = ({ score }) => {
  const label = getScoreLabel(score);
  const data = [{ name: 'ATS', value: score, fill: getScoreColor(score) }];

  return (
    <div className="glass-card p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 via-transparent to-blue-600/10" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
        {/* Score Visual */}
        <div className="relative w-56 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%" cy="50%"
              innerRadius="70%" outerRadius="100%"
              data={data}
              startAngle={90} endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar
                background={{ fill: 'rgba(255,255,255,0.05)' }}
                dataKey="value"
                cornerRadius={20}
              />
            </RadialBarChart>
          </ResponsiveContainer>

          {/* Center Score */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-white">{score}</span>
            <span className="text-slate-400 text-sm mt-1">ATS Score</span>
          </div>
        </div>

        {/* Score Info */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-sm font-medium mb-4">
            <ScanLine className="w-4 h-4" />
            ATS Compatibility Analysis
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
            Your Resume is{' '}
            <span className={label.color}>{label.text}</span> {label.emoji}
          </h1>

          <p className="text-slate-400 text-lg mb-6">
            {score >= 80
              ? 'Excellent! Your resume should pass most ATS systems without issues.'
              : score >= 60
                ? 'Your resume needs some optimization to pass more ATS systems.'
                : 'Your resume needs significant improvements to pass ATS screening.'}
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <div className="text-2xl font-bold text-green-400">
                {score >= 70 ? '✓' : '✗'}
              </div>
              <div className="text-xs text-slate-400">ATS Ready</div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <div className="text-2xl font-bold text-blue-400">
                {Math.round((score / 100) * 10)}/10
              </div>
              <div className="text-xs text-slate-400">Quality</div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <div className="text-2xl font-bold text-purple-400">
                {score >= 75 ? 'High' : score >= 50 ? 'Med' : 'Low'}
              </div>
              <div className="text-xs text-slate-400">Pass Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════
// ATS CHECKLIST ITEM
// ════════════════════════════════════════
const ChecklistItem = ({ label, passed, description }) => (
  <div className={`
    flex items-start gap-3 p-4 rounded-xl border transition-all
    ${passed
      ? 'bg-green-500/5 border-green-500/20'
      : 'bg-red-500/5 border-red-500/20'
    }
  `}>
    <div className={`
      w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
      ${passed ? 'bg-green-500/20' : 'bg-red-500/20'}
    `}>
      {passed
        ? <CheckCircle className="w-4 h-4 text-green-400" />
        : <XCircle    className="w-4 h-4 text-red-400" />
      }
    </div>
    <div className="flex-1">
      <div className="font-medium text-white text-sm">{label}</div>
      <div className="text-xs text-slate-400 mt-0.5">{description}</div>
    </div>
    <span className={`
      text-xs px-2 py-1 rounded-lg font-medium flex-shrink-0
      ${passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
    `}>
      {passed ? 'PASS' : 'FAIL'}
    </span>
  </div>
);

// ════════════════════════════════════════
// SECTION SCORE BAR
// ════════════════════════════════════════
const SectionScoreBar = ({ label, score, icon: Icon }) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-slate-400" />
        <span className="text-sm text-slate-300 capitalize">{label}</span>
      </div>
      <span className="text-sm font-semibold text-white">{score}%</span>
    </div>
    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-1000"
        style={{
          width: `${score}%`,
          background: `linear-gradient(90deg, ${getScoreColor(score)}aa, ${getScoreColor(score)})`,
        }}
      />
    </div>
  </div>
);

// ════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════
const ATSBreakdown = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading,  setLoading]  = useState(true);

  // ── Fetch Analysis ──
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await analysisAPI.getById(id);
        setAnalysis(res.data.data);
      } catch {
        toast.error('Failed to load analysis');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton className="h-64 rounded-2xl" />
        <div className="grid grid-cols-2 gap-6">
          <LoadingSkeleton className="h-96 rounded-2xl" />
          <LoadingSkeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const a = analysis.analysis || {};
  const atsScore     = a.atsScore || 0;
  const atsFeedback  = a.atsFeedback  || {};
  const sectionScores = a.sectionScores || {};

  // Section scores data
  const sections = [
    { label: 'Contact Info',   key: 'contact',        icon: Eye         },
    { label: 'Summary',        key: 'summary',        icon: FileText    },
    { label: 'Experience',     key: 'experience',     icon: Briefcase   },
    { label: 'Education',      key: 'education',      icon: Award       },
    { label: 'Skills',         key: 'skills',         icon: Zap         },
    { label: 'Projects',       key: 'projects',       icon: Layout      },
    { label: 'Certifications', key: 'certifications', icon: Award       },
    { label: 'Formatting',     key: 'formatting',     icon: Layout      },
  ];

  // ATS checklist
  const checklist = [
    { label: 'Contact Information',   passed: atsFeedback.hasContactInfo,    description: 'Email, phone, location detected' },
    { label: 'Work Experience',       passed: atsFeedback.hasWorkExperience, description: 'Previous jobs and roles listed'  },
    { label: 'Education Section',     passed: atsFeedback.hasEducation,      description: 'Academic background present'     },
    { label: 'Skills Section',        passed: atsFeedback.hasSkills,         description: 'Technical & soft skills listed'  },
    { label: 'Professional Summary',  passed: atsFeedback.hasSummary,        description: 'Brief intro at the top'          },
    { label: 'Proper Formatting',     passed: atsFeedback.properFormatting,  description: 'Clean structure for ATS parsing' },
  ];

  // Chart data
  const chartData = sections.map(s => ({
    name:  s.label.slice(0, 8),
    score: sectionScores[s.key] || 0,
  }));

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Back Button */}
      <button
        onClick={() => navigate(`/analysis/${id}`)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Analysis
      </button>

      {/* Hero Score */}
      <ATSHeroScore score={atsScore} />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ATS Checklist */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">ATS Compliance Check</h2>
              <p className="text-slate-400 text-sm">
                {checklist.filter(c => c.passed).length}/{checklist.length} checks passed
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {checklist.map((item, i) => (
              <ChecklistItem key={i} {...item} />
            ))}
          </div>
        </div>

        {/* Section Scores */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Section Scores</h2>
              <p className="text-slate-400 text-sm">How each section performs</p>
            </div>
          </div>
          <div className="space-y-4">
            {sections.map((s, i) => (
              <SectionScoreBar
                key={i}
                label={s.label}
                score={sectionScores[s.key] || 0}
                icon={s.icon}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Keyword Density */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-primary-400" />
              <span className="text-sm text-slate-400">Keyword Density</span>
            </div>
            <span className="text-2xl font-bold" style={{ color: getScoreColor(atsFeedback.keywordDensity || 0) }}>
              {atsFeedback.keywordDensity || 0}%
            </span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${atsFeedback.keywordDensity || 0}%`,
                background: getScoreColor(atsFeedback.keywordDensity || 0),
              }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-3">
            {(atsFeedback.keywordDensity || 0) >= 70
              ? 'Great keyword usage!'
              : 'Add more relevant keywords from job description'}
          </p>
        </div>

        {/* Readability */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-accent-400" />
              <span className="text-sm text-slate-400">Readability</span>
            </div>
            <span className="text-2xl font-bold" style={{ color: getScoreColor(atsFeedback.readabilityScore || 0) }}>
              {atsFeedback.readabilityScore || 0}%
            </span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${atsFeedback.readabilityScore || 0}%`,
                background: getScoreColor(atsFeedback.readabilityScore || 0),
              }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-3">
            {(atsFeedback.readabilityScore || 0) >= 70
              ? 'Easy to read and parse'
              : 'Simplify wording and structure'}
          </p>
        </div>

        {/* Overall Match */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              <span className="text-sm text-slate-400">Match Score</span>
            </div>
            <span className="text-2xl font-bold" style={{ color: getScoreColor(a.matchScore || 0) }}>
              {a.matchScore || 0}%
            </span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${a.matchScore || 0}%`,
                background: getScoreColor(a.matchScore || 0),
              }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Overall job description match
          </p>
        </div>
      </div>

      {/* Improvement Tips */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">How to Improve ATS Score</h2>
            <p className="text-slate-400 text-sm">Quick wins to boost your score</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { tip: 'Use standard section headings',    detail: 'Like "Experience", "Education", "Skills"' },
            { tip: 'Avoid tables, columns, and images', detail: 'ATS systems struggle to parse them'        },
            { tip: 'Use simple fonts',                  detail: 'Arial, Calibri, or Times New Roman'        },
            { tip: 'Include keywords from job posting', detail: 'Match exact phrases when possible'         },
            { tip: 'Save as PDF',                       detail: 'Best format for most ATS systems'          },
            { tip: 'Use bullet points',                 detail: 'Easier to scan than paragraphs'            },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
              <div className="w-7 h-7 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-primary-400 text-xs font-bold">{i + 1}</span>
              </div>
              <div>
                <div className="text-sm font-medium text-white">{item.tip}</div>
                <div className="text-xs text-slate-400 mt-0.5">{item.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="glass-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-semibold text-white">Want to see skills gap analysis?</div>
            <div className="text-slate-400 text-sm">Discover what skills you need to add</div>
          </div>
        </div>
        <Link to={`/skills-gap/${id}`} className="btn-primary flex items-center gap-2">
          Skills Gap Analysis
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};

export default ATSBreakdown;