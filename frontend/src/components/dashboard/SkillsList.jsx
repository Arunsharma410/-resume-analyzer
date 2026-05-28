// frontend/src/components/dashboard/SkillsList.jsx
// 💪 Top skills list (matched or missing)

import Card from '@components/ui/Card';
import Badge from '@components/ui/Badge';
import EmptyState from '@components/ui/EmptyState';
import { TrendingUp, AlertCircle } from 'lucide-react';

const SkillsList = ({
  skills = [],
  title,
  description,
  variant = 'success',  // 'success' for matched, 'error' for missing
  loading = false,
}) => {
  const isMatched = variant === 'success';
  const Icon = isMatched ? TrendingUp : AlertCircle;
  const iconColor = isMatched ? 'text-green-500' : 'text-orange-500';

  // 🔢 Find max count to calculate bar widths
  const maxCount = Math.max(...skills.map(s => s.count), 1);

  return (
    <Card variant="glass" className="h-full">
      <Card.Header>
        <Card.Title>
          <span className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${iconColor}`} />
            {title}
          </span>
        </Card.Title>
        <Card.Description>{description}</Card.Description>
      </Card.Header>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 bg-slate-100 dark:bg-white/5 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : skills.length === 0 ? (
        <EmptyState
          icon={Icon}
          title="No data yet"
          description="Run your first analysis to see insights"
        />
      ) : (
        <div className="space-y-3">
          {skills.map((skill, index) => (
            <div key={index} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {skill.skill}
                </span>
                <Badge variant={isMatched ? 'success' : 'warning'} size="sm">
                  {skill.count}×
                </Badge>
              </div>

              {/* 📊 Visual bar */}
              <div className="h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    isMatched
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : 'bg-gradient-to-r from-orange-500 to-red-500'
                  }`}
                  style={{ width: `${(skill.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default SkillsList;