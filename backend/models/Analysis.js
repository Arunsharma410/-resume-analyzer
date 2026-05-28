// backend/models/Analysis.js
// 📊 Analysis Database Model
// Stores AI analysis results for each resume

const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema(
  {
    // 👤 Which user this belongs to
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      index:    true, // Index for faster queries
    },

    // 📄 Resume Information
    resume: {
      fileName:  { type: String, required: true },
      fileSize:  { type: Number },              // in bytes
      pages:     { type: Number, default: 1 },
      wordCount: { type: Number, default: 0 },
      text:      { type: String, required: true }, // extracted text
    },

    // 💼 Job Description
    jobDescription: {
      type:     String,
      required: true,
    },

    jobTitle: {
      type:    String,
      default: '',
    },

    company: {
      type:    String,
      default: '',
    },

    // 🤖 AI Analysis Results
    analysis: {
      // Overall match score 0-100
      matchScore: {
        type: Number,
        min:  0,
        max:  100,
      },

      // ATS compatibility score 0-100
      atsScore: {
        type: Number,
        min:  0,
        max:  100,
      },

      // Skills that match job description
      matchedSkills: {
        type:    [String],
        default: [],
      },

      // Skills missing from resume but in job description
      missingSkills: {
        type:    [String],
        default: [],
      },

      // Strong points of the resume
      strengths: {
        type:    [String],
        default: [],
      },

      // Weak points to improve
      weaknesses: {
        type:    [String],
        default: [],
      },

      // Specific suggestions to improve
      suggestions: {
        type:    [String],
        default: [],
      },

      // Section by section scores
      sectionScores: {
        contact:        { type: Number, default: 0 },
        summary:        { type: Number, default: 0 },
        experience:     { type: Number, default: 0 },
        education:      { type: Number, default: 0 },
        skills:         { type: Number, default: 0 },
        projects:       { type: Number, default: 0 },
        certifications: { type: Number, default: 0 },
        formatting:     { type: Number, default: 0 },
      },

      // ATS specific feedback
      atsFeedback: {
        hasContactInfo:      { type: Boolean, default: false },
        hasWorkExperience:   { type: Boolean, default: false },
        hasEducation:        { type: Boolean, default: false },
        hasSkills:           { type: Boolean, default: false },
        hasSummary:          { type: Boolean, default: false },
        properFormatting:    { type: Boolean, default: false },
        keywordDensity:      { type: Number,  default: 0 },
        readabilityScore:    { type: Number,  default: 0 },
      },

      // Recommended job roles based on resume
      recommendedRoles: {
        type:    [String],
        default: [],
      },

      // Overall summary from AI
      overallSummary: {
        type:    String,
        default: '',
      },

      // Experience level detected
      experienceLevel: {
        type:    String,
        enum:    ['entry', 'junior', 'mid', 'senior', 'lead', 'unknown'],
        default: 'unknown',
      },
    },

    // 📌 Status of analysis
    status: {
      type:    String,
      enum:    ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },

    errorMessage: {
      type:    String,
      default: '',
    },

    // ⏱️ Processing time in milliseconds
    processingTime: {
      type:    Number,
      default: 0,
    },

    // 🔖 User can add title to analysis
    title: {
      type:    String,
      default: '',
    },

    // ⭐ User rating of analysis
    userRating: {
      type: Number,
      min:  1,
      max:  5,
    },

    // 👁️ View count
    views: {
      type:    Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ================================
// INDEXES for faster queries
// ================================
analysisSchema.index({ user: 1, createdAt: -1 });
analysisSchema.index({ status: 1 });

// ================================
// VIRTUAL: Short summary for lists
// ================================
analysisSchema.virtual('shortSummary').get(function () {
  return {
    id:         this._id,
    title:      this.title || this.resume.fileName,
    matchScore: this.analysis.matchScore,
    atsScore:   this.analysis.atsScore,
    status:     this.status,
    createdAt:  this.createdAt,
    jobTitle:   this.jobTitle,
  };
});

// ================================
// EXPORT MODEL
// ================================
const Analysis = mongoose.model('Analysis', analysisSchema);

module.exports = Analysis;