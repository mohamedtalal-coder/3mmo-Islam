const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Security and utility middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'https://cd8xxg88-3000.uks1.devtunnels.ms'], // Allow Next.js frontend and dev tunnel
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

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/public', publicRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Express backend is running securely' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

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
