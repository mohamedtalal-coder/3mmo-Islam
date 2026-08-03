const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const prisma = require('../../db');
const { sendVerificationEmail } = require('../../services/mailer');
const UAParser = require('ua-parser-js');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, permissions: user.permissions || [] },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { email, password, fullName, phone, parentPhone, governorate, schoolName, currentGradeId, role } = req.body;

    if (!email || !password || !fullName || !phone || !parentPhone || !governorate || !schoolName || !currentGradeId) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة لإتمام عملية التسجيل.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate Verification Token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        phone,
        parentPhone,
        governorate,
        schoolName,
        currentGradeId,
        role: role === 'TEACHER' ? 'TEACHER' : 'STUDENT',
        isVerified: true, // TEMPORARY for testing
        verificationToken,
        verificationTokenExpires
      }
    });

    // Send email (don't block registration on email failure)
    try {
      await sendVerificationEmail(user.email, verificationToken);
    } catch (err) {
      console.error('Failed to send verification email during registration:', err);
    }

    // Set cookie immediately so they are logged in if we bypass verification
    const token = generateToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      message: 'User registered successfully.',
      requireVerification: false, // TEMPORARY bypass
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        permissions: user.permissions || []
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register user.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Check if banned
    if (user.accountStatus === 'DISABLED') {
      return res.status(403).json({ error: 'حسابك معطل حالياً. يرجى مراجعة المعلم.' });
    }

    // Check if verified
    // if (!user.isVerified) {
    //   return res.status(403).json({ error: 'يرجى التحقق من بريدك الإلكتروني أولاً لتفعيل حسابك.' });
    // }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // --- Device Limit Check ---
    const { deviceId } = req.body;
    const userAgentString = req.headers['user-agent'] || '';
    const parser = new UAParser(userAgentString);
    const device = parser.getDevice();
    
    // Determine if it's Mobile/Tablet or Desktop
    // ua-parser-js returns device.type as 'mobile', 'tablet', 'smarttv', 'console', 'wearable', 'embedded'
    // If it's undefined, it's usually a Desktop browser.
    const isMobileOrTablet = ['mobile', 'tablet'].includes(device.type);
    const deviceType = isMobileOrTablet ? 'MOBILE' : 'DESKTOP';

    let currentDeviceId = deviceId;
    let allowedDevice = null;

    if (currentDeviceId) {
      allowedDevice = await prisma.userDevice.findUnique({
        where: { deviceId: currentDeviceId }
      });
      if (allowedDevice && allowedDevice.userId !== user.id) {
        // Device ID belongs to someone else! Force a new one for this user if possible
        allowedDevice = null;
        currentDeviceId = null;
      }
    }

    if (allowedDevice) {
      // Update last login for this device
      await prisma.userDevice.update({
        where: { id: allowedDevice.id },
        data: { lastLogin: new Date(), userAgent: userAgentString }
      });
    } else {
      // It's a new device or they cleared their localStorage
      // Check how many devices of this type they already have
      const existingDevicesCount = await prisma.userDevice.count({
        where: { userId: user.id, deviceType }
      });

      if (existingDevicesCount >= 1) {
        return res.status(403).json({ 
          error: 'DEVICE_LIMIT_REACHED',
          message: `عذراً، لقد استنفدت الحد الأقصى للأجهزة المسموح بها من نوع (${deviceType === 'DESKTOP' ? 'كمبيوتر' : 'هاتف/تابلت'}). يرجى التواصل مع الدعم أو المعلم لإعادة ضبط أجهزتك.`
        });
      }

      // Slot is open, register this new device
      currentDeviceId = crypto.randomUUID();
      await prisma.userDevice.create({
        data: {
          userId: user.id,
          deviceId: currentDeviceId,
          deviceType,
          userAgent: userAgentString
        }
      });
    }
    // --- End Device Limit Check ---

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(200).json({
      success: true,
      token, // Also send token in body for mobile apps if needed
      deviceId: currentDeviceId,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        permissions: user.permissions || []
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to login.' });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        phone: true,
        parentPhone: true,
        governorate: true,
        schoolName: true,
        currentGradeId: true,
        accountStatus: true,
        createdAt: true,
        notifyCourseUpdates: true,
        notifyQuizReminders: true,
        notifyCertificates: true,
        notifyPayments: true,
        permissions: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user profile.' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Return success even if user doesn't exist for security reasons
      return res.status(200).json({ message: 'Reset link sent if email exists.' });
    }

    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpires }
    });

    // In a real application, send an email here using nodemailer, resend, sendgrid, etc.
    // For this template, we will log the reset link to the console so the developer can see it.
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    console.log(`\n\n[PASSWORD RESET LINK FOR ${email}]:\n${resetLink}\n\n`);

    res.status(200).json({ message: 'Reset link sent if email exists.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process request.' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ error: 'Token and new password are required.' });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: { gt: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpires: null
      }
    });

    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to reset password.' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required.' });
    }

    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'رابط التفعيل غير صالح أو منتهي الصلاحية.' });
    }

    // Verify user and clear token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpires: null
      }
    });

    res.status(200).json({ message: 'تم تفعيل حسابك بنجاح! يمكنك الآن تسجيل الدخول.' });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ error: 'Failed to verify email.' });
  }
};
