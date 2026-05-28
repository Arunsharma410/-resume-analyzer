// backend/controllers/resumeController.js
// 📄 Resume Upload and Processing Controller

const path     = require('path');
const fs       = require('fs');
const Analysis = require('../models/Analysis');
const User     = require('../models/User');
const { asyncHandler }                           = require('../middleware/authMiddleware');
const { deleteFile, getFileSizeInMB }            = require('../config/upload');
const { extractTextFromPDF, extractContactInfo, extractResumeSections } = require('../utils/pdfParser');

// ================================
// @route   POST /api/resume/upload
// @desc    Upload PDF and extract text
// @access  Private
// ================================
const uploadResume = asyncHandler(async (req, res) => {
  const startTime = Date.now();

  // 1️⃣ Check if file was uploaded
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a PDF file');
  }

  const filePath = req.file.path;

  try {
    // 2️⃣ Check user analysis limit
    const user      = await User.findById(req.user._id);
    const canAnalyze = user.canAnalyze();

    if (!canAnalyze.allowed) {
      // Delete uploaded file since we won't process it
      deleteFile(filePath);
      res.status(403);
      throw new Error(
        `Monthly analysis limit reached (${user.plan} plan: 5/month). ` +
        `Upgrade to Pro for unlimited analyses.`
      );
    }

    // 3️⃣ Extract text from PDF
    console.log(`📄 Processing PDF: ${req.file.originalname}`);
    const extracted = await extractTextFromPDF(filePath);

    // 4️⃣ Extract contact info from text
    const contactInfo = extractContactInfo(extracted.text);

    // 5️⃣ Extract resume sections
    const sections = extractResumeSections(extracted.text);

    // 6️⃣ Calculate processing time
    const processingTime = Date.now() - startTime;

    // 7️⃣ Send success response
    res.status(200).json({
      success: true,
      message: '✅ Resume uploaded and parsed successfully!',
      data: {
        // File info
        file: {
          originalName: req.file.originalname,
          savedName:    req.file.filename,
          size:         req.file.size,
          sizeInMB:     getFileSizeInMB(req.file.size),
          path:         req.file.path,
          pages:        extracted.pages,
          wordCount:    extracted.wordCount,
          charCount:    extracted.charCount,
        },
        // Extracted content
        extractedText: extracted.text,
        contactInfo,
        sections: {
          hasSummary:        !!sections.summary,
          hasExperience:     !!sections.experience,
          hasEducation:      !!sections.education,
          hasSkills:         !!sections.skills,
          hasProjects:       !!sections.projects,
          hasCertifications: !!sections.certifications,
        },
        // Processing info
        processingTime: `${processingTime}ms`,
      },
    });

  } catch (error) {
    // Clean up file if something went wrong
    deleteFile(filePath);
    throw error;
  }
});

// ================================
// @route   POST /api/resume/parse-only
// @desc    Just parse PDF text (no analysis saved)
// @access  Private
// ================================
const parseResumeOnly = asyncHandler(async (req, res) => {
  // Check if file uploaded
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a PDF file');
  }

  const filePath = req.file.path;

  try {
    // Extract text
    const extracted = await extractTextFromPDF(filePath);

    // Get contact info
    const contactInfo = extractContactInfo(extracted.text);

    // Clean up file after parsing
    deleteFile(filePath);

    res.status(200).json({
      success:       true,
      text:          extracted.text,
      pages:         extracted.pages,
      wordCount:     extracted.wordCount,
      contactInfo,
    });

  } catch (error) {
    deleteFile(filePath);
    throw error;
  }
});

// ================================
// @route   GET /api/resume/check-limit
// @desc    Check user's remaining analyses
// @access  Private
// ================================
const checkAnalysisLimit = asyncHandler(async (req, res) => {
  const user       = await User.findById(req.user._id);
  const canAnalyze = user.canAnalyze();

  res.status(200).json({
    success: true,
    data: {
      plan:              user.plan,
      analysesThisMonth: user.analysesThisMonth,
      canAnalyze,
    },
  });
});

// ================================
// @route   DELETE /api/resume/delete-file
// @desc    Delete an uploaded file
// @access  Private
// ================================
const deleteUploadedFile = asyncHandler(async (req, res) => {
  const { filename } = req.body;

  if (!filename) {
    res.status(400);
    throw new Error('Please provide filename to delete');
  }

  // Security: Make sure filename doesn't try to escape uploads folder
  // This prevents path traversal attacks like "../../etc/passwd"
  const safeFilename = path.basename(filename);
  const filePath     = path.join(__dirname, '..', 'uploads', safeFilename);

  // Check file belongs to this user (filename starts with userId)
  if (!safeFilename.startsWith(req.user._id.toString())) {
    res.status(403);
    throw new Error('Not authorized to delete this file');
  }

  deleteFile(filePath);

  res.status(200).json({
    success: true,
    message: 'File deleted successfully',
  });
});

module.exports = {
  uploadResume,
  parseResumeOnly,
  checkAnalysisLimit,
  deleteUploadedFile,
};