// frontend/src/components/dashboard/StatCard.jsx
// 📊 Reusable Stat Card

import Card from '@components/ui/Card';
import clsx from 'clsx';

const StatCard = ({
  icon: Icon,
  label,
  value,
  trend = null,         // e.g., "+12% from last month"
  trendUp = true,
  gradient = 'from-primary-500 to-secondary-500',
  suffix = '',          // e.g., "%" or "pts"
  loading = false,
}) => {
  return (
    <Card variant="glass" hoverable className="relative overflow-hidden">
      {/* 🌈 Decorative gradient blob */}
      <div className={clsx('absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-20 bg-gradient-to-br', gradient)} />

      <div className="relative z-10">
        {/* 🎨 Icon */}
        <div className={clsx('inline-flex w-12 h-12 rounded-xl items-center justify-center mb-4 bg-gradient-to-br', gradient)}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* 📝 Label */}
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
          {label}
        </p>

        {/* 🔢 Value */}
        {loading ? (
          <div className="h-10 w-24 bg-slate-200 dark:bg-white/10 rounded-md animate-pulse" />
        ) : (
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
              {value}
            </span>
            {suffix && (
              <span className="text-lg text-slate-500 dark:text-slate-400">{suffix}</span>
            )}
          </div>
        )}

        {/* 📈 Trend (optional) */}
        {trend && !loading && (
          <p className={clsx(
            'text-xs font-medium mt-2',
            trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          )}>
            {trendUp ? '↑' : '↓'} {trend}
          </p>
        )}
      </div>
    </Card>
  );
};

export default StatCard;