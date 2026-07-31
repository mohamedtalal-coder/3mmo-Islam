const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Security and utility middleware
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

// CORS — allow frontend origins (local + Vercel deployed)
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL, // Set this in Vercel env vars
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true // Allow cookies to be sent
}));

app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(morgan('dev')); // Logger

// Import routes
const authRoutes = require('./src/features/auth/routes');
const settingsRoutes = require('./src/features/settings/routes');
const usersRoutes = require('./src/features/users/routes');
const studentRoutes = require('./src/features/student/routes');
const teacherRoutes = require('./src/features/teacher/routes');
const coursesRoutes = require('./src/features/courses/routes');
const publicRoutes = require('./src/features/public/routes');
const notificationsRoutes = require('./src/features/notifications/routes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/reviews', require('./src/features/reviews/routes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Express backend is running on Vercel' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    stack: err.stack
  });
});

// Only listen when running locally (not on Vercel)
if (!process.env.VERCEL) {
  const prisma = require('./src/db');
  app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    try {
      await prisma.$connect();
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
    }
  });
}

// Export for Vercel serverless
module.exports = app;
