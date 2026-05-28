// backend/controllers/authController.js
// 🔐 Authentication Controller
// Handles all auth logic: register, login, profile

const User                       = require('../models/User');
const { generateToken }          = require('../utils/generateToken');
const { asyncHandler }           = require('../middleware/authMiddleware');

// ================================
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
// ================================
const register = asyncHandler(async (req, res) => {
  // 1️⃣ Extract data from request body
  const { name, email, password } = req.body;

  // 2️⃣ Validate required fields
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  // 3️⃣ Check if email already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    res.status(400);
    throw new Error('Email already registered. Please login instead.');
  }

  // 4️⃣ Validate password strength
  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters long');
  }

  // 5️⃣ Create new user
  // Password gets hashed automatically by our pre-save middleware
  const user = await User.create({
    name:  name.trim(),
    email: email.toLowerCase().trim(),
    password,
  });

  // 6️⃣ Generate JWT token
  const token = generateToken(user._id);

  // 7️⃣ Send success response
  res.status(201).json({
    success: true,
    message: `Welcome to ResumeAI, ${user.name}! 🎉`,
    token,
    user: user.getPublicProfile(),
  });
});

// ================================
// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
// ================================
const login = asyncHandler(async (req, res) => {
  // 1️⃣ Extract credentials
  const { email, password } = req.body;

  // 2️⃣ Validate fields
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // 3️⃣ Find user by email
  // We use .select('+password') because password has select:false in schema
  const user = await User.findOne({ 
    email: email.toLowerCase() 
  }).select('+password');

  // 4️⃣ Check if user exists
  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
    // Note: We say "Invalid email or password" not "Email not found"
    // This is for security - don't tell hackers which field is wrong
  }

  // 5️⃣ Check if account is active
  if (!user.isActive) {
    res.status(401);
    throw new Error('Your account has been deactivated. Contact support.');
  }

  // 6️⃣ Compare passwords
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // 7️⃣ Generate new token
  const token = generateToken(user._id);

  // 8️⃣ Send success response
  res.status(200).json({
    success: true,
    message: `Welcome back, ${user.name}! 👋`,
    token,
    user: user.getPublicProfile(),
  });
});

// ================================
// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private (needs token)
// ================================
const getMe = asyncHandler(async (req, res) => {
  // req.user.id comes from our protect middleware
  // It decoded the JWT and extracted the user ID

  // Find user by ID from token
  const user = await User.findById(req.user.id);

  // Check if user still exists
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({
    success: true,
    user: user.getPublicProfile(),
  });
});

// ================================
// @route   PUT /api/auth/update-profile
// @desc    Update user profile
// @access  Private
// ================================
const updateProfile = asyncHandler(async (req, res) => {
  // Fields that are allowed to be updated
  const { name, title, location, bio, skills, avatar } = req.body;

  // Find user
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update only the fields that were provided
  if (name)     user.name     = name.trim();
  if (title)    user.title    = title.trim();
  if (location) user.location = location.trim();
  if (bio)      user.bio      = bio.trim();
  if (avatar)   user.avatar   = avatar;
  if (skills)   user.skills   = skills;

  // Save updated user (pre-save middleware runs again)
  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully! ✅',
    user: updatedUser.getPublicProfile(),
  });
});

// ================================
// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
// ================================
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Validate fields
  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Please provide current and new password');
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error('New password must be at least 6 characters');
  }

  // Get user with password
  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Verify current password
  const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordCorrect) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  // Check new password is different
  const isSamePassword = await user.comparePassword(newPassword);
  if (isSamePassword) {
    res.status(400);
    throw new Error('New password must be different from current password');
  }

  // Update password (pre-save middleware hashes it automatically)
  user.password = newPassword;
  await user.save();

  // Generate new token
  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Password changed successfully! 🔒',
    token, // Send new token
  });
});

// ================================
// @route   GET /api/auth/dashboard-stats
// @desc    Get user dashboard statistics
// @access  Private
// ================================
const getDashboardStats = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // We'll get actual analysis stats in Step 6
  // For now return user stats
  res.status(200).json({
    success: true,
    stats: {
      totalAnalyses:     user.totalAnalyses,
      averageScore:      user.averageScore,
      plan:              user.plan,
      analysesThisMonth: user.analysesThisMonth,
      canAnalyze:        user.canAnalyze(),
      memberSince:       user.createdAt,
    },
  });
});

// ================================
// @route   DELETE /api/auth/delete-account
// @desc    Delete user account
// @access  Private
// ================================
const deleteAccount = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    res.status(400);
    throw new Error('Please provide your password to delete account');
  }

  // Get user with password
  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Verify password before deleting
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    res.status(401);
    throw new Error('Incorrect password');
  }

  // Delete user
  await User.findByIdAndDelete(req.user.id);

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully. Sorry to see you go! 👋',
  });
});

// Export all controllers
module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  getDashboardStats,
  deleteAccount,
};