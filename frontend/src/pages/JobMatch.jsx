// frontend/src/pages/JobMatch.jsx
// 💼 Job Match Recommendations Page

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Briefcase, MapPin, Building2, TrendingUp,
  Star, ExternalLink, ArrowLeft, Zap,
  Target, CheckCircle, XCircle, Clock,
  DollarSign, Users, BookOpen, Award,
  ChevronRight, Sparkles, BarChart2
} from 'lucide-react';
import { analysisAPI } from '@services/api';
import LoadingSkeleton from '@components/ui/LoadingSkeleton';
import Badge from '@components/ui/Badge';
import CircularProgress from '@components/ui/CircularProgress';
import EmptyState from '@components/ui/EmptyState';
import toast from 'react-hot-toast';

// ════════════════════════════════════════
// MOCK JOB DATA GENERATOR
// Based on AI recommended roles
// ════════════════════════════════════════
const generateJobCards = (recommendedRoles = [], matchScore = 0, skills = []) => {
  const companies = [
    { name: 'Google',    logo: 'G',  color: 'from-blue-500 to-green-500',   location: 'Mountain View, CA' },
    { name: 'Microsoft', logo: 'M',  color: 'from-blue-600 to-blue-400',    location: 'Redmond, WA' },
    { name: 'Amazon',    logo: 'A',  color: 'from-orange-500 to-yellow-400',location: 'Seattle, WA' },
    { name: 'Meta',      logo: 'f',  color: 'from-blue-500 to-indigo-600',  location: 'Menlo Park, CA' },
    { name: 'Apple',     logo: '',  color: 'from-gray-600 to-gray-400',    location: 'Cupertino, CA' },
    { name: 'Netflix',   logo: 'N',  color: 'from-red-600 to-red-400',      location: 'Los Gatos, CA' },
    { name: 'Stripe',    logo: 'S',  color: 'from-purple-600 to-indigo-500',location: 'San Francisco, CA' },
    { name: 'Vercel',    logo: '▲',  color: 'from-gray-800 to-gray-600',    location: 'Remote' },
    { name: 'Atlassian', logo: 'A',  color: 'from-blue-600 to-cyan-500',    location: 'Austin, TX' },
    { name: 'Shopify',   logo: 'S',  color: 'from-green-600 to-green-400',  location: 'Remote' },
  ];

  const salaryRanges = [
    '$80k - $110k', '$90k - $130k', '$100k - $140k',
    '$110k - $150k', '$120k - $160k', '$130k - $180k',
  ];

  const jobTypes = ['Full-time', 'Remote', 'Hybrid', 'Contract'];

  return recommendedRoles.slice(0, 6).map((role, index) => {
    const company    = companies[index % companies.length];
    const baseScore  = Math.max(55, matchScore - 15 + (Math.random() * 30 - 10));
    const jobMatch   = Math.min(98, Math.round(baseScore + (index % 3) * 5));

    return {
      id:          index + 1,
      title:       role,
      company:     company.name,
      logo:        company.logo,
      logoColor:   company.color,
      location:    company.location,
      salary:      salaryRanges[index % salaryRanges.length],
      type:        jobTypes[index % jobTypes.length],
      matchScore:  jobMatch,
      posted:      `${index + 1}d ago`,
      applicants:  Math.floor(Math.random() * 200) + 50,
      skills:      skills.slice(0, 3 + (index % 3)),
      featured:    index === 0,
      easyApply:   index % 2 === 0,
    };
  });
};

// ════════════════════════════════════════
// SCORE COLOR HELPER
// ════════════════════════════════════════
const getScoreColor = (score) => {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  return 'text-red-400';
};

const getScoreBg = (score) => {
  if (score >= 80) return 'from-green-500 to-emerald-500';
  if (score >= 60) return 'from-yellow-500 to-orange-500';
  return 'from-red-500 to-rose-500';
};

