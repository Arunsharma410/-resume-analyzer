// frontend/src/components/upload/FilePreview.jsx
// 📄 Selected File Preview

import { FileText, X, CheckCircle2 } from 'lucide-react';
import { formatFileSize } from '@utils/helpers';

const FilePreview = ({ file, onRemove, disabled = false }) => {
  if (!file) return null;

  return (
    <div className="glass-card p-4 animate-fade-in-up">
      <div className="flex items-center gap-4">
        {/* 📄 File icon */}
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
          <FileText className="w-7 h-7 text-white" />
        </div>

        {/* 📝 File info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-slate-900 dark:text-white truncate">
              {file.name}
            </p>
            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
            <span>{formatFileSize(file.size)}</span>
            <span>•</span>
            <span>PDF Document</span>
            <span>•</span>
            <span className="text-green-600 dark:text-green-400 font-medium">Ready to analyze</span>
          </div>
        </div>

        {/* ❌ Remove button */}
        <button
          onClick={onRemove}
          disabled={disabled}
          className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-red-100 dark:hover:bg-red-500/20 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Remove file"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default FilePreview;