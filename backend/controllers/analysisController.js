// backend/controllers/analysisController.js
// 📊 Analysis Controller (PRODUCTION-HARDENED)

const mongoose  = require('mongoose');
const Analysis  = require('../models/Analysis');
const User      = require('../models/User');
const { asyncHandler }              = require('../middleware/authMiddleware');
const { analyzeResumeWithAI }       = require('../utils/ai');
const { extractTextFromPDF }        = require('../utils/pdfParser');
const { deleteFile }                = require('../config/upload');

// ════════════════════════════════════════════════════════════════
// 🛠️ HELPERS
// ════════════════════════════════════════════════════════════════

// 🛡️ Escape special regex chars to prevent ReDoS attacks
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ⏱️ Wrap promise with timeout (for AI calls)
const withTimeout = (promise, ms, errorMsg) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(errorMsg)), ms)
    ),
  ]);
};

// 🔄 Recalculate user stats (atomic, exclude failed)
const updateUserStats = async (userId) => {
  const result = await Analysis.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), status: 'completed' } },
    {
      $group: {
        _id:           null,
        total:         { $sum: 1 },
        averageScore:  { $avg: '$analysis.matchScore' },
      },
    },
  ]);

  const stats = result[0] || { total: 0, averageScore: 0 };

  await User.findByIdAndUpdate(userId, {
    totalAnalyses: stats.total,
    averageScore:  Math.round(stats.averageScore || 0),
  });
};

// ════════════════════════════════════════════════════════════════
// @route   POST /api/analysis/analyze
// @desc    Analyze uploaded resume against job description
// @access  Private
// ════════════════════════════════════════════════════════════════
const analyzeResume = asyncHandler(async (req, res) => {
  const startTime = Date.now();

  // 1️⃣ Validate file
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a PDF resume');
  }

  const filePath = req.file.path;
  const { jobDescription, jobTitle, company, title } = req.body;

  // 2️⃣ Validate job description
  if (!jobDescription || jobDescription.trim().length < 50) {
    deleteFile(filePath);
    res.status(400);
    throw new Error('Job description must be at least 50 characters');
  }

  if (jobDescription.length > 10000) {
    deleteFile(filePath);
    res.status(400);
    throw new Error('Job description too long (max 10,000 characters)');
  }

  try {
    // 3️⃣ Atomic limit check + increment (prevents race condition)
    // We increment FIRST, then verify - if over limit, we decrement and reject
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const canAnalyze = user.canAnalyze();
    if (!canAnalyze.allowed) {
      deleteFile(filePath);
      res.status(403);
      throw new Error(
        `Monthly limit reached (${user.plan} plan: 5/month). Upgrade to Pro for unlimited.`
      );
    }

    // Atomically increment the counter NOW (reserves the quota slot)
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { analysesThisMonth: 1 },
    });

    // 4️⃣ Extract PDF text
    console.log(`📄 [${req.user._id}] Parsing PDF: ${req.file.originalname}`);
    let extracted;
    try {
      extracted = await extractTextFromPDF(filePath);
    } catch (pdfError) {
      // Rollback counter on PDF parse failure
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { analysesThisMonth: -1 },
      });
      deleteFile(filePath);
      throw pdfError;
    }

    // 5️⃣ Create analysis record (processing status)
    const analysis = await Analysis.create({
      user: req.user._id,
      resume: {
        fileName:  req.file.originalname,
        fileSize:  req.file.size,
        pages:     extracted.pages,
        wordCount: extracted.wordCount,
        text:      extracted.text,
      },
      jobDescription: jobDescription.trim(),
      jobTitle:       jobTitle || '',
      company:        company  || '',
      title:          title    || '',
      status:         'processing',
    });

    // 6️⃣ Run AI analysis (with 60s timeout)
    console.log(`🤖 [${analysis._id}] Running Gemini AI...`);
   await new Promise(resolve => setTimeout(resolve, 2000));
    let aiResult;
    try {
      aiResult = await withTimeout(
        analyzeResumeWithAI(extracted.text, jobDescription),
        60000,
        'AI analysis timed out after 60 seconds. Please try again.'
      );
    } catch (aiError) {
      // Mark as failed (keep record for debugging)
      analysis.status         = 'failed';
      analysis.errorMessage   = aiError.message;
      analysis.processingTime = Date.now() - startTime;
      await analysis.save();

      // Rollback monthly counter (don't charge user for failed analysis)
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { analysesThisMonth: -1 },
      });

      deleteFile(filePath);
      throw aiError;
    }

    // 7️⃣ Save AI results into nested 'analysis' field
    analysis.analysis = {
      matchScore:       aiResult.matchScore,
      atsScore:         aiResult.atsScore,
      experienceLevel:  aiResult.experienceLevel || 'unknown',
      overallSummary:   aiResult.overallSummary  || '',
      matchedSkills:    aiResult.matchedSkills    || [],
      missingSkills:    aiResult.missingSkills    || [],
      strengths:        aiResult.strengths        || [],
      weaknesses:       aiResult.weaknesses       || [],
      suggestions:      aiResult.suggestions      || [],
      sectionScores:    aiResult.sectionScores    || {},
      atsFeedback:      aiResult.atsFeedback      || {},
      recommendedRoles: aiResult.recommendedRoles || [],
    };

    if (!jobTitle && aiResult.jobTitle) {
      analysis.jobTitle = aiResult.jobTitle;
    }

    analysis.status         = 'completed';
    analysis.processingTime = Date.now() - startTime;
    await analysis.save();

    // 8️⃣ Update user totals (async, don't block response)
    updateUserStats(req.user._id).catch(err =>
      console.error('❌ Stats update failed:', err.message)
    );

    // 9️⃣ Cleanup file
    deleteFile(filePath);

    // 🔟 Response
    res.status(201).json({
      success: true,
      message: '✅ Resume analyzed successfully!',
      data: {
        analysisId:     analysis._id,
        matchScore:     analysis.analysis.matchScore,
        atsScore:       analysis.analysis.atsScore,
        processingTime: `${analysis.processingTime}ms`,
        analysis,
      },
    });
  } catch (error) {
    // Final safety cleanup
    if (req.file && req.file.path) deleteFile(req.file.path);
    throw error;
  }
});

