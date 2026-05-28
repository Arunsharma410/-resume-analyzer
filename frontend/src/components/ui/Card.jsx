// frontend/src/components/ui/Card.jsx
// 📦 Reusable Card Component

import clsx from 'clsx';

const Card = ({
  children,
  variant = 'default',   // default | glass | gradient | bordered
  hoverable = false,
  padding = 'md',        // none | sm | md | lg
  className = '',
  onClick,
  ...props
}) => {
  // 🎨 Variant styles
  const variants = {
    default:  'bg-white dark:bg-dark-500 border border-slate-200 dark:border-white/10 shadow-soft',
    glass:    'glass-card',
    gradient: 'bg-gradient-to-br from-primary-500/10 via-secondary-500/10 to-accent-500/10 border border-primary-500/20',
    bordered: 'bg-transparent border-2 border-slate-200 dark:border-white/10',
  };

  // 📏 Padding styles
  const paddings = {
    none: '',
    sm:   'p-4',
    md:   'p-6',
    lg:   'p-8',
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        'rounded-2xl transition-all duration-300',
        variants[variant],
        paddings[padding],
        hoverable && 'hover:-translate-y-1 hover:shadow-lg cursor-pointer hover:border-primary-500/30',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// 📌 Subcomponents for structured cards
const CardHeader = ({ children, className = '' }) => (
  <div className={clsx('mb-4 pb-4 border-b border-slate-200 dark:border-white/10', className)}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={clsx('text-xl font-bold text-slate-900 dark:text-white', className)}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = '' }) => (
  <p className={clsx('text-sm text-slate-600 dark:text-slate-400 mt-1', className)}>
    {children}
  </p>
);

const CardBody = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={clsx('mt-4 pt-4 border-t border-slate-200 dark:border-white/10', className)}>
    {children}
  </div>
);

Card.Header      = CardHeader;
Card.Title       = CardTitle;
Card.Description = CardDescription;
Card.Body        = CardBody;
Card.Footer      = CardFooter;

export default Card;