// frontend/src/components/analysis/ScoreHero.jsx
// 🎯 Hero section with big scores

import Card from '@components/ui/Card';
import CircularProgress from '@components/ui/CircularProgress';
import Badge from '@components/ui/Badge';
import { TrendingUp, Target, Award, Zap } from 'lucide-react';
import { getScoreLevel } from '@utils/helpers';
import clsx from 'clsx';

const ScoreHero = ({ analysis }) => {
  const matchScore = analysis.analysis?.matchScore || 0;
  const atsScore   = analysis.analysis?.atsScore   || 0;
  const matchLevel = getScoreLevel(matchScore);
  const atsLevel   = getScoreLevel(atsScore);

  // 🎨 Variant for circular progress
  const getVariant = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'primary';
    if (score >= 40) return 'warning';
    return 'error';
  };

  return (
    <Card variant="glass" className="mb-6 relative overflow-hidden">
      {/* 🌌 Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative z-10 grid lg:grid-cols-2 gap-6">
        {/* 📊 Left: Scores */}
        <div className="grid grid-cols-2 gap-4">
          {/* Match Score */}
          <div className="text-center">
            <CircularProgress
              value={matchScore}
              size={160}
              strokeWidth={12}
              variant={getVariant(matchScore)}
              label="Match"
            />
            <div className="mt-3">
              <Badge variant={getVariant(matchScore)} size="md">
                {matchLevel.label}
              </Badge>
            </div>
          </div>

          {/* ATS Score */}
          <div className="text-center">
            <CircularProgress
              value={atsScore}
              size={160}
              strokeWidth={12}
              variant={getVariant(atsScore)}
              label="ATS"
            />
            <div className="mt-3">
              <Badge variant={getVariant(atsScore)} size="md">
                {atsLevel.label}
              </Badge>
            </div>
          </div>
        </div>

        {/* 📝 Right: Summary */}
        <div className="flex flex-col justify-center">
          {/* Experience level badge */}
          {analysis.analysis?.experienceLevel && (
            <Badge variant="primary" icon={Award} className="mb-4 w-fit">
              {analysis.analysis.experienceLevel.charAt(0).toUpperCase() + analysis.analysis.experienceLevel.slice(1)} Level
            </Badge>
          )}

          {/* Overall summary */}
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary-500" />
            AI Summary
          </h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {analysis.analysis?.overallSummary || 'No summary available.'}
          </p>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-white/5">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {analysis.analysis?.matchedSkills?.length || 0}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Matched
              </div>
            </div>
            <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-white/5">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {analysis.analysis?.missingSkills?.length || 0}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Missing
              </div>
            </div>
            <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-white/5">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {analysis.analysis?.suggestions?.length || 0}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Tips
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ScoreHero;