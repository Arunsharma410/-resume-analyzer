// frontend/src/utils/helpers.js
// 🛠️ Reusable utility functions

import { SCORE_LEVELS, FILE_CONSTRAINTS } from './constants';

// 📅 Format date
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'short',
    day:   'numeric',
    ...options,
  });
};

// ⏰ Format date with time
export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('en-US', {
    year:   'numeric',
    month:  'short',
    day:    'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  });
};

// 🕒 Relative time
export const timeAgo = (date) => {
  if (!date) return '';
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  const intervals = [
    { label: 'year',   seconds: 31536000 },
    { label: 'month',  seconds: 2592000  },
    { label: 'week',   seconds: 604800   },
    { label: 'day',    seconds: 86400    },
    { label: 'hour',   seconds: 3600     },
    { label: 'minute', seconds: 60       },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'Just now';
};

// 🎨 Get score level info
export const getScoreLevel = (score) => {
  if (score >= SCORE_LEVELS.EXCELLENT.min) return SCORE_LEVELS.EXCELLENT;
  if (score >= SCORE_LEVELS.GOOD.min)      return SCORE_LEVELS.GOOD;
  if (score >= SCORE_LEVELS.AVERAGE.min)   return SCORE_LEVELS.AVERAGE;
  return SCORE_LEVELS.POOR;
};

// 🎨 Get score text color (uses your design system)
export const getScoreColor = (score) => {
  if (score >= 80) return 'text-green-600 dark:text-green-400';
  if (score >= 60) return 'text-blue-600 dark:text-blue-400';
  if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};

// 🎨 Get score gradient (matches your premium theme)
export const getScoreGradient = (score) => {
  if (score >= 80) return 'from-green-500 to-emerald-500';
  if (score >= 60) return 'from-primary-500 to-secondary-500';
  if (score >= 40) return 'from-yellow-500 to-orange-500';
  return 'from-red-500 to-pink-500';
};

// 🎨 Get badge class for score (uses your .badge-* classes)
export const getScoreBadgeClass = (score) => {
  if (score >= 80) return 'badge-success';
  if (score >= 60) return 'badge-info';
  if (score >= 40) return 'badge-warning';
  return 'badge-error';
};

// 📂 Validate file
export const validateFile = (file) => {
  if (!file) {
    return { valid: false, error: 'Please select a file' };
  }
  if (!FILE_CONSTRAINTS.ACCEPTED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Only PDF files are allowed' };
  }
  if (file.size > FILE_CONSTRAINTS.MAX_SIZE_BYTES) {
    return { valid: false, error: `File too large (max ${FILE_CONSTRAINTS.MAX_SIZE_MB}MB)` };
  }
  return { valid: true };
};

// 📏 Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

// ✂️ Truncate text
export const truncate = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
};

// 🔤 Capitalize
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// 🎲 Get initials
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

// 🎨 Generate color from string (matches your palette)
export const stringToColor = (str) => {
  if (!str) return '#6366F1';
  const colors = [
    '#6366F1', // primary-500
    '#8B5CF6', // secondary-500
    '#06B6D4', // accent-500
    '#10B981', // success
    '#F59E0B', // warning
    '#EF4444', // danger
    '#3B82F6', // info
    '#EC4899', // pink
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// 🔄 Debounce
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// 📋 Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};