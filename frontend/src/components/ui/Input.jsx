// frontend/src/components/ui/Input.jsx
// 📝 Form Input Component

import { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

const Input = forwardRef(({
  label,
  type = 'text',
  error,
  helper,
  icon: Icon = null,
  iconPosition = 'left',
  required = false,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  // 🔐 Handle password type with toggle
  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;
  const isPassword = type === 'password';

  return (
    <div className={clsx('w-full', containerClassName)}>
      {/* 📝 Label */}
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* 📦 Input Wrapper */}
      <div className="relative">
        {/* 🎨 Left Icon */}
        {Icon && iconPosition === 'left' && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        )}

        {/* 📝 Input */}
        <input
          ref={ref}
          type={inputType}
          className={clsx(
            // Base
            'w-full py-3 rounded-xl transition-all duration-200',
            'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400',
            'dark:bg-white/5 dark:border-white/10 dark:text-slate-100 dark:placeholder:text-slate-500',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
            // Padding based on icons
            Icon && iconPosition === 'left'  ? 'pl-12' : 'pl-4',
            (Icon && iconPosition === 'right') || isPassword ? 'pr-12' : 'pr-4',
            // Error state
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : 'focus:border-primary-500',
            className
          )}
          {...props}
        />

        {/* 🎨 Right Icon (or Password Toggle) */}
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        ) : (
          Icon && iconPosition === 'right' && (
            <Icon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          )
        )}
      </div>

      {/* ❌ Error Message */}
      {error && (
        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}

      {/* 💡 Helper Text */}
      {helper && !error && (
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          {helper}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;