// frontend/src/components/ui/EmptyState.jsx
// 🚨 Empty State Placeholder

import clsx from 'clsx';
import { Inbox } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No data found',
  description = '',
  action = null,        // React element (e.g., a Button)
  className = '',
}) => {
  return (
    <div className={clsx(
      'flex flex-col items-center justify-center text-center py-12 px-6',
      className
    )}>
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-slate-400 dark:text-slate-500" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mb-6">
          {description}
        </p>
      )}

      {/* Action Button */}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

export default EmptyState;