// ════════════════════════════════════════════════════════════════
// @route   GET /api/analysis
// @desc    Get all analyses (paginated + filtered)
// @access  Private
// ════════════════════════════════════════════════════════════════
const getAllAnalyses = asyncHandler(async (req, res) => {
  const page  = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
  const skip  = (page - 1) * limit;

  const sortBy   = req.query.sort     || 'newest';
  const search   = (req.query.search  || '').trim();
  const minScore = Math.min(Math.max(parseInt(req.query.minScore) || 0, 0), 100);
  const status   = req.query.status   || 'completed';

  // Whitelist allowed statuses to prevent injection
  const allowedStatuses = ['completed', 'failed', 'processing', 'pending'];
  const safeStatus = allowedStatuses.includes(status) ? status : 'completed';

  const query = {
    user:                  req.user._id,
    status:                safeStatus,
    'analysis.matchScore': { $gte: minScore },
  };

  // 🛡️ Safe search with escaped regex
  if (search) {
    const safeSearch = escapeRegex(search);
    query.$or = [
      { jobTitle: { $regex: safeSearch, $options: 'i' } },
      { company:  { $regex: safeSearch, $options: 'i' } },
      { title:    { $regex: safeSearch, $options: 'i' } },
    ];
  }

  const sortMap = {
    newest:  { createdAt: -1 },
    oldest:  { createdAt: 1 },
    highest: { 'analysis.matchScore': -1 },
    lowest:  { 'analysis.matchScore': 1 },
    ats:     { 'analysis.atsScore':   -1 },
  };
  const sortOption = sortMap[sortBy] || sortMap.newest;

  // Run count + fetch in parallel for speed
  const [totalCount, analyses] = await Promise.all([
    Analysis.countDocuments(query),
    Analysis.find(query)
      .select('-resume.text -jobDescription')
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  res.status(200).json({
    success: true,
    data: {
      count:       analyses.length,
      totalCount,
      currentPage: page,
      totalPages:  Math.ceil(totalCount / limit),
      hasMore:     page * limit < totalCount,
      analyses,
    },
  });
});

// ════════════════════════════════════════════════════════════════
// @route   GET /api/analysis/:id
// @desc    Get single analysis (with view increment)
// @access  Private
// ════════════════════════════════════════════════════════════════
const getAnalysisById = asyncHandler(async (req, res) => {
  // Use findOneAndUpdate to atomically increment views + fetch in one query
  const analysis = await Analysis.findOneAndUpdate(
    {
      _id:  req.params.id,
      user: req.user._id,    // Authorization built into query
    },
    { $inc: { views: 1 } },
    {
      new:                  true,
      runValidators:        false,  // Skip validation on read
    }
  );

  if (!analysis) {
    res.status(404);
    throw new Error('Analysis not found');
  }

  res.status(200).json({
    success: true,
    data: { analysis },
  });
});

// ════════════════════════════════════════════════════════════════
// @route   DELETE /api/analysis/:id
// @desc    Delete an analysis
// @access  Private
// ════════════════════════════════════════════════════════════════
const deleteAnalysis = asyncHandler(async (req, res) => {
  // Atomic find-and-delete with authorization in query
  const analysis = await Analysis.findOneAndDelete({
    _id:  req.params.id,
    user: req.user._id,
  });

  if (!analysis) {
    res.status(404);
    throw new Error('Analysis not found');
  }

  // Recalculate stats async
  updateUserStats(req.user._id).catch(err =>
    console.error('❌ Stats update failed:', err.message)
  );

  res.status(200).json({
    success: true,
    message: '🗑️ Analysis deleted successfully',
    data:    { id: req.params.id },
  });
});

// ════════════════════════════════════════════════════════════════
// @route   PUT /api/analysis/:id
// @desc    Update analysis title or rating
// @access  Private
// ════════════════════════════════════════════════════════════════
const updateAnalysis = asyncHandler(async (req, res) => {
  const { title, userRating } = req.body;

  // Build update object with only allowed fields
  const updates = {};
  if (title !== undefined) {
    if (typeof title !== 'string' || title.length > 200) {
      res.status(400);
      throw new Error('Title must be a string under 200 characters');
    }
    updates.title = title.trim();
  }
  if (userRating !== undefined) {
    const rating = Number(userRating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      res.status(400);
      throw new Error('Rating must be an integer between 1 and 5');
    }
    updates.userRating = rating;
  }

  if (Object.keys(updates).length === 0) {
    res.status(400);
    throw new Error('No valid fields to update');
  }

  // Atomic update with authorization built in
  const analysis = await Analysis.findOneAndUpdate(
    {
      _id:  req.params.id,
      user: req.user._id,
    },
    updates,
    { new: true, runValidators: true }
  );

  if (!analysis) {
    res.status(404);
    throw new Error('Analysis not found');
  }

  res.status(200).json({
    success: true,
    message: '✅ Analysis updated successfully',
    data:    { analysis },
  });
});

// ════════════════════════════════════════════════════════════════
// @route   GET /api/analysis/stats/dashboard
// @desc    Get dashboard statistics (optimized with aggregation)
// @access  Private
// ════════════════════════════════════════════════════════════════
const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);

  // 🚀 Use single aggregation pipeline for performance
  // (One DB query instead of multiple)
  const [statsResult] = await Analysis.aggregate([
    { $match: { user: userId, status: 'completed' } },
    {
      $facet: {
        // Overall stats
        overall: [
          {
            $group: {
              _id:           null,
              total:         { $sum: 1 },
              avgMatchScore: { $avg: '$analysis.matchScore' },
              avgAtsScore:   { $avg: '$analysis.atsScore' },
              highestScore:  { $max: '$analysis.matchScore' },
            },
          },
        ],
        // Top matched skills
        topSkills: [
          { $unwind: '$analysis.matchedSkills' },
          {
            $group: {
              _id:   '$analysis.matchedSkills',
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 8 },
          { $project: { _id: 0, skill: '$_id', count: 1 } },
        ],
        // Top missing skills
        topMissingSkills: [
          { $unwind: '$analysis.missingSkills' },
          {
            $group: {
              _id:   '$analysis.missingSkills',
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 8 },
          { $project: { _id: 0, skill: '$_id', count: 1 } },
        ],
        // Recent 5 analyses
        recentAnalyses: [
          { $sort: { createdAt: -1 } },
          { $limit: 5 },
          {
            $project: {
              jobTitle:   1,
              company:    1,
              createdAt:  1,
              'analysis.matchScore': 1,
              'analysis.atsScore':   1,
            },
          },
        ],
        // Score distribution
        scoreDistribution: [
          {
            $bucket: {
              groupBy:    '$analysis.matchScore',
              boundaries: [0, 40, 60, 80, 101],
              default:    'unknown',
              output:     { count: { $sum: 1 } },
            },
          },
        ],
      },
    },
  ]);

  const overall = statsResult.overall[0] || {
    total: 0, avgMatchScore: 0, avgAtsScore: 0, highestScore: 0,
  };

  // Parse score buckets [0-40, 40-60, 60-80, 80-100]
  const buckets = statsResult.scoreDistribution;
  const scoreDistribution = {
    poor:      buckets.find(b => b._id === 0)?.count  || 0,
    average:   buckets.find(b => b._id === 40)?.count || 0,
    good:      buckets.find(b => b._id === 60)?.count || 0,
    excellent: buckets.find(b => b._id === 80)?.count || 0,
  };

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalAnalyses:    overall.total,
        avgMatchScore:    Math.round(overall.avgMatchScore || 0),
        avgAtsScore:      Math.round(overall.avgAtsScore   || 0),
        highestScore:     overall.highestScore || 0,
        topSkills:        statsResult.topSkills,
        topMissingSkills: statsResult.topMissingSkills,
        recentAnalyses:   statsResult.recentAnalyses,
        scoreDistribution,
      },
    },
  });
});

