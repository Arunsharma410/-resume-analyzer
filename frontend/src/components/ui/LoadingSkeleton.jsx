// frontend/src/components/ui/LoadingSkeleton.jsx
// 💀 Loading Skeleton Placeholders

import clsx from 'clsx';

// 🎯 Base Skeleton (use this for custom shapes)
const Skeleton = ({ className = '', ...props }) => (
  <div
    className={clsx(
      'bg-slate-200 dark:bg-white/10 rounded-md animate-pulse',
      className
    )}
    {...props}
  />
);

// 📝 Text Skeleton (multiple lines)
const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={clsx('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={clsx(
          'h-4',
          i === lines - 1 ? 'w-3/4' : 'w-full'
        )}
      />
    ))}
  </div>
);

// 📦 Card Skeleton
const SkeletonCard = ({ className = '' }) => (
  <div className={clsx('glass-card p-6 space-y-4', className)}>
    <Skeleton className="h-6 w-1/3" />
    <SkeletonText lines={3} />
    <div className="flex gap-2">
      <Skeleton className="h-8 w-20 rounded-full" />
      <Skeleton className="h-8 w-20 rounded-full" />
    </div>
  </div>
);

// 👤 Avatar Skeleton
const SkeletonAvatar = ({ size = 40, className = '' }) => (
  <Skeleton
    className={clsx('rounded-full', className)}
    style={{ width: size, height: size }}
  />
);

// 📊 Stat Skeleton (for dashboard stats)
const SkeletonStat = ({ className = '' }) => (
  <div className={clsx('glass-card p-6 space-y-3', className)}>
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-10 w-1/3" />
    <Skeleton className="h-3 w-full" />
  </div>
);

// 📋 Table Row Skeleton
const SkeletonTableRow = ({ columns = 4 }) => (
  <div className="flex gap-4 p-4 border-b border-slate-200 dark:border-white/10">
    {Array.from({ length: columns }).map((_, i) => (
      <Skeleton key={i} className="h-4 flex-1" />
    ))}
  </div>
);

Skeleton.Text     = SkeletonText;
Skeleton.Card     = SkeletonCard;
Skeleton.Avatar   = SkeletonAvatar;
Skeleton.Stat     = SkeletonStat;
Skeleton.TableRow = SkeletonTableRow;

export default Skeleton;