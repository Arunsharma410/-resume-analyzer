// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#EEF2FF', 100: '#E0E7FF', 200: '#C7D2FE',
          300: '#A5B4FC', 400: '#818CF8', 500: '#6366F1',
          600: '#4F46E5', 700: '#4338CA', 800: '#3730A3', 900: '#312E81',
        },
        secondary: {
          50:  '#F5F3FF', 100: '#EDE9FE', 200: '#DDD6FE',
          300: '#C4B5FD', 400: '#A78BFA', 500: '#8B5CF6',
          600: '#7C3AED', 700: '#6D28D9', 800: '#5B21B6', 900: '#4C1D95',
        },
        accent: {
          50:  '#ECFEFF', 100: '#CFFAFE', 200: '#A5F3FC',
          300: '#67E8F9', 400: '#22D3EE', 500: '#06B6D4',
          600: '#0891B2', 700: '#0E7490', 800: '#155E75', 900: '#164E63',
        },
        // 🌙 Dark theme — numbered scale (matches your CSS)
        dark: {
          300: '#2A2A3A',
          400: '#1E1E2E',
          500: '#13131A',
          600: '#0A0A0F',
          700: '#050508',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger:  '#EF4444',
        info:    '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-xl':  ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-lg':  ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md':  ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
      },
      animation: {
        'fade-in':        'fadeIn 0.5s ease-in-out',
        'fade-in-up':     'fadeInUp 0.6s ease-out',
        'fade-in-down':   'fadeInDown 0.6s ease-out',
        'slide-in-left':  'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'scale-in':       'scaleIn 0.3s ease-out',
        'pulse-slow':     'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient':       'gradient 8s ease infinite',
        'float':          'float 6s ease-in-out infinite',
        'glow':           'glow 2s ease-in-out infinite',
        'shimmer':        'shimmer 2s linear infinite',
        'spin-slow':      'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn:       { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeInUp:     { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeInDown:   { '0%': { opacity: '0', transform: 'translateY(-20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideInLeft:  { '0%': { opacity: '0', transform: 'translateX(-20px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        slideInRight: { '0%': { opacity: '0', transform: 'translateX(20px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        scaleIn:      { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        gradient:     { '0%, 100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
        float:        { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-20px)' } },
        glow:         { '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' }, '50%': { boxShadow: '0 0 40px rgba(99, 102, 241, 0.6)' } },
        shimmer:      { '0%': { backgroundPosition: '-1000px 0' }, '100%': { backgroundPosition: '1000px 0' } },
      },
      backdropBlur: { xs: '2px' },
      backgroundImage: {
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':   'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%)',
        'gradient-mesh':    'radial-gradient(at 0% 0%, #6366F1 0px, transparent 50%), radial-gradient(at 100% 0%, #8B5CF6 0px, transparent 50%), radial-gradient(at 100% 100%, #06B6D4 0px, transparent 50%), radial-gradient(at 0% 100%, #6366F1 0px, transparent 50%)',
      },
      boxShadow: {
        'soft':           '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-md':        '0 4px 20px -4px rgba(0, 0, 0, 0.1)',
        'soft-lg':        '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
        'glow-sm':        '0 0 15px rgba(99, 102, 241, 0.3)',
        'glow':           '0 0 30px rgba(99, 102, 241, 0.4)',
        'glow-lg':        '0 0 50px rgba(99, 102, 241, 0.5)',
        'glow-primary':   '0 0 30px rgba(99, 102, 241, 0.5)',
        'glow-secondary': '0 0 30px rgba(139, 92, 246, 0.5)',
        'glow-accent':    '0 0 30px rgba(6, 182, 212, 0.5)',
        'inner-glow':     'inset 0 2px 4px 0 rgba(255, 255, 255, 0.05)',
      },
    },
  },
  plugins: [],
}