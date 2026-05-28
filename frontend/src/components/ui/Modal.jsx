// frontend/src/components/ui/Modal.jsx
// 🪟 Reusable Modal Component

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import clsx from 'clsx';

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',           // sm | md | lg | xl | full
  showClose = true,
  closeOnBackdrop = true,
  className = '',
}) => {
  // 🔒 Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // ⌨️ Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 📏 Sizes
  const sizes = {
    sm:   'max-w-md',
    md:   'max-w-lg',
    lg:   'max-w-2xl',
    xl:   'max-w-4xl',
    full: 'max-w-7xl',
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      {/* 🌑 Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* 📦 Modal Content */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          'relative w-full glass-card p-6 animate-scale-in',
          sizes[size],
          'max-h-[90vh] overflow-y-auto',
          className
        )}
      >
        {/* ❌ Close Button */}
        {showClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        )}

        {/* 📌 Header */}
        {(title || description) && (
          <div className="mb-6 pr-8">
            {title && (
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {description}
              </p>
            )}
          </div>
        )}

        {/* 📝 Body */}
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
};

// 📌 Footer subcomponent for action buttons
const ModalFooter = ({ children, className = '' }) => (
  <div className={clsx('mt-6 pt-6 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3', className)}>
    {children}
  </div>
);

Modal.Footer = ModalFooter;

export default Modal;