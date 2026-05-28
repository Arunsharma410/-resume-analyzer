// frontend/src/components/analysis/OverviewTab.jsx
// 📊 Overview tab - strengths, weaknesses, recommended roles

import Card from '@components/ui/Card';
import Badge from '@components/ui/Badge';
import { CheckCircle2, AlertCircle, Briefcase } from 'lucide-react';

const OverviewTab = ({ analysis }) => {
  const strengths        = analysis.analysis?.strengths        || [];
  const weaknesses       = analysis.analysis?.weaknesses       || [];
  const recommendedRoles = analysis.analysis?.recommendedRoles || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 💪 Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card variant="glass">
          <Card.Header>
            <Card.Title>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Strengths
              </span>
            </Card.Title>
            <Card.Description>What's working well in your resume</Card.Description>
          </Card.Header>

          {strengths.length > 0 ? (
            <ul className="space-y-3">
              {strengths.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-500/5 border border-green-200 dark:border-green-500/20"
                >
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
              No strengths identified
            </p>
          )}
        </Card>

        {/* Weaknesses */}
        <Card variant="glass">
          <Card.Header>
            <Card.Title>
              <span className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Weaknesses
              </span>
            </Card.Title>
            <Card.Description>Areas that need attention</Card.Description>
          </Card.Header>

          {weaknesses.length > 0 ? (
            <ul className="space-y-3">
              {weaknesses.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-500/5 border border-orange-200 dark:border-orange-500/20"
                >
                  <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
              No weaknesses identified
            </p>
          )}
        </Card>
      </div>

      {/* 💼 Recommended Roles */}
      {recommendedRoles.length > 0 && (
        <Card variant="glass">
          <Card.Header>
            <Card.Title>
              <span className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary-500" />
                Recommended Job Roles
              </span>
            </Card.Title>
            <Card.Description>Other positions that fit your profile</Card.Description>
          </Card.Header>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recommendedRoles.map((role, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 border border-primary-500/20 hover:border-primary-500/40 transition group cursor-default"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center group-hover:scale-110 transition">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default OverviewTab;