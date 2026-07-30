const multer = require('multer');

// Use memory storage for Vercel serverless (no persistent disk)
// Files are available as req.file.buffer / req.files[].buffer
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 4 * 1024 * 1024 // 4MB max (Vercel serverless body limit)
  }
});

module.exports = upload;
