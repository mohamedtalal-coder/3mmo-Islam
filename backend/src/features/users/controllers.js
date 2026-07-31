const prisma = require('../../db');
const bcrypt = require('bcryptjs');

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, phone, parentPhone, governorate, currentGradeId, email, password, notifyCourseUpdates, notifyQuizReminders, notifyCertificates, notifyPayments } = req.body;

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (phone !== undefined) updateData.phone = phone;
    if (parentPhone !== undefined) updateData.parentPhone = parentPhone;
    if (governorate !== undefined) updateData.governorate = governorate;
    if (currentGradeId) updateData.currentGradeId = currentGradeId;
    if (email) updateData.email = email;
    if (notifyCourseUpdates !== undefined) updateData.notifyCourseUpdates = notifyCourseUpdates;
    if (notifyQuizReminders !== undefined) updateData.notifyQuizReminders = notifyQuizReminders;
    if (notifyCertificates !== undefined) updateData.notifyCertificates = notifyCertificates;
    if (notifyPayments !== undefined) updateData.notifyPayments = notifyPayments;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        parentPhone: true,
        governorate: true,
        role: true,
        currentGradeId: true
      }
    });

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists.' });
    }
    res.status(500).json({ error: 'Failed to update profile.' });
  }
};
