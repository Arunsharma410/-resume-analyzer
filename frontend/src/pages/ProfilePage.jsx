// frontend/src/pages/ProfilePage.jsx
// 👤 User Profile Management Page

import { useState, useRef } from 'react';
import {
  User, Mail, MapPin, Briefcase, Edit3,
  Save, X, Lock, Trash2, Camera,
  Shield, Crown, BarChart2, Calendar,
  CheckCircle, AlertTriangle, Eye, EyeOff,
  Star, Zap, Award, TrendingUp
} from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import { authAPI } from '@services/api';
import toast from 'react-hot-toast';
import LoadingSkeleton from '@components/ui/LoadingSkeleton';

// ════════════════════════════════════════
// AVATAR COMPONENT
// ════════════════════════════════════════
const Avatar = ({ name, avatar, size = 'lg' }) => {
  const sizes = {
    sm: 'w-10 h-10 text-sm',
    lg: 'w-24 h-24 text-3xl',
    xl: 'w-32 h-32 text-4xl',
  };

  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover ring-4 ring-primary-500/30`}
      />
    );
  }

  return (
    <div className={`
      ${sizes[size]} rounded-full bg-gradient-to-br from-primary-500 to-secondary-500
      flex items-center justify-center text-white font-bold ring-4 ring-primary-500/30
    `}>
      {initials}
    </div>
  );
};

// ════════════════════════════════════════
// SECTION CARD COMPONENT
// ════════════════════════════════════════
const SectionCard = ({ title, icon: Icon, iconColor, children }) => (
  <div className="glass-card p-6">
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${iconColor} flex items-center justify-center`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
    </div>
    {children}
  </div>
);

// ════════════════════════════════════════
// STAT ITEM COMPONENT
// ════════════════════════════════════════
const StatItem = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-slate-400 text-sm">{label}</div>
    </div>
  </div>
);