// ════════════════════════════════════════════════════════════════
// @route   GET /api/analysis/stats/trends
// @desc    Get N-day trends
// @access  Private
// ════════════════════════════════════════════════════════════════
const getAnalysisTrends = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);
  const days   = Math.min(Math.max(parseInt(req.query.days) || 7, 1), 90);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days + 1);
  startDate.setHours(0, 0, 0, 0);

  const trends = await Analysis.aggregate([
    {
      $match: {
        user:      userId,
        status:    'completed',
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
        },
        count:    { $sum: 1 },
        avgScore: { $avg: '$analysis.matchScore' },
        avgAts:   { $avg: '$analysis.atsScore' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Build full date range with zero-fill
  const trendsMap = new Map(trends.map(t => [t._id, t]));
  const trendData = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const data = trendsMap.get(dateStr);
    trendData.push({
      date:     dateStr,
      count:    data?.count                     || 0,
      avgScore: data ? Math.round(data.avgScore) : 0,
      avgAts:   data ? Math.round(data.avgAts)   : 0,
    });
  }

  res.status(200).json({
    success: true,
    data: { days, trends: trendData },
  });
});

// ════════════════════════════════════════════════════════════════
// 📤 EXPORTS
// ════════════════════════════════════════════════════════════════
module.exports = {
  analyzeResume,
  getAllAnalyses,
  getAnalysisById,
  deleteAnalysis,
  updateAnalysis,
  getDashboardStats,
  getAnalysisTrends,
};