// frontend/src/pages/HistoryPage.jsx
// 📜 Analysis History Page - Browse all past analyses

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText, Search, Filter, Calendar, Trash2,
  Eye, Download, ChevronRight, SortDesc, SortAsc,
  Briefcase, Building2, TrendingUp, Target,
  AlertCircle, Sparkles, Plus, Clock, BarChart3,
  Grid3x3, List, X
} from 'lucide-react';
import { analysisAPI } from '@services/api';
import LoadingSkeleton from '@components/ui/LoadingSkeleton';
import EmptyState from '@components/ui/EmptyState';
import toast from 'react-hot-toast';

// ════════════════════════════════════════
// SCORE BADGE
// ════════════════════════════════════════
const getScoreColor = (score) => {
  if (score >= 80) return { bg: 'bg-green-500/20',  text: 'text-green-400',  border: 'border-green-500/30',  label: 'Excellent' };
  if (score >= 60) return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', label: 'Good'      };
  if (score >= 40) return { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', label: 'Fair'      };
  return                  { bg: 'bg-red-500/20',    text: 'text-red-400',    border: 'border-red-500/30',    label: 'Poor'      };
};

// ════════════════════════════════════════
// FORMAT DATE
// ════════════════════════════════════════
const formatDate = (date) => {
  const d   = new Date(date);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);

  if (diff < 60)        return 'Just now';
  if (diff < 3600)      return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)     return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800)    return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// ════════════════════════════════════════
