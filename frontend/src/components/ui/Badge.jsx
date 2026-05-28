// frontend/src/components/ui/Badge.jsx
// 🏷️ Status Badge Component

import clsx from 'clsx';

const Badge = ({
  children,
  variant = 'primary',   // primary | success | warning | error | info | secondary
  size = 'md',           // sm | md | lg
  icon: Icon = null,
  dot = false,           // Show colored dot indicator
  className = '',
  ...props
}) => {
  // 🎨 Variants (light + dark mode)
  const variants = {
    primary:   'bg-primary-100 text-primary-700 border-primary-200 dark:bg-primary-500/20 dark:text-primary-400 dark:border-primary-500/30',
    secondary: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/20 dark:text-slate-300 dark:border-slate-500/30',
    success:   'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30',
    warning:   'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30',
    error:     'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30',
    info:      'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30',
  };

  // 📏 Sizes
  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-xs gap-1',
    lg: 'px-4 py-1.5 text-sm gap-1.5',
  };

  // 🔵 Dot colors
  const dotColors = {
    primary:   'bg-primary-500',
    secondary: 'bg-slate-500',
    success:   'bg-green-500',
    warning:   'bg-yellow-500',
    error:     'bg-red-500',
    info:      'bg-blue-500',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center font-semibold rounded-full border',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={clsx('w-1.5 h-1.5 rounded-full animate-pulse', dotColors[variant])} />
      )}
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
};

export default Badge;