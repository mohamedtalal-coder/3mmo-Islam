const prisma = require('../../db');

// Public: Get approved reviews
exports.getPublicReviews = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 20;
    const reviews = await prisma.review.findMany({
      where: { isApproved: true },
      include: {
        student: { select: { id: true, fullName: true, avatarUrl: true } },
        course: { select: { id: true, title: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
    res.status(200).json({ reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// Student: Submit a review
exports.submitReview = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Valid rating (1-5) is required' });
    }

    // Upsert so they can update their existing review
    const review = await prisma.review.upsert({
      where: {
        studentId_courseId: { studentId, courseId }
      },
      update: {
        rating,
        comment,
        isApproved: false // Require re-approval on edit
      },
      create: {
        studentId,
        courseId,
        rating,
        comment,
        isApproved: false
      }
    });

    res.status(200).json({ review, message: 'Review submitted and pending approval' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit review' });
  }
};

// Teacher: Get all reviews for moderation
exports.getTeacherReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        student: { select: { id: true, fullName: true, avatarUrl: true, email: true } },
        course: { select: { id: true, title: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch reviews for moderation' });
  }
};

// Teacher: Approve or reject (delete) review
exports.toggleApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const review = await prisma.review.update({
      where: { id },
      data: { isApproved }
    });
    res.status(200).json({ review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update review approval' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.review.delete({ where: { id } });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};