// GRID CARD VIEW
// ════════════════════════════════════════
const AnalysisCard = ({ item, onDelete, index }) => {
  const matchScore = item.analysis?.matchScore || 0;
  const atsScore   = item.analysis?.atsScore   || 0;
  const scoreColor = getScoreColor(matchScore);

  return (
    <div
      className="glass-card p-5 hover:border-primary-500/40 hover:shadow-glow-primary transition-all duration-300 hover:-translate-y-1 group animate-fade-up"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0 shadow-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-white text-sm truncate">
              {item.resume?.fileName || 'Untitled Resume'}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
              <Clock className="w-3 h-3" />
              <span>{formatDate(item.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Job Info */}
      {(item.jobTitle || item.company) && (
        <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-slate-400">
          {item.jobTitle && (
            <div className="flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              <span className="truncate">{item.jobTitle}</span>
            </div>
          )}
          {item.company && (
            <div className="flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              <span className="truncate">{item.company}</span>
            </div>
          )}
        </div>
      )}

      {/* Scores */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={`${scoreColor.bg} border ${scoreColor.border} rounded-xl p-3`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-400">Match</span>
            <Target className={`w-3 h-3 ${scoreColor.text}`} />
          </div>
          <div className={`text-2xl font-bold ${scoreColor.text}`}>
            {matchScore}%
          </div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-400">ATS</span>
            <BarChart3 className="w-3 h-3 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400">
            {atsScore}%
          </div>
        </div>
      </div>

      {/* Skills Preview */}
      {item.analysis?.matchedSkills?.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1.5">
            {item.analysis.matchedSkills.slice(0, 3).map((skill, i) => (
              <span key={i} className="text-xs px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg">
                {skill}
              </span>
            ))}
            {item.analysis.matchedSkills.length > 3 && (
              <span className="text-xs px-2 py-0.5 bg-white/5 text-slate-400 rounded-lg">
                +{item.analysis.matchedSkills.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-white/5">
        <Link
          to={`/analysis/${item._id}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 border border-primary-500/20 rounded-lg text-xs font-medium transition-all"
        >
          <Eye className="w-3.5 h-3.5" />
          View
        </Link>
        <button
          onClick={() => onDelete(item._id)}
          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// ════════════════════════════════════════
// LIST ROW VIEW
// ════════════════════════════════════════
const AnalysisRow = ({ item, onDelete, index }) => {
  const matchScore = item.analysis?.matchScore || 0;
  const atsScore   = item.analysis?.atsScore   || 0;
  const scoreColor = getScoreColor(matchScore);

  return (
    <div
      className="glass-card p-4 hover:border-primary-500/30 transition-all duration-200 group animate-fade-up"
      style={{ animationDelay: `${index * 0.03}s` }}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-white" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm truncate">
            {item.resume?.fileName || 'Untitled'}
          </h3>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-0.5">
            {item.jobTitle && (
              <span className="flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                {item.jobTitle}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(item.createdAt)}
            </span>
          </div>
        </div>

        {/* Scores */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="text-center">
            <div className={`text-lg font-bold ${scoreColor.text}`}>{matchScore}%</div>
            <div className="text-xs text-slate-500">Match</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-400">{atsScore}%</div>
            <div className="text-xs text-slate-500">ATS</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Link
            to={`/analysis/${item._id}`}
            className="p-2 bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 rounded-lg transition-all"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button
            onClick={() => onDelete(item._id)}
            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════
// DELETE CONFIRMATION MODAL
// ════════════════════════════════════════
const DeleteModal = ({ open, onClose, onConfirm, loading }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card p-6 max-w-sm w-full animate-fade-up">
        <div className="text-center mb-5">
          <div className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trash2 className="w-7 h-7 text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Delete Analysis?</h3>
          <p className="text-sm text-slate-400">
            This action cannot be undone. The analysis will be permanently removed.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl font-medium text-sm transition-all"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            {loading ? 'Deleting...' : 'Delete'}
          </button>
          <button onClick={onClose} className="flex-1 btn-secondary py-2.5 text-sm">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════
const HistoryPage = () => {
  const navigate = useNavigate();

  // States
  const [analyses,  setAnalyses]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [sortBy,    setSortBy]    = useState('newest');
  const [filter,    setFilter]    = useState('all');
  const [viewMode,  setViewMode]  = useState('grid');

  // Delete modal
  const [deleteId,      setDeleteId]      = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Fetch Analyses ──
  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      const res = await analysisAPI.getAll();
      setAnalyses(res.data.data?.analyses || res.data.data || []);
    } catch (err) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, []);

  // ── Delete Handler ──
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await analysisAPI.delete(deleteId);
      setAnalyses(prev => prev.filter(a => a._id !== deleteId));
      toast.success('Analysis deleted');
      setDeleteId(null);
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Filter + Sort + Search ──
  const filtered = analyses
    .filter(item => {
      // Search filter
      const searchLower = search.toLowerCase();
      const matchSearch = !search ||
        item.resume?.fileName?.toLowerCase().includes(searchLower) ||
        item.jobTitle?.toLowerCase().includes(searchLower) ||
        item.company?.toLowerCase().includes(searchLower);

      // Score filter
      const score = item.analysis?.matchScore || 0;
      let matchFilter = true;
      if (filter === 'excellent') matchFilter = score >= 80;
      if (filter === 'good')      matchFilter = score >= 60 && score < 80;
      if (filter === 'low')       matchFilter = score < 60;

      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      const scoreA = a.analysis?.matchScore || 0;
      const scoreB = b.analysis?.matchScore || 0;

      if (sortBy === 'newest')      return dateB - dateA;
      if (sortBy === 'oldest')      return dateA - dateB;
      if (sortBy === 'highestScore') return scoreB - scoreA;
      if (sortBy === 'lowestScore')  return scoreA - scoreB;
      return 0;
    });

  // ── Loading State ──
  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton className="h-20 rounded-2xl" />
        <LoadingSkeleton className="h-16 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <LoadingSkeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalAnalyses = analyses.length;
  const avgScore = totalAnalyses > 0
    ? Math.round(analyses.reduce((sum, a) => sum + (a.analysis?.matchScore || 0), 0) / totalAnalyses)
    : 0;
  const bestScore = totalAnalyses > 0
    ? Math.max(...analyses.map(a => a.analysis?.matchScore || 0))
    : 0;
  const thisMonth = analyses.filter(a => {
    const d = new Date(a.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Header Card ── */}
      <div className="glass-card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-secondary-600/10" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Analysis History</h1>
                <p className="text-slate-400 text-sm">
                  Browse and manage all your past resume analyses
                </p>
              </div>
            </div>
          </div>
          <Link to="/upload" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Analysis
          </Link>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-4 h-4 text-primary-400" />
            <span className="text-xs text-slate-400">Total</span>
          </div>
          <div className="text-2xl font-bold text-white">{totalAnalyses}</div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-slate-400">This Month</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{thisMonth}</div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-xs text-slate-400">Avg Score</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{avgScore}%</div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-slate-400">Best Score</span>
          </div>
          <div className="text-2xl font-bold text-yellow-400">{bestScore}%</div>
        </div>
      </div>

      {/* ── Filters Bar ── */}
      <div className="glass-card p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by filename, job title, company..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-10 pr-10"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Dropdown */}
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-500 cursor-pointer"
          >
            <option value="all"       className="bg-dark-400">All Scores</option>
            <option value="excellent" className="bg-dark-400">Excellent (80%+)</option>
            <option value="good"      className="bg-dark-400">Good (60-79%)</option>
            <option value="low"       className="bg-dark-400">Needs Work ({'<'}60%)</option>
          </select>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-500 cursor-pointer"
          >
            <option value="newest"        className="bg-dark-400">Newest First</option>
            <option value="oldest"        className="bg-dark-400">Oldest First</option>
            <option value="highestScore"  className="bg-dark-400">Highest Score</option>
            <option value="lowestScore"   className="bg-dark-400">Lowest Score</option>
          </select>

          {/* View Mode */}
          <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {(search || filter !== 'all') && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
            <span className="text-xs text-slate-400">Showing:</span>
            <span className="text-sm text-white font-medium">{filtered.length} results</span>
            {(search || filter !== 'all') && (
              <button
                onClick={() => { setSearch(''); setFilter('all'); }}
                className="ml-auto text-xs text-primary-400 hover:text-primary-300"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Results ── */}
      {filtered.length === 0 ? (
        analyses.length === 0 ? (
          // No analyses yet
          <div className="glass-card p-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Analyses Yet</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Upload your first resume to get started with AI-powered analysis and personalized recommendations.
            </p>
            <Link to="/upload" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create First Analysis
            </Link>
          </div>
        ) : (
          // No results from filter
          <div className="glass-card p-12 text-center">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Results Found</h3>
            <p className="text-slate-400 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => { setSearch(''); setFilter('all'); }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        )
      ) : (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item, i) => (
              <AnalysisCard
                key={item._id}
                item={item}
                index={i}
                onDelete={(id) => setDeleteId(id)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item, i) => (
              <AnalysisRow
                key={item._id}
                item={item}
                index={i}
                onDelete={(id) => setDeleteId(id)}
              />
            ))}
          </div>
        )
      )}

      {/* Delete Modal */}
      <DeleteModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />

    </div>
  );
};

export default HistoryPage;