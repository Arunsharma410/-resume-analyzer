// frontend/src/components/analysis/SkillsTab.jsx
// 💪 Skills tab - matched + missing skills

import Card from '@components/ui/Card';
import Badge from '@components/ui/Badge';
import EmptyState from '@components/ui/EmptyState';
import { CheckCircle2, AlertCircle, TrendingUp, Zap } from 'lucide-react';

const SkillsTab = ({ analysis }) => {
  const matchedSkills = analysis.analysis?.matchedSkills || [];
  const missingSkills = analysis.analysis?.missingSkills || [];

  // 📊 Calculate match percentage
  const totalSkills = matchedSkills.length + missingSkills.length;
  const matchPercentage = totalSkills > 0
    ? Math.round((matchedSkills.length / totalSkills) * 100)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 📊 Summary card */}
      <Card variant="gradient">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {matchPercentage}% Skills Match
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              You have <span className="font-semibold text-green-600 dark:text-green-400">{matchedSkills.length}</span> of {totalSkills} required skills
            </p>
          </div>
          <div className="flex gap-3">
            <Badge variant="success" size="lg" icon={CheckCircle2}>
              {matchedSkills.length} Matched
            </Badge>
            <Badge variant="warning" size="lg" icon={AlertCircle}>
              {missingSkills.length} Missing
            </Badge>
          </div>
        </div>
      </Card>

      {/* 💪 Matched Skills */}
      <Card variant="glass">
        <Card.Header>
          <Card.Title>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Matched Skills ({matchedSkills.length})
            </span>
          </Card.Title>
          <Card.Description>Skills found in both your resume and the job description</Card.Description>
        </Card.Header>

        {matchedSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map((skill, index) => (
              <div
                key={index}
                className="group flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 hover:scale-105 transition cursor-default"
              >
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-900 dark:text-green-300">
                  {skill}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={CheckCircle2}
            title="No matched skills"
            description="Your resume doesn't appear to have any skills from the job description."
          />
        )}
      </Card>

      {/* ⚠️ Missing Skills */}
      <Card variant="glass">
        <Card.Header>
          <Card.Title>
            <span className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Missing Skills ({missingSkills.length})
            </span>
          </Card.Title>
          <Card.Description>Skills required by the job but not found in your resume</Card.Description>
        </Card.Header>

        {missingSkills.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-2 mb-4">
              {missingSkills.map((skill, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 hover:scale-105 transition cursor-default"
                >
                  <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm font-medium text-orange-900 dark:text-orange-300">
                    {skill}
                  </span>
                </div>
              ))}
            </div>

            {/* 💡 Tip */}
            <div className="mt-4 p-4 rounded-xl bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20">
              <p className="text-sm text-primary-900 dark:text-primary-300">
                <Zap className="inline w-4 h-4 mr-1" />
                <strong>Tip:</strong> Consider adding these skills to your resume if you have experience with them, or upskill in the most relevant ones.
              </p>
            </div>
          </>
        ) : (
          <EmptyState
            icon={TrendingUp}
            title="No missing skills!"
            description="Great job! Your resume covers all the required skills."
          />
        )}
      </Card>
    </div>
  );
};

export default SkillsTab;