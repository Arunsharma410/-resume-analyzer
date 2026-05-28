// frontend/src/components/ui/Spinner.jsx
// 🔄 Loading Spinner

import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

const Spinner = ({
  size = 'md',          // sm | md | lg | xl
  variant = 'primary',  // primary | white | slate
  fullScreen = false,
  label = '',
  className = '',
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
    xl: 'w-16 h-16',
  };

  const variants = {
    primary: 'text-primary-500',
    white:   'text-white',
    slate:   'text-slate-500',
  };

  const spinner = (
    <div className={clsx('inline-flex flex-col items-center justify-center gap-3', className)}>
      <Loader2 className={clsx('animate-spin', sizes[size], variants[variant])} />
      {label && (
        <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-dark-600/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Spinner;