// ════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════
const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();

  // ── Edit Profile State ──
  const [editMode,  setEditMode]  = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [profileForm, setProfileForm] = useState({
    name:     user?.name     || '',
    title:    user?.title    || '',
    location: user?.location || '',
    bio:      user?.bio      || '',
    skills:   user?.skills?.join(', ') || '',
  });

  // ── Password State ──
  const [showPasswordForm,    setShowPasswordForm]    = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword,     setShowNewPassword]     = useState(false);
  const [passwordSaving,      setPasswordSaving]      = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  });

  // ── Delete Account State ──
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword,  setDeletePassword]  = useState('');
  const [deleting,        setDeleting]        = useState(false);

  // ── Handle Profile Update ──
  const handleProfileSave = async () => {
    if (!profileForm.name.trim()) {
      toast.error('Name is required');
      return;
    }

    setSaving(true);
    try {
      const skillsArray = profileForm.skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const res = await authAPI.updateProfile({
        name:     profileForm.name.trim(),
        title:    profileForm.title.trim(),
        location: profileForm.location.trim(),
        bio:      profileForm.bio.trim(),
        skills:   skillsArray,
      });

      updateUser(res.data.user);
      setEditMode(false);
      toast.success('Profile updated successfully! ✅');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // ── Handle Cancel Edit ──
  const handleCancelEdit = () => {
    setProfileForm({
      name:     user?.name     || '',
      title:    user?.title    || '',
      location: user?.location || '',
      bio:      user?.bio      || '',
      skills:   user?.skills?.join(', ') || '',
    });
    setEditMode(false);
  };

  // ── Handle Password Change ──
  const handlePasswordChange = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error('Please fill all password fields');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setPasswordSaving(true);
    try {
      await authAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword:     passwordForm.newPassword,
      });
      toast.success('Password changed successfully! 🔒');
      setShowPasswordForm(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordSaving(false);
    }
  };

  // ── Handle Delete Account ──
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error('Please enter your password');
      return;
    }
    setDeleting(true);
    try {
      await authAPI.deleteAccount(deletePassword);
      toast.success('Account deleted successfully');
      logout();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account');
    } finally {
      setDeleting(false);
    }
  };

  if (!user) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <LoadingSkeleton key={i} className="h-48 rounded-2xl" />
        ))}
      </div>
    );
  }

  const planConfig = {
    free:       { label: 'Free Plan',       color: 'from-slate-500 to-slate-600', icon: User,   limit: '5/month'  },
    pro:        { label: 'Pro Plan',        color: 'from-primary-500 to-secondary-500', icon: Crown,  limit: 'Unlimited' },
    enterprise: { label: 'Enterprise Plan', color: 'from-yellow-500 to-orange-500',    icon: Award,  limit: 'Unlimited' },
  };
  const plan = planConfig[user.plan] || planConfig.free;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">

      {/* ── Page Header ── */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">My Profile</h1>
        <p className="text-slate-400 mt-1">Manage your account settings and preferences</p>
      </div>

      {/* ── Profile Hero Card ── */}
      <div className="glass-card p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 to-secondary-600/5" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <Avatar name={user.name} avatar={user.avatar} size="xl" />
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors shadow-lg">
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                <p className="text-primary-400 font-medium">{user.title || 'Add your title'}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{user.email}</span>
                  </div>
                  {user.location && (
                    <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              {/* Plan Badge + Edit Button */}
              <div className="flex flex-col items-start sm:items-end gap-3">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r ${plan.color} text-white text-sm font-medium`}>
                  <plan.icon className="w-4 h-4" />
                  {plan.label}
                </div>
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="btn-secondary py-2 px-4 text-sm flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleProfileSave}
                      disabled={saving}
                      className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
                    >
                      {saving ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="btn-secondary py-2 px-4 text-sm flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Personal Information */}
          <SectionCard title="Personal Information" icon={User} iconColor="from-primary-500 to-secondary-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="label">Full Name *</label>
                {editMode ? (
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                    className="input-field"
                    placeholder="Your full name"
                  />
                ) : (
                  <p className="text-white font-medium py-3">{user.name || '—'}</p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="label">Professional Title</label>
                {editMode ? (
                  <input
                    type="text"
                    value={profileForm.title}
                    onChange={e => setProfileForm(p => ({ ...p, title: e.target.value }))}
                    className="input-field"
                    placeholder="e.g. Full Stack Developer"
                  />
                ) : (
                  <p className="text-white font-medium py-3">{user.title || '—'}</p>
                )}
              </div>

              {/* Email (not editable) */}
              <div>
                <label className="label">Email Address</label>
                <div className="flex items-center gap-2 py-3">
                  <p className="text-white font-medium">{user.email}</p>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="label">Location</label>
                {editMode ? (
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={e => setProfileForm(p => ({ ...p, location: e.target.value }))}
                    className="input-field"
                    placeholder="City, Country"
                  />
                ) : (
                  <p className="text-white font-medium py-3">{user.location || '—'}</p>
                )}
              </div>

              {/* Bio - Full Width */}
              <div className="sm:col-span-2">
                <label className="label">Bio</label>
                {editMode ? (
                  <textarea
                    value={profileForm.bio}
                    onChange={e => setProfileForm(p => ({ ...p, bio: e.target.value }))}
                    className="input-field resize-none h-24"
                    placeholder="Tell us about yourself..."
                    maxLength={500}
                  />
                ) : (
                  <p className="text-white font-medium py-3">{user.bio || '—'}</p>
                )}
              </div>

              {/* Skills - Full Width */}
              <div className="sm:col-span-2">
                <label className="label">Skills (comma separated)</label>
                {editMode ? (
                  <input
                    type="text"
                    value={profileForm.skills}
                    onChange={e => setProfileForm(p => ({ ...p, skills: e.target.value }))}
                    className="input-field"
                    placeholder="React, Node.js, Python, MongoDB..."
                  />
                ) : (
                  <div className="flex flex-wrap gap-2 py-2">
                    {user.skills?.length > 0 ? (
                      user.skills.map((skill, i) => (
                        <span key={i} className="badge-primary">{skill}</span>
                      ))
                    ) : (
                      <p className="text-slate-400">No skills added yet</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </SectionCard>

          {/* Security Section */}
          <SectionCard title="Security" icon={Shield} iconColor="from-green-500 to-emerald-500">
            {!showPasswordForm ? (
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-white font-medium text-sm">Password</p>
                    <p className="text-slate-400 text-xs">Last changed recently</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="btn-secondary py-2 px-4 text-sm"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="label">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={e => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                      className="input-field pr-10"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="label">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                      className="input-field pr-10"
                      placeholder="Min 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="label">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={e => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                    className="input-field"
                    placeholder="Repeat new password"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handlePasswordChange}
                    disabled={passwordSaving}
                    className="btn-primary py-2 px-6 text-sm flex items-center gap-2"
                  >
                    {passwordSaving ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {passwordSaving ? 'Saving...' : 'Update Password'}
                  </button>
                  <button
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    }}
                    className="btn-secondary py-2 px-4 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </SectionCard>

          {/* Danger Zone */}
          <SectionCard title="Danger Zone" icon={AlertTriangle} iconColor="from-red-500 to-rose-500">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-white font-medium text-sm">Delete Account</p>
                  <p className="text-slate-400 text-xs mt-1">
                    Permanently delete your account and all analysis data. This cannot be undone.
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl text-sm font-medium transition-all flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </SectionCard>

        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="space-y-6">

          {/* Plan Info */}
          <div className={`glass-card p-6 relative overflow-hidden`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-5`} />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <plan.icon className="w-5 h-5 text-primary-400" />
                <h3 className="font-semibold text-white">Current Plan</h3>
              </div>
              <div className={`text-2xl font-bold gradient-text mb-1`}>{plan.label}</div>
              <p className="text-slate-400 text-sm mb-4">
                Analyses: {plan.limit}
              </p>
              <div className="space-y-2 mb-5">
                {[
                  { text: 'AI Resume Analysis',    available: true  },
                  { text: 'ATS Score Check',       available: true  },
                  { text: 'Skills Gap Analysis',   available: true  },
                  { text: 'Unlimited Analyses',    available: user.plan !== 'free' },
                  { text: 'Priority Support',      available: user.plan !== 'free' },
                  { text: 'Export Reports',        available: user.plan !== 'free' },
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {feature.available ? (
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    )}
                    <span className={feature.available ? 'text-slate-300' : 'text-slate-600'}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
              {user.plan === 'free' && (
                <a href="/pricing" className="btn-primary w-full text-center text-sm py-2.5 flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4" />
                  Upgrade to Pro
                </a>
              )}
            </div>
          </div>

          {/* Stats */}
          <SectionCard title="Your Stats" icon={BarChart2} iconColor="from-accent-500 to-blue-500">
            <div className="space-y-3">
              <StatItem
                icon={BarChart2}
                label="Total Analyses"
                value={user.totalAnalyses || 0}
                color="from-primary-500 to-secondary-500"
              />
              <StatItem
                icon={TrendingUp}
                label="Average Score"
                value={`${user.averageScore || 0}%`}
                color="from-green-500 to-emerald-500"
              />
              <StatItem
                icon={Star}
                label="This Month"
                value={`${user.analysesThisMonth || 0}/${user.plan === 'free' ? 5 : '∞'}`}
                color="from-yellow-500 to-orange-500"
              />
              <StatItem
                icon={Award}
                label="Member Since"
                value={new Date(user.createdAt).getFullYear()}
                color="from-purple-500 to-pink-500"
              />
            </div>
          </SectionCard>

        </div>
      </div>

      {/* ── Delete Account Modal ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="relative glass-card p-8 max-w-md w-full animate-fade-up">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Delete Account?</h3>
              <p className="text-slate-400 text-sm">
                This will permanently delete your account and all your resume analyses.
                This action cannot be undone.
              </p>
            </div>
            <div className="mb-6">
              <label className="label">Enter your password to confirm</label>
              <input
                type="password"
                value={deletePassword}
                onChange={e => setDeletePassword(e.target.value)}
                className="input-field"
                placeholder="Your password"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl font-medium transition-all"
              >
                {deleting ? (
                  <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                onClick={() => { setShowDeleteModal(false); setDeletePassword(''); }}
                className="flex-1 btn-secondary py-3"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;