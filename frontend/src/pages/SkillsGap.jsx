// frontend/src/pages/SkillsGap.jsx
// 🧩 Skills Gap Analysis Page

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle, XCircle, AlertTriangle,
  TrendingUp, BookOpen, Sparkles, Zap, Target,
  Award, ChevronRight, ExternalLink, Clock,
  GraduationCap, Lightbulb, Briefcase, Star
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip
} from 'recharts';
import { analysisAPI } from '@services/api';
import LoadingSkeleton from '@components/ui/LoadingSkeleton';
import toast from 'react-hot-toast';

// ════════════════════════════════════════
// LEARNING RESOURCES BY SKILL
// ════════════════════════════════════════
const getLearningResource = (skill) => {
  const skillLower = skill.toLowerCase();

  // Common skill resources
  const resources = {
    react:      { course: 'React - The Complete Guide',     platform: 'Udemy',     time: '4 weeks', difficulty: 'Intermediate' },
    nodejs:     { course: 'Node.js Complete Bootcamp',      platform: 'Udemy',     time: '5 weeks', difficulty: 'Intermediate' },
    python:     { course: 'Python for Everybody',           platform: 'Coursera',  time: '6 weeks', difficulty: 'Beginner'     },
    typescript: { course: 'TypeScript Deep Dive',           platform: 'YouTube',   time: '2 weeks', difficulty: 'Intermediate' },
    aws:        { course: 'AWS Certified Solutions Architect', platform: 'A Cloud Guru', time: '8 weeks', difficulty: 'Advanced' },
    docker:     { course: 'Docker Mastery',                 platform: 'Udemy',     time: '3 weeks', difficulty: 'Intermediate' },
    kubernetes: { course: 'Kubernetes for Developers',      platform: 'Linux Foundation', time: '6 weeks', difficulty: 'Advanced' },
    mongodb:    { course: 'MongoDB University',             platform: 'MongoDB',   time: '4 weeks', difficulty: 'Beginner'     },
    sql:        { course: 'SQL Bootcamp',                   platform: 'Udemy',     time: '3 weeks', difficulty: 'Beginner'     },
    graphql:    { course: 'GraphQL with React',             platform: 'Udemy',     time: '3 weeks', difficulty: 'Intermediate' },
  };

  // Find matching resource
  for (const [key, val] of Object.entries(resources)) {
    if (skillLower.includes(key)) return val;
  }

  // Default resource
  return {
    course:     `Learn ${skill}`,
    platform:   'Online',
    time:       '4 weeks',
    difficulty: 'Intermediate',
  };
};

