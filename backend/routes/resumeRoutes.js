// backend/routes/resumeRoutes.js
// 📄 Resume Upload Routes

const express = require('express');
const router  = express.Router();

// Import controller functions
const {
  uploadResume,
  parseResumeOnly,
  checkAnalysisLimit,
  deleteUploadedFile,
} = require('../controllers/resumeController');

// Import middleware
const { protect }        = require('../middleware/authMiddleware');
const { upload }         = require('../config/upload');

// ================================
// MULTER ERROR HANDLER
// Catches multer-specific errors
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
      message: 'Too many files! Upload one file at a time.',
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
// ROUTES
// ================================

// POST /api/resume/upload
// Upload PDF + extract text (main endpoint)
router.post(
  '/upload',
  protect,                        // Must be logged in
  upload.single('resume'),        // Handle single file with field name 'resume'
  handleMulterError,              // Handle multer errors
  uploadResume                    // Process the upload
);

// POST /api/resume/parse-only
// Just parse PDF text without saving
router.post(
  '/parse-only',
  protect,
  upload.single('resume'),
  handleMulterError,
  parseResumeOnly
);

// GET /api/resume/check-limit
// Check remaining analyses
router.get('/check-limit', protect, checkAnalysisLimit);

// DELETE /api/resume/delete-file
// Delete uploaded file
router.delete('/delete-file', protect, deleteUploadedFile);

// Test route
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: '✅ Resume routes working!',
    availableRoutes: [
      'POST   /api/resume/upload        (protected)',
      'POST   /api/resume/parse-only    (protected)',
      'GET    /api/resume/check-limit   (protected)',
      'DELETE /api/resume/delete-file   (protected)',
    ],
  });
});

module.exports = router;