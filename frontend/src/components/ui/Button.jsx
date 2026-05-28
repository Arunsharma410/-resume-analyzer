// frontend/src/components/ui/Button.jsx
// 🔘 Reusable Button Component

import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',     // primary | secondary | ghost | danger | success
  size = 'md',             // sm | md | lg
  loading = false,
  disabled = false,
  fullWidth = false,
  icon: Icon = null,       // Pass a Lucide icon component
  iconPosition = 'left',   // left | right
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  // 🎨 Variant styles
  const variants = {
    primary:   'bg-primary-600 hover:bg-primary-500 text-white shadow-md hover:shadow-glow-primary',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border-white/10',
    ghost:     'bg-transparent text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-500/10',
    danger:    'bg-red-600 hover:bg-red-700 text-white shadow-md',
    success:   'bg-green-600 hover:bg-green-700 text-white shadow-md',
    outline:   'bg-transparent border-2 border-primary-500 text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-500/10',
  };

  // 📏 Size styles
  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-2.5',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        // Base styles
        'inline-flex items-center justify-center font-semibold rounded-xl',
        'transition-all duration-300',
        'hover:-translate-y-0.5 active:translate-y-0',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'disabled:hover:translate-y-0 disabled:hover:shadow-none',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-600',
        // Variant
        variants[variant],
        // Size
        sizes[size],
        // Full width
        fullWidth && 'w-full',
        // Custom className
        className
      )}
      {...props}
    >
      {/* 🔄 Loading state */}
      {loading && (
        <Loader2 className={clsx(iconSizes[size], 'animate-spin')} />
      )}

      {/* 🎨 Left icon */}
      {!loading && Icon && iconPosition === 'left' && (
        <Icon className={iconSizes[size]} />
      )}

      {/* 📝 Button text */}
      {children}

      {/* 🎨 Right icon */}
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className={iconSizes[size]} />
      )}
    </button>
  );
};

export default Button;