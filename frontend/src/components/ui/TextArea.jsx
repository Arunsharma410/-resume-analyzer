// frontend/src/components/ui/TextArea.jsx
// 📄 Multi-line Text Input

import { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';
import clsx from 'clsx';

const TextArea = forwardRef(({
  label,
  error,
  helper,
  required = false,
  rows = 4,
  showCount = false,
  maxLength,
  value = '',
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  return (
    <div className={clsx('w-full', containerClassName)}>
      {/* 📝 Label */}
      {label && (
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {showCount && maxLength && (
            <span className={clsx(
              'text-xs',
              value.length > maxLength * 0.9 ? 'text-yellow-500' : 'text-slate-400'
            )}>
              {value.length} / {maxLength}
            </span>
          )}
        </div>
      )}

      {/* 📝 Textarea */}
      <textarea
        ref={ref}
        rows={rows}
        value={value}
        maxLength={maxLength}
        className={clsx(
          'w-full px-4 py-3 rounded-xl transition-all duration-200 resize-y',
          'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400',
          'dark:bg-white/5 dark:border-white/10 dark:text-slate-100 dark:placeholder:text-slate-500',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
            : 'focus:border-primary-500',
          className
        )}
        {...props}
      />

      {/* ❌ Error */}
      {error && (
        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}

      {/* 💡 Helper */}
      {helper && !error && (
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          {helper}
        </p>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;