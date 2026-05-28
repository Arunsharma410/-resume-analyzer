// backend/middleware/authMiddleware.js
// 🛡️ Complete Auth Middleware
// Protects routes that require authentication

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ================================
// ASYNC HANDLER WRAPPER
// Eliminates try-catch in every controller
// ================================
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ================================
// PROTECT MIDDLEWARE
// Verifies JWT token and adds user to request
// ================================
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1️⃣ Check Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    // Extract token from "Bearer <token>"
    token = req.headers.authorization.split(' ')[1];
  }

  // 2️⃣ No token provided
  if (!token) {
    res.status(401);
    throw new Error('Access denied. Please login to continue.');
  }

  // 3️⃣ Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    res.status(401);
    if (error.name === 'TokenExpiredError') {
      throw new Error('Session expired. Please login again.');
    }
    throw new Error('Invalid token. Please login again.');
  }

  // 4️⃣ Check if user still exists in database
  const user = await User.findById(decoded.id);
  if (!user) {
    res.status(401);
    throw new Error('User no longer exists.');
  }

  // 5️⃣ Check if user account is active
  if (!user.isActive) {
    res.status(401);
    throw new Error('Your account has been deactivated.');
  }

  // 6️⃣ Attach user to request object
  // Now all controllers can access req.user
  req.user = user;

  next();
});

// ================================
// ADMIN MIDDLEWARE
// Only allows admin users
// ================================
const adminOnly = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Access denied. Admin only.');
  }
});

module.exports = { protect, adminOnly, asyncHandler };