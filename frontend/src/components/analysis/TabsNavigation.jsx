// frontend/src/components/analysis/TabsNavigation.jsx
// 📑 Tab switcher

import { LayoutDashboard, Target, Zap, Lightbulb } from 'lucide-react';
import clsx from 'clsx';

const TabsNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview',     label: 'Overview',     icon: LayoutDashboard },
    { id: 'ats',          label: 'ATS Details',  icon: Target },
    { id: 'skills',       label: 'Skills',       icon: Zap },
    { id: 'improvements', label: 'Improvements', icon: Lightbulb },
  ];

  return (
    <div className="mb-6 glass-card !p-2">
      <div className="flex gap-1 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={clsx(
                'flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
                isActive
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-glow-primary'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabsNavigation;