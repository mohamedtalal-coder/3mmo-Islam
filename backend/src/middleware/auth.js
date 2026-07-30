const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Check for token in Authorization header or cookies
  const authHeader = req.headers.authorization;
  let token = req.cookies?.token;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Access denied. Please authenticate.' });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden. Insufficient permissions.' });
    }
    next();
  };
};

const requirePermission = (resource) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Access denied. Please authenticate.' });
    }
    const role = req.user.role;
    if (role === 'TEACHER') {
      return next();
    }
    
    if (role === 'COURSE_ADMIN') {
      if (['DASHBOARD', 'COURSE', 'GRADE', 'SETTINGS'].includes(resource)) {
        return next();
      }
    }
    
    if (role === 'EXAM_ADMIN') {
      if (['DASHBOARD', 'QUIZ', 'STUDENT', 'SETTINGS'].includes(resource)) {
        return next();
      }
    }
    
    return res.status(403).json({ error: 'Forbidden. Insufficient permissions.' });
  };
};

module.exports = { verifyToken, requireRole, requirePermission };