// ════════════════════════════════════════
// SKILL PRIORITY HELPER
// ════════════════════════════════════════
const getSkillPriority = (index, total) => {
  const ratio = index / total;
  if (ratio < 0.33) return { label: 'High',   color: 'red',    bg: 'bg-red-500/20',    text: 'text-red-400',    border: 'border-red-500/30'    };
  if (ratio < 0.66) return { label: 'Medium', color: 'yellow', bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' };
  return                   { label: 'Low',    color: 'blue',   bg: 'bg-blue-500/20',   text: 'text-blue-400',   border: 'border-blue-500/30'   };
};

// ════════════════════════════════════════
// HERO STATS
// ════════════════════════════════════════
const SkillsHero = ({ matchedCount, missingCount }) => {
  const total      = matchedCount + missingCount;
  const matchPct   = total > 0 ? Math.round((matchedCount / total) * 100) : 0;
  const missingPct = 100 - matchPct;

  const pieData = [
    { name: 'Matched', value: matchedCount, color: '#10b981' },
    { name: 'Missing', value: missingCount, color: '#ef4444' },
  ];

  return (
    <div className="glass-card p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-pink-600/10" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
        {/* Pie Chart */}
        <div className="relative w-56 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-white">{matchPct}%</span>
            <span className="text-slate-400 text-xs mt-1">Skills Match</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Skills Gap Analysis
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
            You have{' '}
            <span className="gradient-text">{matchedCount} of {total}</span>{' '}
            required skills
          </h1>

          <p className="text-slate-400 text-lg mb-6">
            {matchPct >= 80
              ? "You're well-prepared! Just polish a few skills."
              : matchPct >= 50
                ? "Good foundation! Focus on the missing skills."
                : "Big opportunity to grow! Let's bridge the gap."}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
              <div className="text-2xl font-bold text-green-400">{matchedCount}</div>
              <div className="text-xs text-slate-400">Matched</div>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              <div className="text-2xl font-bold text-red-400">{missingCount}</div>
              <div className="text-xs text-slate-400">Missing</div>
            </div>
            <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-3">
              <div className="text-2xl font-bold text-primary-400">{total}</div>
              <div className="text-xs text-slate-400">Total Req</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════
// SKILL CARD (Missing Skills)
// ════════════════════════════════════════
const MissingSkillCard = ({ skill, index, total }) => {
  const priority = getSkillPriority(index, total);
  const resource = getLearningResource(skill);

  return (
    <div
      className="glass-card p-5 hover:border-primary-500/40 transition-all duration-300 hover:-translate-y-1 animate-fade-up"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${priority.bg} border ${priority.border} flex items-center justify-center`}>
            <XCircle className={`w-5 h-5 ${priority.text}`} />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">{skill}</h3>
            <span className={`text-xs ${priority.text}`}>
              {priority.label} Priority
            </span>
          </div>
        </div>
      </div>

      {/* Learning Resource */}
      <div className="bg-white/5 rounded-xl p-3 border border-white/5 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-3.5 h-3.5 text-primary-400" />
          <span className="text-xs text-slate-400">Recommended Course</span>
        </div>
        <div className="text-sm font-medium text-white mb-1">{resource.course}</div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>📚 {resource.platform}</span>
          <span>⏱️ {resource.time}</span>
          <span>📊 {resource.difficulty}</span>
        </div>
      </div>

      {/* Action */}
      <button className="w-full flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-primary-500/20 hover:text-primary-400 text-slate-300 border border-white/10 hover:border-primary-500/30 rounded-xl text-sm font-medium transition-all">
        <ExternalLink className="w-3.5 h-3.5" />
        Find Courses
      </button>
    </div>
  );
};

// ════════════════════════════════════════
// MATCHED SKILL CHIP
// ════════════════════════════════════════
const MatchedSkillChip = ({ skill, index }) => (
  <div
    className="flex items-center gap-2 px-4 py-2.5 bg-green-500/10 border border-green-500/20 rounded-xl hover:bg-green-500/20 transition-all animate-fade-up"
    style={{ animationDelay: `${index * 0.05}s` }}
  >
    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
    <span className="text-sm font-medium text-green-300">{skill}</span>
  </div>
);

// ════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════
const SkillsGap = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [activeTab, setActiveTab] = useState('missing');

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
        <LoadingSkeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  if (!analysis) return null;

  const a = analysis.analysis || {};
  const matchedSkills = a.matchedSkills || [];
  const missingSkills = a.missingSkills || [];

  // Bar chart data (skill categories)
  const chartData = [
    { name: 'Matched', count: matchedSkills.length, fill: '#10b981' },
    { name: 'Missing', count: missingSkills.length, fill: '#ef4444' },
  ];

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

      {/* Hero */}
      <SkillsHero
        matchedCount={matchedSkills.length}
        missingCount={missingSkills.length}
      />

      {/* Tabs */}
      <div className="flex gap-2 bg-white/5 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('missing')}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'missing'
              ? 'bg-red-500/20 text-red-400 shadow-glow-primary'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🚨 Missing ({missingSkills.length})
        </button>
        <button
          onClick={() => setActiveTab('matched')}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'matched'
              ? 'bg-green-500/20 text-green-400 shadow-glow-primary'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          ✅ Matched ({matchedSkills.length})
        </button>
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'roadmap'
              ? 'bg-purple-500/20 text-purple-400 shadow-glow-primary'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🗺️ Roadmap
        </button>
      </div>

      {/* Tab Content */}

      {/* MISSING SKILLS TAB */}
      {activeTab === 'missing' && (
        <div className="space-y-6">
          <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-white text-sm mb-1">Pro Tip</div>
              <div className="text-sm text-slate-400">
                Focus on <span className="text-red-400 font-medium">High Priority</span> skills first.
                Adding 2-3 of these can significantly boost your match score.
              </div>
            </div>
          </div>

          {missingSkills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {missingSkills.map((skill, i) => (
                <MissingSkillCard
                  key={i}
                  skill={skill}
                  index={i}
                  total={missingSkills.length}
                />
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Missing Skills! 🎉</h3>
              <p className="text-slate-400">Your resume covers all required skills perfectly.</p>
            </div>
          )}
        </div>
      )}

      {/* MATCHED SKILLS TAB */}
      {activeTab === 'matched' && (
        <div className="space-y-6">
          <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            <Award className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-white text-sm mb-1">Your Strengths</div>
              <div className="text-sm text-slate-400">
                These are the skills you already have that match the job. Make sure to highlight them!
              </div>
            </div>
          </div>

          {matchedSkills.length > 0 ? (
            <div className="glass-card p-6">
              <div className="flex flex-wrap gap-3">
                {matchedSkills.map((skill, i) => (
                  <MatchedSkillChip key={i} skill={skill} index={i} />
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 text-center">
              <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Matched Skills Yet</h3>
              <p className="text-slate-400">Time to add some required skills to your resume.</p>
            </div>
          )}
        </div>
      )}

      {/* ROADMAP TAB */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          <div className="flex items-start gap-3 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
            <GraduationCap className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-white text-sm mb-1">Learning Roadmap</div>
              <div className="text-sm text-slate-400">
                Follow this step-by-step plan to acquire all missing skills.
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="space-y-4">
              {missingSkills.slice(0, 6).map((skill, i) => {
                const priority = getSkillPriority(i, missingSkills.length);
                const resource = getLearningResource(skill);

                return (
                  <div key={i} className="flex items-start gap-4 relative">
                    {/* Timeline line */}
                    {i < missingSkills.slice(0, 6).length - 1 && (
                      <div className="absolute left-5 top-12 w-0.5 h-full bg-gradient-to-b from-primary-500/50 to-transparent" />
                    )}

                    {/* Number */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-glow-primary z-10">
                      {i + 1}
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-white/5 rounded-xl p-4 border border-white/5">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-white">{skill}</h4>
                          <p className="text-xs text-slate-400">{resource.course}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-lg font-medium ${priority.bg} ${priority.text}`}>
                          {priority.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-400 mt-3 pt-3 border-t border-white/5">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          <span>{resource.platform}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{resource.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          <span>{resource.difficulty}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Estimated Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-5 text-center">
              <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                ~{Math.max(2, missingSkills.length * 3)} weeks
              </div>
              <div className="text-xs text-slate-400 mt-1">Total Learning Time</div>
            </div>
            <div className="glass-card p-5 text-center">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                +{Math.min(40, missingSkills.length * 8)}%
              </div>
              <div className="text-xs text-slate-400 mt-1">Expected Score Boost</div>
            </div>
            <div className="glass-card p-5 text-center">
              <Briefcase className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {Math.min(95, 60 + missingSkills.length * 5)}%
              </div>
              <div className="text-xs text-slate-400 mt-1">Job Match Potential</div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="glass-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-semibold text-white">See jobs that match your skills</div>
            <div className="text-slate-400 text-sm">Find roles where your skills shine</div>
          </div>
        </div>
        <Link to={`/job-match/${id}`} className="btn-primary flex items-center gap-2">
          View Job Matches
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};

export default SkillsGap;