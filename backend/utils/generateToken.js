// backend/utils/generateToken.js
// 🎟️ JWT Token Generator
// Creates secure tokens for user authentication

const jwt = require('jsonwebtoken');

// ================================
// GENERATE JWT TOKEN
// ================================
const generateToken = (userId) => {
  // Create token with user ID inside
  // Signs it with our secret key
  // Sets expiration from .env (default 30 days)
  const token = jwt.sign(
    { id: userId },              // Payload - what we store in token
    process.env.JWT_SECRET,      // Secret key to sign with
    { expiresIn: process.env.JWT_EXPIRE || '30d' } // Expiration
  );

  return token;
};

// ================================
// VERIFY JWT TOKEN
// ================================
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

module.exports = { generateToken, verifyToken };