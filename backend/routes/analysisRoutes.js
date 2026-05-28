// backend/routes/analysisRoutes.js
// 📊 Analysis Routes
// Routes for AI analysis + history + dashboard stats

const express = require('express');
const router  = express.Router();

// Import controller functions
const {
  analyzeResume,
  getAllAnalyses,
  getAnalysisById,
  deleteAnalysis,
  updateAnalysis,
  getDashboardStats,
  getAnalysisTrends,
} = require('../controllers/analysisController');

// Import middleware & multer config
const { protect } = require('../middleware/authMiddleware');
const { upload }  = require('../config/upload');

// ================================
// MULTER ERROR HANDLER
// ================================
const handleMulterError = (err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large! Maximum size is 5MB.',
    });
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      message: 'Too many files! Upload one at a time.',
    });
  }
  if (err.message && err.message.includes('Only PDF')) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  next(err);
};

// ================================
// 📊 DASHBOARD STATS ROUTES
// ⚠️ MUST come BEFORE /:id routes!
// (Otherwise Express thinks "stats" is an ID)
// ================================
router.get('/stats/dashboard', protect, getDashboardStats);
router.get('/stats/trends',    protect, getAnalysisTrends);

// ================================
// 🤖 ANALYZE NEW RESUME
// POST /api/analysis/analyze
// Body: multipart/form-data
//   - resume: PDF file
//   - jobDescription: string (required)
//   - jobTitle: string (optional)
//   - company: string (optional)
//   - title: string (optional)
// ================================
router.post(
  '/analyze',
  protect,                      // Must be logged in
  upload.single('resume'),      // Handle file upload
  handleMulterError,            // Handle multer errors
  analyzeResume                 // Run AI analysis
);

// ================================
// 📋 GET ALL ANALYSES (paginated)
// GET /api/analysis?page=1&limit=10&sort=newest&search=react&minScore=70
// ================================
router.get('/', protect, getAllAnalyses);

// ================================
// 🔍 SINGLE ANALYSIS ROUTES
// ================================
router.get('/:id',    protect, getAnalysisById);
router.put('/:id',    protect, updateAnalysis);
router.delete('/:id', protect, deleteAnalysis);

// ================================
// 🧪 TEST ROUTE
// ================================
router.get('/test/ping', (req, res) => {
  res.json({
    success: true,
    message: '✅ Analysis routes working!',
    availableRoutes: [
      'POST   /api/analysis/analyze              (protected) - Run AI analysis',
      'GET    /api/analysis                      (protected) - Get all analyses',
      'GET    /api/analysis/:id                  (protected) - Get one analysis',
      'PUT    /api/analysis/:id                  (protected) - Update title/rating',
      'DELETE /api/analysis/:id                  (protected) - Delete analysis',
      'GET    /api/analysis/stats/dashboard      (protected) - Dashboard stats',
      'GET    /api/analysis/stats/trends?days=7  (protected) - Trend chart data',
    ],
  });
});

module.exports = router;