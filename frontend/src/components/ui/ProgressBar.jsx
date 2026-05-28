// frontend/src/components/ui/ProgressBar.jsx
// 📊 Linear Progress Bar

import clsx from 'clsx';

const ProgressBar = ({
  value = 0,             // 0-100
  max = 100,
  variant = 'primary',   // primary | success | warning | error | gradient
  size = 'md',           // sm | md | lg
  showLabel = false,
  label = '',
  animated = true,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  // 🎨 Variants
  const variants = {
    primary:  'bg-primary-500',
    success:  'bg-green-500',
    warning:  'bg-yellow-500',
    error:    'bg-red-500',
    gradient: 'bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500',
  };

  // 📏 Sizes
  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={clsx('w-full', className)}>
      {/* Label + Value */}
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {label}
            </span>
          )}
          {showLabel && (
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      {/* Bar Container */}
      <div
        className={clsx(
          'w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden',
          sizes[size]
        )}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        {/* Bar Fill */}
        <div
          className={clsx(
            'h-full rounded-full',
            variants[variant],
            animated && 'transition-all duration-1000 ease-out'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;