// backend/routes/authRoutes.js
// 🔐 Complete Authentication Routes

const express = require('express');
const router  = express.Router();

// Import controllers
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  getDashboardStats,
  deleteAccount,
} = require('../controllers/authController');

// Import middleware
const { protect } = require('../middleware/authMiddleware');

// ================================
// PUBLIC ROUTES (No token needed)
// ================================

// POST /api/auth/register - Create new account
router.post('/register', register);

// POST /api/auth/login - Login to account
router.post('/login', login);

// ================================
// PRIVATE ROUTES (Token required)
// ================================

// GET /api/auth/me - Get my profile
router.get('/me', protect, getMe);

// PUT /api/auth/update-profile - Update profile info
router.put('/update-profile', protect, updateProfile);

// PUT /api/auth/change-password - Change password
router.put('/change-password', protect, changePassword);

// GET /api/auth/dashboard-stats - Get my stats
router.get('/dashboard-stats', protect, getDashboardStats);

// DELETE /api/auth/delete-account - Delete account
router.delete('/delete-account', protect, deleteAccount);

// ================================
// TEST ROUTE
// ================================
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: '✅ Auth routes working!',
    availableRoutes: [
      'POST   /api/auth/register',
      'POST   /api/auth/login',
      'GET    /api/auth/me           (protected)',
      'PUT    /api/auth/update-profile (protected)',
      'PUT    /api/auth/change-password (protected)',
      'GET    /api/auth/dashboard-stats (protected)',
      'DELETE /api/auth/delete-account  (protected)',
    ],
  });
});

module.exports = router;