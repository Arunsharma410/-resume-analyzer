// frontend/src/components/ui/CircularProgress.jsx
// ⭕ Circular Progress Indicator (for ATS Score, Match Score, etc.)

import clsx from 'clsx';
import { useEffect, useState } from 'react';

const CircularProgress = ({
  value = 0,           // 0-100
  size = 120,          // pixel size
  strokeWidth = 10,
  variant = 'primary', // primary | success | warning | error | gradient
  showLabel = true,
  label = '',          // text under the percentage
  animated = true,
  className = '',
}) => {
  const [progress, setProgress] = useState(0);

  // 🎬 Animate from 0 to value
  useEffect(() => {
    if (!animated) {
      setProgress(value);
      return;
    }
    const timer = setTimeout(() => setProgress(value), 100);
    return () => clearTimeout(timer);
  }, [value, animated]);

  const radius      = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset      = circumference - (progress / 100) * circumference;

  // 🎨 Variant colors
  const variants = {
    primary: '#6366F1',
    success: '#10B981',
    warning: '#F59E0B',
    error:   '#EF4444',
  };

  // 🌈 Auto-detect color based on score
  const getAutoColor = (val) => {
    if (val >= 80) return variants.success;
    if (val >= 60) return variants.primary;
    if (val >= 40) return variants.warning;
    return variants.error;
  };

  const strokeColor = variant === 'gradient' ? 'url(#gradient)' : (variant === 'auto' ? getAutoColor(value) : variants[variant]);

  return (
    <div className={clsx('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#6366F1" />
            <stop offset="50%"  stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>

        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-200 dark:text-white/10"
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={clsx(animated && 'transition-all duration-1000 ease-out')}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showLabel && (
          <span className="text-3xl font-bold text-slate-900 dark:text-white">
            {Math.round(progress)}
            <span className="text-lg">%</span>
          </span>
        )}
        {label && (
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

export default CircularProgress;