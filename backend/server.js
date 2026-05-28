// backend/server.js
// 🚀 Main Express Server
// This is the entry point of our backend application

// ================================
// 1. IMPORTS
// ================================
const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const dotenv     = require('dotenv');
const path       = require('path');
const rateLimit  = require('express-rate-limit');

// Import our custom files
const connectDB                    = require('./config/db');
const { notFound, errorHandler }   = require('./middleware/errorMiddleware');
const authRoutes                   = require('./routes/authRoutes');
const resumeRoutes                 = require('./routes/resumeRoutes');
const analysisRoutes               = require('./routes/analysisRoutes');

// ================================
// 2. LOAD ENVIRONMENT VARIABLES
// ================================
// Must be done before using process.env anywhere
dotenv.config();

// ================================
// 3. CONNECT TO DATABASE
// ================================
connectDB();

// ================================
// 4. CREATE EXPRESS APP
// ================================
const app = express();

// ================================
// 5. SECURITY MIDDLEWARE
// ================================

// 🪖 Helmet - Sets security HTTP headers
// Protects from common web vulnerabilities
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// 🌐 CORS - Cross Origin Resource Sharing
// Allows our frontend to talk to backend
// backend/server.js
// 🌐 CORS - Update to allow production frontend
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5174',
      process.env.FRONTEND_URL,  // ← Production URL (we set in Render)
    ].filter(Boolean); // Remove undefined values

    // Allow requests with no origin (mobile apps, Postman)
    if (!origin) return callback(null, true);

    // Allow all Vercel preview deployments (*.vercel.app)
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`❌ CORS blocked: ${origin}`);
      callback(new Error('CORS policy violation'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// ⏱️ Rate Limiting - Prevent API abuse
// Limits each IP to 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                    // Max 100 requests per window
  message: {
    success: false,
    message: '⚠️ Too many requests from this IP. Please wait 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Stricter rate limit for auth routes (prevent brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 20,                     // Only 20 auth requests per window
  message: {
    success: false,
    message: '⚠️ Too many login attempts. Please wait 15 minutes.',
  },
});
app.use('/api/auth/', authLimiter);

// ================================
// 6. STANDARD MIDDLEWARE
// ================================

// 📊 Morgan - HTTP request logger
// Shows all incoming requests in terminal
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  // dev format: GET /api/auth/login 200 5.123 ms - 125
}

// 📦 Body Parser - Parse JSON request bodies
app.use(express.json({ 
  limit: '10mb'  // Allow up to 10mb JSON bodies
}));

// 📦 URL Encoded Parser - Parse form data
app.use(express.urlencoded({ 
  extended: true,
  limit: '10mb'
}));

// 📁 Serve uploaded files statically
// Files in /uploads folder are accessible at /uploads/filename
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ================================
// 7. ROUTES
// ================================

// 🏥 Health Check Route - Check if server is alive
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Resume Analyzer API is Running!',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    endpoints: {
      auth:     '/api/auth',
      resume:   '/api/resume',
      analysis: '/api/analysis',
      health:   '/api/health',
    }
  });
});

// 🏥 Detailed Health Check
app.get('/api/health', (req, res) => {
  // Check MongoDB connection status
  const dbStatus = mongoose.connection.readyState;
  const dbStatusMap = {
    0: '🔴 Disconnected',
    1: '🟢 Connected',
    2: '🟡 Connecting',
    3: '🟡 Disconnecting',
  };

  res.json({
    success: true,
    status: 'healthy',
    server: '🟢 Running',
    database: dbStatusMap[dbStatus] || '⚪ Unknown',
    environment: process.env.NODE_ENV,
    uptime: `${Math.floor(process.uptime())} seconds`,
    memory: {
      used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
      total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`,
    },
    timestamp: new Date().toISOString(),
  });
});

// 📌 API Routes
app.use('/api/auth',     authRoutes);     // Authentication
app.use('/api/resume',   resumeRoutes);   // Resume upload
app.use('/api/analysis', analysisRoutes); // AI Analysis

// ================================
// 8. ERROR HANDLING MIDDLEWARE
// ================================
// These MUST be after all routes

// Handle 404 - Route not found
app.use(notFound);

// Handle all other errors
app.use(errorHandler);

// ================================
// 9. START SERVER
// ================================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ================================');
  console.log(`🚀  Resume Analyzer API Started!`);
  console.log('🚀 ================================');
  console.log(`📍 URL:         http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`⏰ Started at:  ${new Date().toLocaleTimeString()}`);
  console.log('🚀 ================================');
  console.log('');
});

// ================================
// 10. HANDLE UNHANDLED ERRORS
// ================================

// Handle unhandled promise rejections
// Example: DB query fails
process.on('unhandledRejection', (err, promise) => {
  console.log(`\n❌ UNHANDLED REJECTION: ${err.message}`);
  console.log('Shutting down server...');
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
// Example: Typo in code causes crash
process.on('uncaughtException', (err) => {
  console.log(`\n❌ UNCAUGHT EXCEPTION: ${err.message}`);
  console.log('Shutting down server...');
  process.exit(1);
});

module.exports = app;