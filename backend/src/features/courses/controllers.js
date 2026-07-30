const prisma = require('../../db');

exports.getAllCourses = async (req, res) => {
  try {
    const { q } = req.query;

    const whereClause = {
      published: true,
      deletedAt: null
    };

    if (q) {
      const normalizedQuery = q.replace(/\s+/g, ' ').trim();
      whereClause.OR = [
        { title: { contains: normalizedQuery, mode: 'insensitive' } },
        { description: { contains: normalizedQuery, mode: 'insensitive' } }
      ];
    }

    const courses = await prisma.course.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        pricingType: true,
        thumbnailUrl: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findFirst({
      where: {
        id,
        published: true,
        deletedAt: null
      }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const modules = await prisma.module.findMany({
      where: {
        courseId: id,
        deletedAt: null
      },
      orderBy: { position: 'asc' },
      include: {
        lessons: {
          select: { id: true, title: true, position: true },
          orderBy: { position: 'asc' }
        }
      }
    });

    const attachments = await prisma.courseAttachment.findMany({
      where: { courseId: id },
      orderBy: { createdAt: 'asc' }
    });

    res.status(200).json({ course, modules, attachments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch course details' });
  }
};

exports.getGrades = async (req, res) => {
  try {
    const grades = await prisma.grade.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    res.status(200).json(grades);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch grades' });
  }
};

exports.getLessonComments = async (req, res) => {
  try {
    const { id } = req.params;

    const comments = await prisma.lessonComment.findMany({
      where: {
        lessonId: id,
        deletedAt: null
      },
      include: {
        author: {
          select: {
            fullName: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Map properties to match frontend expectation (camelCase / specific keys)
    const formattedComments = comments.map(c => ({
      id: c.id,
      content: c.content,
      created_at: c.createdAt,
      author_id: c.authorId,
      profiles: {
        full_name: c.author.fullName,
        role: c.author.role
      }
    }));

    res.status(200).json(formattedComments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

exports.createLessonComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const comment = await prisma.lessonComment.create({
      data: {
        lessonId: id,
        authorId: userId,
        content
      },
      include: {
        author: {
          select: {
            fullName: true,
            role: true
          }
        }
      }
    });

    const formattedComment = {
      id: comment.id,
      content: comment.content,
      created_at: comment.createdAt,
      author_id: comment.authorId,
      profiles: {
        full_name: comment.author.fullName,
        role: comment.author.role
      }
    };

    res.status(201).json(formattedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};
