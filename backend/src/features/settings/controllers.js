const prisma = require('../../db');

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
