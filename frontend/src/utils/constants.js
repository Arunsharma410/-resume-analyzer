// frontend/src/utils/constants.js
// 🔧 App-wide constants

// 🌐 API
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'ResumeAI';

// 🗄️ LocalStorage keys
export const STORAGE_KEYS = {
  TOKEN: 'resumeai_token',
  USER:  'resumeai_user',
  THEME: 'resumeai_theme',
};

// 🎨 Themes
export const THEMES = {
  LIGHT: 'light',
  DARK:  'dark',
};

// 📊 Score thresholds
export const SCORE_LEVELS = {
  EXCELLENT: { min: 80, label: 'Excellent', color: 'success' },
  GOOD:      { min: 60, label: 'Good',      color: 'info'    },
  AVERAGE:   { min: 40, label: 'Average',   color: 'warning' },
  POOR:      { min: 0,  label: 'Needs Work', color: 'danger' },
};

// 💼 Plan limits
export const PLAN_LIMITS = {
  free:       { monthly: 5,        label: 'Free'        },
  pro:        { monthly: Infinity, label: 'Pro'         },
  enterprise: { monthly: Infinity, label: 'Enterprise'  },
};

// 📂 File constraints
export const FILE_CONSTRAINTS = {
  MAX_SIZE_MB:   5,
  MAX_SIZE_BYTES: 5 * 1024 * 1024,
  ACCEPTED_TYPES: ['application/pdf'],
  ACCEPTED_EXTENSIONS: ['.pdf'],
};

// 🛣️ Route paths
export const ROUTES = {
  // Public
  LANDING:  '/',
  LOGIN:    '/login',
  REGISTER: '/register',
  PRICING:  '/pricing',

  // Protected
  DASHBOARD:  '/dashboard',
  UPLOAD:     '/upload',
  ANALYSIS:   '/analysis',
  ATS:        '/ats',
  SKILLS:     '/skills-gap',
  JOB_MATCH:  '/job-match',
  PROFILE:    '/profile',
};