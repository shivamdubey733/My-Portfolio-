const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

const SOURCE_RESUME_PDF = path.resolve(__dirname, '../shivam-resume/resume.pdf');
const DEST_RESUME_PDF = path.resolve(__dirname, 'assets/resume/Shivam_Dubey_Resume.pdf');

// Function to copy resume PDF if source is newer or changed
function autoSyncResume() {
  try {
    if (fs.existsSync(SOURCE_RESUME_PDF)) {
      const sourceStats = fs.statSync(SOURCE_RESUME_PDF);
      let needsCopy = true;

      if (fs.existsSync(DEST_RESUME_PDF)) {
        const destStats = fs.statSync(DEST_RESUME_PDF);
        if (destStats.mtimeMs >= sourceStats.mtimeMs && destStats.size === sourceStats.size) {
          needsCopy = false;
        }
      }

      if (needsCopy) {
        fs.mkdirSync(path.dirname(DEST_RESUME_PDF), { recursive: true });
        fs.copyFileSync(SOURCE_RESUME_PDF, DEST_RESUME_PDF);
        console.log(`⚡ Auto-Synced: resume.pdf -> assets/resume/Shivam_Dubey_Resume.pdf (${new Date().toLocaleTimeString()})`);
      }
    }
  } catch (err) {
    console.warn('⚠️ Auto-sync resume error:', err.message);
  }
}

// Initial sync on startup
autoSyncResume();

// Auto-watch shivam-resume/resume.pdf for real-time changes
if (fs.existsSync(SOURCE_RESUME_PDF)) {
  fs.watchFile(SOURCE_RESUME_PDF, { interval: 1000 }, (curr, prev) => {
    if (curr.mtimeMs !== prev.mtimeMs) {
      autoSyncResume();
    }
  });
  console.log(`👀 Watching for changes in: ${SOURCE_RESUME_PDF}`);
}

const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0];
  if (reqUrl === '/' || reqUrl === '') {
    reqUrl = '/index.html';
  }

  // If requesting resume PDF, perform a quick sync check first
  if (reqUrl.includes('Shivam_Dubey_Resume.pdf')) {
    autoSyncResume();
  }

  const filePath = path.join(PUBLIC_DIR, decodeURIComponent(reqUrl));
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    // Support range requests for video/audio/pdf
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      file.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': stats.size,
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      fs.createReadStream(filePath).pipe(res);
    }
  });
});

function startServer(port) {
  const s = server.listen(port, () => {
    console.log(`🚀 Portfolio server running smoothly at http://localhost:${port}`);
  });

  s.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️ Port ${port} is busy, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(PORT);
