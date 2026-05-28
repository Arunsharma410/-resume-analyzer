// frontend/src/components/analysis/ImprovementsTab.jsx
// 💡 Improvements tab - AI suggestions

import Card from '@components/ui/Card';
import Badge from '@components/ui/Badge';
import EmptyState from '@components/ui/EmptyState';
import { Lightbulb, ArrowRight, Sparkles, CheckSquare } from 'lucide-react';

const ImprovementsTab = ({ analysis }) => {
  const suggestions = analysis.analysis?.suggestions || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 📌 Intro card */}
      <Card variant="gradient">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              AI-Powered Recommendations
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Personalized suggestions to make your resume stand out for this role
            </p>
          </div>
        </div>
      </Card>

      {/* 💡 Suggestions list */}
      <Card variant="glass">
        <Card.Header>
          <Card.Title>
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-500" />
              Improvement Suggestions
            </span>
            <Badge variant="primary" size="sm" className="ml-2">
              {suggestions.length} tips
            </Badge>
          </Card.Title>
          <Card.Description>Apply these to improve your match score</Card.Description>
        </Card.Header>

        {suggestions.length > 0 ? (
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="group flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-primary-500/50 hover:bg-primary-50/50 dark:hover:bg-primary-500/5 transition"
              >
                {/* Number badge */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>

                {/* Suggestion text */}
                <div className="flex-1">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {suggestion}
                  </p>
                </div>

                {/* Action icon */}
                <ArrowRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-primary-500 group-hover:translate-x-1 transition flex-shrink-0" />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={CheckSquare}
            title="No suggestions"
            description="Your resume looks great! No specific improvements needed."
          />
        )}
      </Card>

      {/* 🎯 Action plan */}
      {suggestions.length > 0 && (
        <Card variant="glass" className="bg-gradient-to-br from-primary-500/5 to-secondary-500/5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                Your Action Plan
              </h3>
              <ol className="text-sm text-slate-700 dark:text-slate-300 space-y-2 list-decimal list-inside">
                <li>Review the suggestions above</li>
                <li>Update your resume with the recommended changes</li>
                <li>Add missing skills (if you have them)</li>
                <li>Re-upload and re-analyze to track improvement</li>
              </ol>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ImprovementsTab;