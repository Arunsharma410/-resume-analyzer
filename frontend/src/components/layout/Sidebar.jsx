// frontend/src/components/layout/Sidebar.jsx
// 📑 Dashboard Sidebar Navigation

import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Upload, FileText, User,
  LogOut, Sparkles, Settings, CreditCard, Menu, X
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { getInitials, stringToColor } from '@utils/helpers';
import clsx from 'clsx';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  // 🔗 Sidebar nav links
  const navItems = [
    { name: 'Dashboard',  path: '/dashboard', icon: LayoutDashboard },
    { name: 'New Analysis', path: '/upload',  icon: Upload          },
    { name: 'History',    path: '/history',   icon: FileText        },
    { name: 'Profile',    path: '/profile',   icon: User            },
    { name: 'Pricing',    path: '/pricing',   icon: CreditCard      },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className={clsx(
      'fixed left-0 top-0 h-screen z-30 transition-all duration-300',
      'glass-card !rounded-none border-r border-slate-200 dark:border-white/10',
      collapsed ? 'w-20' : 'w-64'
    )}>
      <div className="flex flex-col h-full p-4">
        {/* 🎯 Logo + Collapse Button */}
        <div className="flex items-center justify-between mb-8">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">ResumeAI</span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>

        {/* 🔗 Navigation Links */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'flex items-center gap-3 px-3 py-3 rounded-xl transition-all',
                  isActive(item.path)
                    ? 'bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white',
                  collapsed && 'justify-center'
                )}
                title={collapsed ? item.name : ''}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="text-sm">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* 👤 User Profile + Logout */}
        <div className="border-t border-slate-200 dark:border-white/10 pt-4 mt-4">
          {!collapsed && user && (
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                style={{ backgroundColor: stringToColor(user.name) }}
              >
                {getInitials(user.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={clsx(
              'flex items-center gap-3 px-3 py-3 rounded-xl w-full transition-all',
              'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10',
              collapsed && 'justify-center'
            )}
            title={collapsed ? 'Logout' : ''}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;