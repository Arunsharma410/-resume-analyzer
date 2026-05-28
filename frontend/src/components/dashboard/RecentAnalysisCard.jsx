// frontend/src/components/dashboard/RecentAnalysisCard.jsx
// 📋 Recent analysis preview card

import { Link } from 'react-router-dom';
import Card from '@components/ui/Card';
import Badge from '@components/ui/Badge';
import EmptyState from '@components/ui/EmptyState';
import Button from '@components/ui/Button';
import { FileText, ArrowRight, Clock, Briefcase, Upload } from 'lucide-react';
import { timeAgo } from '@utils/helpers';

const RecentAnalysisCard = ({ analyses = [], loading = false }) => {
  return (
    <Card variant="glass" className="h-full">
      <Card.Header>
        <div className="flex justify-between items-center">
          <div>
            <Card.Title>
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-500" />
                Recent Analyses
              </span>
            </Card.Title>
            <Card.Description>Your latest resume analyses</Card.Description>
          </div>
          {analyses.length > 0 && (
            <Link to="/history">
              <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                View all
              </Button>
            </Link>
          )}
        </div>
      </Card.Header>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : analyses.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No analyses yet"
          description="Upload your first resume and get instant AI-powered insights."
          action={
            <Link to="/upload">
              <Button variant="primary" icon={Upload}>
                Start Your First Analysis
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {analyses.map((analysis) => (
            <Link
              key={analysis._id}
              to={`/analysis/${analysis._id}`}
              className="block p-4 rounded-xl border border-slate-200 dark:border-white/10 hover:border-primary-500/50 hover:bg-slate-50 dark:hover:bg-white/5 transition group"
            >
              <div className="flex items-center justify-between gap-4">
                {/* Left: Info */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-primary-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">
                      {analysis.jobTitle || 'Untitled Position'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {timeAgo(analysis.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Right: Scores */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Match</p>
                    <Badge
                      variant={
                        analysis.analysis?.matchScore >= 80 ? 'success' :
                        analysis.analysis?.matchScore >= 60 ? 'info' :
                        analysis.analysis?.matchScore >= 40 ? 'warning' : 'error'
                      }
                      size="md"
                    >
                      {analysis.analysis?.matchScore || 0}%
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">ATS</p>
                    <Badge
                      variant={
                        analysis.analysis?.atsScore >= 80 ? 'success' :
                        analysis.analysis?.atsScore >= 60 ? 'info' :
                        analysis.analysis?.atsScore >= 40 ? 'warning' : 'error'
                      }
                      size="md"
                    >
                      {analysis.analysis?.atsScore || 0}%
                    </Badge>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
};

export default RecentAnalysisCard;