// ════════════════════════════════════════
// JOB CARD COMPONENT
// ════════════════════════════════════════
const JobCard = ({ job, index }) => {
  const [saved, setSaved] = useState(false);

  return (
    <div
      className={`
        relative glass-card p-6 hover:border-primary-500/40 
        transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-primary
        animate-fade-up
        ${job.featured ? 'border-primary-500/30' : ''}
      `}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Featured Badge */}
      {job.featured && (
        <div className="absolute -top-3 left-6">
          <span className="badge-primary text-xs px-3 py-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Best Match
          </span>
        </div>
      )}

      {/* Header Row */}
      <div className="flex items-start justify-between mb-4">
        {/* Company Logo + Info */}
        <div className="flex items-center gap-3">
          <div className={`
            w-12 h-12 rounded-xl bg-gradient-to-br ${job.logoColor}
            flex items-center justify-center text-white font-bold text-lg
            shadow-lg flex-shrink-0
          `}>
            {job.logo}
          </div>
          <div>
            <h3 className="font-semibold text-white text-base leading-tight">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 text-sm">{job.company}</span>
            </div>
          </div>
        </div>

        {/* Match Score Circle */}
        <div className="flex flex-col items-center">
          <div className={`
            w-14 h-14 rounded-full bg-gradient-to-br ${getScoreBg(job.matchScore)}
            flex items-center justify-center shadow-lg
          `}>
            <span className="text-white font-bold text-sm">{job.matchScore}%</span>
          </div>
          <span className="text-xs text-slate-400 mt-1">Match</span>
        </div>
      </div>

      {/* Job Details */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-1.5 text-slate-400 text-sm">
          <MapPin className="w-3.5 h-3.5" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 text-sm">
          <DollarSign className="w-3.5 h-3.5" />
          <span>{job.salary}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 text-sm">
          <Clock className="w-3.5 h-3.5" />
          <span>{job.posted}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 text-sm">
          <Users className="w-3.5 h-3.5" />
          <span>{job.applicants} applicants</span>
        </div>
      </div>

      {/* Skills Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`
          px-2.5 py-1 rounded-lg text-xs font-medium
          ${job.type === 'Remote' ? 'bg-green-500/20 text-green-400 border border-green-500/30'
          : job.type === 'Hybrid' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
          : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'}
        `}>
          {job.type}
        </span>
        {job.skills.slice(0, 4).map((skill, i) => (
          <span
            key={i}
            className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-300"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-white/5">
        {job.easyApply && (
          <button className="flex-1 btn-primary py-2 text-sm flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" />
            Easy Apply
          </button>
        )}
        <button className={`
          ${job.easyApply ? 'px-4' : 'flex-1'} 
          btn-secondary py-2 text-sm flex items-center justify-center gap-2
        `}>
          <ExternalLink className="w-4 h-4" />
          {job.easyApply ? 'View' : 'View Job'}
        </button>
        <button
          onClick={() => {
            setSaved(!saved);
            toast.success(saved ? 'Removed from saved' : 'Job saved!');
          }}
          className={`
            p-2 rounded-xl border transition-all duration-200
            ${saved
              ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }
          `}
        >
          <Star className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  );
};

// ════════════════════════════════════════
// CAREER PATH CARD
// ════════════════════════════════════════
const CareerPathCard = ({ path, index }) => (
  <div
    className="glass-card p-5 hover:border-primary-500/30 transition-all duration-300 animate-fade-up"
    style={{ animationDelay: `${index * 0.15}s` }}
  >
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${path.color} flex items-center justify-center`}>
        <path.icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <h4 className="font-semibold text-white text-sm">{path.title}</h4>
        <span className="text-xs text-slate-400">{path.timeline}</span>
      </div>
    </div>
    <p className="text-slate-400 text-sm mb-3">{path.description}</p>
    <div className="space-y-1.5">
      {path.steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-primary-400' : 'bg-slate-600'}`} />
          <span className="text-xs text-slate-300">{step}</span>
        </div>
      ))}
    </div>
  </div>
);

// ════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════
const JobMatch = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [analysis,  setAnalysis]  = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [jobs,      setJobs]      = useState([]);
  const [filter,    setFilter]    = useState('all');
  const [sortBy,    setSortBy]    = useState('match');

  // ── Fetch Analysis Data ──
  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await analysisAPI.getById(id);
        const data = res.data.data;
        setAnalysis(data);

        // Generate job cards from AI recommended roles
        const generatedJobs = generateJobCards(
          data.analysis?.recommendedRoles || [],
          data.analysis?.matchScore       || 0,
          data.analysis?.matchedSkills    || []
        );
        setJobs(generatedJobs);
      } catch (err) {
        toast.error('Failed to load analysis');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id, navigate]);

  // ── Career Path Data ──
  const careerPaths = [
    {
      title:       'Junior → Mid Level',
      timeline:    '1-2 years',
      color:       'from-blue-500 to-cyan-500',
      icon:        TrendingUp,
      description: 'Focus on deepening technical skills and taking ownership of features.',
      steps:       ['Complete advanced courses', 'Lead small features', 'Mentor interns', 'Improve system design skills'],
    },
    {
      title:       'Technical Specialist',
      timeline:    '2-3 years',
      color:       'from-purple-500 to-pink-500',
      icon:        Award,
      description: 'Become a domain expert and go-to person for specific technologies.',
      steps:       ['Get certifications', 'Write technical blogs', 'Speak at meetups', 'Contribute to open source'],
    },
    {
      title:       'Tech Lead Path',
      timeline:    '3-5 years',
      color:       'from-green-500 to-emerald-500',
      icon:        Users,
      description: 'Transition into leadership while maintaining technical excellence.',
      steps:       ['Lead a team project', 'Drive technical decisions', 'System architecture', 'Stakeholder communication'],
    },
  ];

  // ── Filter + Sort Jobs ──
  const filteredJobs = jobs
    .filter(job => {
      if (filter === 'all')    return true;
      if (filter === 'remote') return job.location === 'Remote';
      if (filter === 'high')   return job.matchScore >= 80;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'match')  return b.matchScore - a.matchScore;
      if (sortBy === 'recent') return a.posted.localeCompare(b.posted);
      return 0;
    });

  // ── Loading State ──
  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton className="h-32 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <LoadingSkeleton key={i} className="h-56 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const { matchScore = 0, recommendedRoles = [], matchedSkills = [] } = analysis.analysis || {};

  return (
    <div className="space-y-8 animate-fade-in">

      {/* ── Back Button ── */}
      <button
        onClick={() => navigate(`/analysis/${id}`)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Analysis
      </button>

      {/* ── Hero Header ── */}
      <div className="glass-card p-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 via-transparent to-secondary-600/10" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-glow-primary">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white">
                    Job Match Recommendations
                  </h1>
                  <p className="text-slate-400">
                    Based on your resume analysis • {recommendedRoles.length} roles identified
                  </p>
                </div>
              </div>
            </div>

            {/* Overall Match Score */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(matchScore)}`}>
                  {matchScore}%
                </div>
                <div className="text-slate-400 text-sm">Overall Match</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">
                  {jobs.length}
                </div>
                <div className="text-slate-400 text-sm">Jobs Found</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-400">
                  {jobs.filter(j => j.matchScore >= 80).length}
                </div>
                <div className="text-slate-400 text-sm">High Matches</div>
              </div>
            </div>
          </div>

          {/* Recommended Roles Pills */}
          {recommendedRoles.length > 0 && (
            <div className="mt-6">
              <p className="text-sm text-slate-400 mb-3">🎯 AI Recommended Roles for You:</p>
              <div className="flex flex-wrap gap-2">
                {recommendedRoles.map((role, i) => (
                  <span key={i} className="badge-primary">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Filters + Sort Bar ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Filter Tabs */}
        <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
          {[
            { key: 'all',    label: `All (${jobs.length})` },
            { key: 'high',   label: `Top Matches (${jobs.filter(j => j.matchScore >= 80).length})` },
            { key: 'remote', label: `Remote (${jobs.filter(j => j.location === 'Remote').length})` },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${filter === tab.key
                  ? 'bg-primary-600 text-white shadow-glow-primary'
                  : 'text-slate-400 hover:text-white'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white/5 border border-white/10 text-white text-sm rounded-xl px-3 py-2 outline-none focus:border-primary-500"
          >
            <option value="match"  className="bg-dark-400">Match Score</option>
            <option value="recent" className="bg-dark-400">Most Recent</option>
          </select>
        </div>
      </div>

      {/* ── Job Cards Grid ── */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.map((job, index) => (
            <JobCard key={job.id} job={job} index={index} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Briefcase}
          title="No jobs found"
          description="Try changing your filters to see more results"
        />
      )}

      {/* ── Skills to Highlight ── */}
      {matchedSkills.length > 0 && (
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Skills to Highlight</h2>
              <p className="text-slate-400 text-sm">These skills make you stand out</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map((skill, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Career Growth Paths ── */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Career Growth Paths</h2>
            <p className="text-slate-400 text-sm">Roadmaps to accelerate your career</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {careerPaths.map((path, i) => (
            <CareerPathCard key={i} path={path} index={i} />
          ))}
        </div>
      </div>

      {/* ── Market Insights ── */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-blue-500 flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Market Insights</h2>
            <p className="text-slate-400 text-sm">Current job market trends</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Avg Salary',     value: '$115k',  icon: DollarSign, color: 'text-green-400' },
            { label: 'Open Positions', value: '12.4k',  icon: Briefcase,  color: 'text-blue-400'  },
            { label: 'Hiring Rate',    value: '+24%',   icon: TrendingUp, color: 'text-purple-400'},
            { label: 'Remote Jobs',    value: '68%',    icon: Target,     color: 'text-cyan-400'  },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
              <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-slate-400 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA: Improve Resume ── */}
      <div className="glass-card p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-secondary-600/10" />
        <div className="relative z-10">
          <Sparkles className="w-10 h-10 text-primary-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Boost Your Match Score
          </h2>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            Add missing skills to your resume and re-analyze to unlock more job opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/upload" className="btn-primary flex items-center gap-2 justify-center">
              <Zap className="w-4 h-4" />
              Analyze New Resume
            </Link>
            <Link
              to={`/skills-gap/${id}`}
              className="btn-secondary flex items-center gap-2 justify-center"
            >
              <BookOpen className="w-4 h-4" />
              View Skills Gap
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default JobMatch;