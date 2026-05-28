// backend/utils/pdfParser.js
// 📄 PDF Text Extraction Utility
// Extracts and cleans text from PDF files

const pdfParse = require('pdf-parse');
const fs       = require('fs');
const path     = require('path');

// ================================
// MAIN PDF PARSER FUNCTION
// ================================
const extractTextFromPDF = async (filePath) => {
  try {
    // 1️⃣ Check file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // 2️⃣ Read file as buffer
    const dataBuffer = fs.readFileSync(filePath);

    // 3️⃣ Parse PDF
    const pdfData = await pdfParse(dataBuffer);

    // 4️⃣ Extract and clean text
    const rawText   = pdfData.text;
    const cleanText = cleanResumeText(rawText);

    // 5️⃣ Check if we got meaningful text
    if (!cleanText || cleanText.length < 50) {
      throw new Error(
        'Could not extract text from PDF. ' +
        'Please make sure your PDF contains selectable text (not scanned image).'
      );
    }

    // 6️⃣ Return extracted data
    return {
      success:   true,
      text:      cleanText,
      rawText:   rawText,
      pages:     pdfData.numpages,
      wordCount: countWords(cleanText),
      charCount: cleanText.length,
      info:      {
        pages:    pdfData.numpages,
        version:  pdfData.info?.PDFFormatVersion || 'Unknown',
        author:   pdfData.info?.Author           || 'Unknown',
        creator:  pdfData.info?.Creator          || 'Unknown',
      },
    };

  } catch (error) {
    // Handle specific pdf-parse errors
    if (error.message.includes('Invalid PDF')) {
      throw new Error('Invalid PDF file. Please upload a valid PDF.');
    }
    if (error.message.includes('Password')) {
      throw new Error('Password-protected PDFs are not supported. Please remove the password.');
    }
    throw new Error(`PDF parsing failed: ${error.message}`);
  }
};

// ================================
// CLEAN TEXT HELPER
// ================================
const cleanResumeText = (rawText) => {
  if (!rawText) return '';

  return rawText
    // Remove null bytes
    .replace(/\0/g, '')
    // Normalize line endings (Windows \r\n → \n)
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove excessive blank lines (more than 2 in a row)
    .replace(/\n{3,}/g, '\n\n')
    // Remove excessive spaces
    .replace(/[ \t]{3,}/g, '  ')
    // Remove weird unicode characters but keep common ones
    .replace(/[^\x20-\x7E\n\u00C0-\u024F\u0400-\u04FF]/g, ' ')
    // Clean up spaces before newlines
    .replace(/[ \t]+\n/g, '\n')
    // Trim the whole thing
    .trim();
};

// ================================
// WORD COUNT HELPER
// ================================
const countWords = (text) => {
  return text
    .split(/\s+/)
    .filter(word => word.length > 0)
    .length;
};

// ================================
// EXTRACT SECTIONS FROM RESUME
// ================================
// Tries to identify common resume sections
const extractResumeSections = (text) => {
  const sections = {};
  const lines    = text.split('\n');

  // Common section headers in resumes
  const sectionKeywords = {
    contact:     ['contact', 'personal information', 'personal info'],
    summary:     ['summary', 'objective', 'profile', 'about me', 'overview'],
    experience:  ['experience', 'work experience', 'employment', 'work history', 'professional experience'],
    education:   ['education', 'academic', 'qualification', 'degree'],
    skills:      ['skills', 'technical skills', 'core competencies', 'technologies', 'expertise'],
    projects:    ['projects', 'personal projects', 'academic projects', 'portfolio'],
    certifications: ['certifications', 'certificates', 'courses', 'training'],
    achievements:   ['achievements', 'awards', 'honors', 'accomplishments'],
    languages:      ['languages', 'language proficiency'],
  };

  let currentSection = 'other';
  sections[currentSection] = [];

  lines.forEach(line => {
    const lineLower = line.toLowerCase().trim();

    // Check if this line is a section header
    let foundSection = null;
    for (const [section, keywords] of Object.entries(sectionKeywords)) {
      if (keywords.some(kw => lineLower.includes(kw) && lineLower.length < 50)) {
        foundSection = section;
        break;
      }
    }

    if (foundSection) {
      currentSection = foundSection;
      if (!sections[currentSection]) {
        sections[currentSection] = [];
      }
    } else {
      if (!sections[currentSection]) {
        sections[currentSection] = [];
      }
      sections[currentSection].push(line);
    }
  });

  // Convert arrays to strings
  const result = {};
  for (const [key, value] of Object.entries(sections)) {
    result[key] = value.join('\n').trim();
  }

  return result;
};

// ================================
// EXTRACT CONTACT INFO
// ================================
const extractContactInfo = (text) => {
  const contact = {};

  // Email regex
  const emailMatch = text.match(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
  );
  if (emailMatch) contact.email = emailMatch[0];

  // Phone regex (various formats)
  const phoneMatch = text.match(
    /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/
  );
  if (phoneMatch) contact.phone = phoneMatch[0];

  // LinkedIn
  const linkedinMatch = text.match(
    /linkedin\.com\/in\/([a-zA-Z0-9-]+)/i
  );
  if (linkedinMatch) contact.linkedin = linkedinMatch[0];

  // GitHub
  const githubMatch = text.match(
    /github\.com\/([a-zA-Z0-9-]+)/i
  );
  if (githubMatch) contact.github = githubMatch[0];

  // Website/Portfolio
  const websiteMatch = text.match(
    /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/i
  );
  if (websiteMatch && !websiteMatch[0].includes('linkedin') && !websiteMatch[0].includes('github')) {
    contact.website = websiteMatch[0];
  }

  return contact;
};

module.exports = {
  extractTextFromPDF,
  extractResumeSections,
  extractContactInfo,
  cleanResumeText,
  countWords,
};