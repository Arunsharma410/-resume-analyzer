// frontend/src/components/analysis/AnalysisHeader.jsx
// 📋 Header for Analysis Results Page with Navigation Buttons

import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, FileText, Calendar, Briefcase,
  Building2, Download, Share2, Trash2,
  Target, Sparkles, TrendingUp
} from 'lucide-react';

const AnalysisHeader = ({ analysis, onDelete }) => {
  const navigate = useNavigate();
  const id = analysis?._id;

  return (
    <div className="space-y-6">
      {/* ── Back Button ── */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      {/* ── Header Card ── */}
      <div className="glass-card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 to-secondary-600/5" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          {/* Left Side - File Info */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0 shadow-glow-primary">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-white mb-2">
                {analysis?.resume?.fileName || 'Resume Analysis'}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                {analysis?.jobTitle && (
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>{analysis.jobTitle}</span>
                  </div>
                )}
                {analysis?.company && (
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{analysis.company}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(analysis?.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => window.print()}
              className="btn-secondary py-2 px-3 text-sm flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={onDelete}
              className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 🎯 NAVIGATION BUTTONS - Quick Access to Other Pages ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* ATS Breakdown Button */}
        <Link
          to={`/ats/${id}`}
          className="glass-card p-4 hover:border-blue-500/40 hover:shadow-glow-primary transition-all duration-300 hover:-translate-y-1 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white text-sm">ATS Breakdown</h3>
              <p className="text-xs text-slate-400">Detailed ATS analysis</p>
            </div>
            <ArrowLeft className="w-4 h-4 text-slate-400 rotate-180 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        {/* Skills Gap Button */}
        <Link
          to={`/skills-gap/${id}`}
          className="glass-card p-4 hover:border-purple-500/40 hover:shadow-glow-primary transition-all duration-300 hover:-translate-y-1 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white text-sm">Skills Gap</h3>
              <p className="text-xs text-slate-400">Missing skills analysis</p>
            </div>
            <ArrowLeft className="w-4 h-4 text-slate-400 rotate-180 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        {/* Job Match Button ✨ NEW */}
        <Link
          to={`/job-match/${id}`}
          className="glass-card p-4 hover:border-green-500/40 hover:shadow-glow-primary transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
        >
          {/* Glow effect for new feature */}
          <div className="absolute top-2 right-2">
            <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full">
              New
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white text-sm">Job Match</h3>
              <p className="text-xs text-slate-400">View matching jobs</p>
            </div>
            <ArrowLeft className="w-4 h-4 text-slate-400 rotate-180 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

      </div>
    </div>
  );
};

export default AnalysisHeader;