// frontend/src/components/upload/FileDropZone.jsx
// 🖱️ Drag & Drop File Upload Zone

import { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { validateFile } from '@utils/helpers';
import { FILE_CONSTRAINTS } from '@utils/constants';
import clsx from 'clsx';

const FileDropZone = ({ onFileSelect, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError]           = useState('');
  const fileInputRef                = useRef(null);

  // 🎯 Handle drag enter
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  // 🎯 Handle drag leave
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // 🎯 Handle drag over (needed to enable drop)
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // 🎯 Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError('');

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  // 🎯 Handle file from input
  const handleChange = (e) => {
    setError('');
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  // ✅ Process selected file
  const handleFile = (file) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    onFileSelect(file);
  };

  // 🖱️ Trigger file input click
  const openFileDialog = () => {
    if (!disabled) fileInputRef.current?.click();
  };

  return (
    <div>
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={clsx(
          'relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300',
          'p-12 text-center group',
          isDragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10 scale-[1.02]'
            : 'border-slate-300 dark:border-white/20 hover:border-primary-500 hover:bg-slate-50 dark:hover:bg-white/5',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-red-500 bg-red-50 dark:bg-red-500/10'
        )}
      >
        {/* 🌌 Decorative background */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className={clsx(
            'absolute -top-4 -left-4 w-32 h-32 rounded-full blur-3xl transition-opacity',
            isDragging ? 'bg-primary-500/30 opacity-100' : 'bg-primary-500/10 opacity-0 group-hover:opacity-100'
          )} />
          <div className={clsx(
            'absolute -bottom-4 -right-4 w-32 h-32 rounded-full blur-3xl transition-opacity',
            isDragging ? 'bg-secondary-500/30 opacity-100' : 'bg-secondary-500/10 opacity-0 group-hover:opacity-100'
          )} />
        </div>

        <div className="relative z-10">
          {/* 🎨 Icon */}
          <div className={clsx(
            'inline-flex w-20 h-20 rounded-2xl items-center justify-center mb-4 transition-all',
            isDragging
              ? 'bg-gradient-to-br from-primary-500 to-secondary-500 scale-110'
              : 'bg-primary-100 dark:bg-primary-500/20 group-hover:scale-110'
          )}>
            {isDragging ? (
              <Upload className="w-10 h-10 text-white animate-bounce" />
            ) : (
              <FileText className="w-10 h-10 text-primary-600 dark:text-primary-400" />
            )}
          </div>

          {/* 📝 Text */}
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {isDragging ? 'Drop your resume here!' : 'Upload your resume'}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Drag and drop your PDF file here, or{' '}
            <span className="text-primary-600 dark:text-primary-400 font-semibold underline">
              browse files
            </span>
          </p>

          {/* 📋 Constraints */}
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400">
              PDF only
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400">
              Max {FILE_CONSTRAINTS.MAX_SIZE_MB}MB
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400">
              Text selectable
            </span>
          </div>
        </div>

        {/* 📁 Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />
      </div>

      {/* ❌ Error message */}
      {error && (
        <div className="mt-3 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm animate-fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileDropZone;