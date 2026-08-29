const fs = require('fs');
const path = require('path');

console.log('🔄 Syncing resume assets & data...');

const RESUME_DIR = path.resolve(__dirname, '../shivam-resume');
const ASSETS_RESUME_DIR = path.resolve(__dirname, 'assets/resume');
const DATA_RESUME_JSON = path.resolve(__dirname, 'data/resume-data.json');

// Ensure assets/resume directory exists
if (!fs.existsSync(ASSETS_RESUME_DIR)) {
  fs.mkdirSync(ASSETS_RESUME_DIR, { recursive: true });
}

// 1. Copy latest resume.pdf
const resumePdfPath = path.join(RESUME_DIR, 'resume.pdf');
let copied = false;

if (fs.existsSync(resumePdfPath)) {
  const destPath = path.join(ASSETS_RESUME_DIR, 'Shivam_Dubey_Resume.pdf');
  fs.copyFileSync(resumePdfPath, destPath);
  console.log(`✅ Synced PDF: resume.pdf -> assets/resume/Shivam_Dubey_Resume.pdf`);
  copied = true;
}

if (!copied) {
  console.warn('⚠️ No source PDF found in ../shivam-resume/. Keeping current assets/resume/Shivam_Dubey_Resume.pdf');
}

// 2. Validate JSON data
if (fs.existsSync(DATA_RESUME_JSON)) {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_RESUME_JSON, 'utf-8'));
    console.log(`✅ Resume Data Validated: ${data.personal.name} (${data.education.length} Education, ${data.projects.length} Projects, ${data.experience.length} Experience, ${data.achievements.items.length} Achievements)`);
  } catch (err) {
    console.error('❌ Error parsing data/resume-data.json:', err.message);
  }
} else {
  console.warn('⚠️ data/resume-data.json does not exist.');
}

console.log('🎉 Resume sync completed! Refresh http://localhost:3000 to see updates.');
