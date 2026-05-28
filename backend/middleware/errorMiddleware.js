// backend/middleware/errorMiddleware.js
// 🛡️ Global Error Handler
// Catches ALL errors from any route and sends proper response

// ================================
// 404 Handler - Route Not Found
// ================================
const notFound = (req, res, next) => {
  // Create an error for unknown routes
  const error = new Error(`❌ Route Not Found: ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass to error handler below
};

// ================================
// Global Error Handler
// ================================
const errorHandler = (err, req, res, next) => {
  // Sometimes error comes with 200 status by mistake
  // In that case, set it to 500 (server error)
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // 🔍 Handle specific MongoDB/Mongoose errors

  // Error: Bad MongoDB ObjectId (e.g., wrong ID format)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found (Invalid ID format)';
  }

  // Error: Duplicate field in MongoDB (e.g., email already exists)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists. Please use a different ${field}.`;
  }

  // Error: Mongoose validation failed
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map(val => val.message)
      .join(', ');
  }

  // Error: JWT token invalid
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please login again.';
  }

  // Error: JWT token expired
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired. Please login again.';
  }

  // 📤 Send error response
  res.status(statusCode).json({
    success: false,
    message,
    // Show stack trace only in development (not in production)
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = { notFound, errorHandler };