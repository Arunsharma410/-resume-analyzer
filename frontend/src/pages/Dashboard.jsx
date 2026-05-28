// frontend/src/pages/Dashboard.jsx
// 📊 Main Dashboard Page

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, TrendingUp, Target, Crown, Upload as UploadIcon,
  Sparkles, Calendar
} from 'lucide-react';
import { analysisAPI } from '@services/api';
import { useAuth } from '@context/AuthContext';

import Button from '@components/ui/Button';
import StatCard from '@components/dashboard/StatCard';
import TrendsChart from '@components/dashboard/TrendsChart';
import ScoreDistribution from '@components/dashboard/ScoreDistribution';
import SkillsList from '@components/dashboard/SkillsList';
import RecentAnalysisCard from '@components/dashboard/RecentAnalysisCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats]       = useState(null);
  const [trends, setTrends]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // 📥 Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // 🚀 Fetch both stats and trends in parallel for speed
        const [statsRes, trendsRes] = await Promise.all([
          analysisAPI.getDashboardStats(),
          analysisAPI.getTrends(7),
        ]);

        setStats(statsRes.data.data.stats);
        setTrends(trendsRes.data.data.trends);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // 🎯 Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* 👋 Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            <Calendar className="inline w-4 h-4 mr-1" />
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long', month: 'long', day: 'numeric',
            })}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Here's what's happening with your resume analyses.
          </p>
        </div>

        <Link to="/upload">
          <Button variant="primary" size="lg" icon={UploadIcon}>
            New Analysis
          </Button>
        </Link>
      </div>

      {/* 📊 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FileText}
          label="Total Analyses"
          value={stats?.totalAnalyses ?? 0}
          gradient="from-primary-500 to-secondary-500"
          loading={loading}
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Match Score"
          value={stats?.avgMatchScore ?? 0}
          suffix="%"
          gradient="from-green-500 to-emerald-500"
          loading={loading}
        />
        <StatCard
          icon={Target}
          label="Avg ATS Score"
          value={stats?.avgAtsScore ?? 0}
          suffix="%"
          gradient="from-blue-500 to-cyan-500"
          loading={loading}
        />
        <StatCard
          icon={Crown}
          label="Current Plan"
          value={user?.plan?.toUpperCase() ?? 'FREE'}
          gradient="from-yellow-500 to-orange-500"
          loading={loading}
        />
      </div>

      {/* 📈 Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trends - takes 2 columns */}
        <div className="lg:col-span-2">
          <TrendsChart data={trends} loading={loading} />
        </div>

        {/* Score Distribution - 1 column */}
        <div>
          <ScoreDistribution
            data={stats?.scoreDistribution || {}}
            loading={loading}
          />
        </div>
      </div>

      {/* 💪 Skills Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillsList
          skills={stats?.topSkills || []}
          title="Top Matched Skills"
          description="Skills found across your resumes"
          variant="success"
          loading={loading}
        />
        <SkillsList
          skills={stats?.topMissingSkills || []}
          title="Skills Gap"
          description="Skills missing from your resumes"
          variant="error"
          loading={loading}
        />
      </div>

      {/* 📋 Recent Analyses */}
      <RecentAnalysisCard
        analyses={stats?.recentAnalyses || []}
        loading={loading}
      />

      {/* 💡 Pro tip footer (only if user has free plan) */}
      {user?.plan === 'free' && !loading && (
        <div className="glass-card p-6 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                  Upgrade to Pro for unlimited analyses
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  You've used {user?.analysesThisMonth || 0} of 5 analyses this month
                </p>
              </div>
            </div>
            <Link to="/pricing">
              <Button variant="primary">Upgrade Now</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;