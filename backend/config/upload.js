// backend/config/upload.js
// 📁 Multer File Upload Configuration
// Handles PDF file uploads, validation, and storage

const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// ================================
// 1. ENSURE UPLOADS FOLDER EXISTS
// ================================
const uploadsDir = path.join(__dirname, '..', 'uploads');

// Create uploads folder if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Uploads folder created');
}

// ================================
// 2. STORAGE CONFIGURATION
// ================================
const storage = multer.diskStorage({

  // 📂 Where to save the file
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },

  // 📝 What to name the file
  filename: function (req, file, cb) {
    // Remove spaces and special chars from original name
    const cleanName = file.originalname
      .replace(/\s+/g, '-')           // spaces → dashes
      .replace(/[^a-zA-Z0-9.-]/g, '') // remove special chars
      .toLowerCase();

    // Create unique filename: userId-timestamp-originalname.pdf
    // Example: 65abc123-1703123456789-myresume.pdf
    const userId    = req.user ? req.user._id : 'guest';
    const timestamp = Date.now();
    const filename  = `${userId}-${timestamp}-${cleanName}`;

    cb(null, filename);
  },
});

// ================================
// 3. FILE FILTER (Only PDFs allowed)
// ================================
const fileFilter = (req, file, cb) => {
  // Check MIME type
  const allowedMimeTypes = [
    'application/pdf',
    'application/x-pdf',
  ];

  // Check file extension
  const allowedExtensions = ['.pdf'];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (
    allowedMimeTypes.includes(file.mimetype) &&
    allowedExtensions.includes(fileExtension)
  ) {
    // ✅ Accept the file
    cb(null, true);
  } else {
    // ❌ Reject the file
    cb(
      new Error('Only PDF files are allowed! Please upload a .pdf file.'),
      false
    );
  }
};

// ================================
// 4. CREATE MULTER INSTANCE
// ================================
const upload = multer({
  storage:    storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files:    1,                // Only 1 file at a time
  },
});

// ================================
// 5. HELPER: DELETE FILE
// ================================
// Used to clean up files after processing
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🗑️ File deleted: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error deleting file: ${error.message}`);
  }
};

// ================================
// 6. HELPER: GET FILE SIZE IN MB
// ================================
const getFileSizeInMB = (bytes) => {
  return (bytes / (1024 * 1024)).toFixed(2);
};

module.exports = { upload, deleteFile, getFileSizeInMB };