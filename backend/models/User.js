// backend/models/User.js
// 👤 User Database Model

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

// ================================
// USER SCHEMA DEFINITION
// ================================
const userSchema = new mongoose.Schema(
  {
    // 👤 Basic Info
    name: {
      type:      String,
      required:  [true, 'Please provide your name'],
      trim:      true,
      minlength: [2,  'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },

    email: {
      type:      String,
      required:  [true, 'Please provide your email'],
      unique:    true,
      lowercase: true,
      trim:      true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },

    password: {
      type:      String,
      required:  [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select:    false,
    },

    // 🖼️ Profile Info
    avatar: {
      type:    String,
      default: '',
    },

    // 💼 Professional Info
    title: {
      type:      String,
      default:   '',
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },

    location: {
      type:    String,
      default: '',
    },

    bio: {
      type:      String,
      default:   '',
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },

    skills: {
      type:    [String],
      default: [],
    },

    // 📊 Stats
    totalAnalyses: {
      type:    Number,
      default: 0,
    },

    averageScore: {
      type:    Number,
      default: 0,
    },

    // 🔐 Account Settings
    role: {
      type:    String,
      enum:    ['user', 'admin'],
      default: 'user',
    },

    plan: {
      type:    String,
      enum:    ['free', 'pro', 'enterprise'],
      default: 'free',
    },

    analysesThisMonth: {
      type:    Number,
      default: 0,
    },

    lastAnalysisReset: {
      type:    Date,
      default: Date.now,
    },

    isActive: {
      type:    Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ================================
// PRE-SAVE MIDDLEWARE
// ✅ No next() - works with all Mongoose versions
// ================================
userSchema.pre('save', async function () {
  // ---- Hash password if it was modified ----
  if (this.isModified('password')) {
    const salt    = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // ---- Reset monthly count if it's a new month ----
  const now       = new Date();
  const lastReset = new Date(this.lastAnalysisReset);

  if (
    now.getMonth()    !== lastReset.getMonth() ||
    now.getFullYear() !== lastReset.getFullYear()
  ) {
    this.analysesThisMonth = 0;
    this.lastAnalysisReset = now;
  }

  // ✅ No next() needed in async hooks
  // Mongoose awaits the promise automatically
});

// ================================
// INSTANCE METHODS
// ================================

// 🔍 Compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 📊 Check if user can do more analyses
userSchema.methods.canAnalyze = function () {
  if (this.plan === 'pro' || this.plan === 'enterprise') {
    return { allowed: true, remaining: 'Unlimited' };
  }

  const limit     = 5;
  const remaining = limit - this.analysesThisMonth;

  return {
    allowed:   remaining > 0,
    remaining: remaining,
    limit:     limit,
  };
};

// 📝 Get safe public profile (no password)
userSchema.methods.getPublicProfile = function () {
  return {
    id:                this._id,
    name:              this.name,
    email:             this.email,
    avatar:            this.avatar,
    title:             this.title,
    location:          this.location,
    bio:               this.bio,
    skills:            this.skills,
    totalAnalyses:     this.totalAnalyses,
    averageScore:      this.averageScore,
    plan:              this.plan,
    role:              this.role,
    createdAt:         this.createdAt,
    analysesThisMonth: this.analysesThisMonth,
    canAnalyze:        this.canAnalyze(),
  };
};

// ================================
// EXPORT MODEL
// ================================
const User = mongoose.model('User', userSchema);

module.exports = User;