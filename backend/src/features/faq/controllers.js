const prisma = require('../../db');

// Public: Get all active FAQs
exports.getPublicFaqs = async (req, res) => {
  try {
    const faqs = await prisma.faq.findMany({
      where: { isActive: true },
      orderBy: { position: 'asc' }
    });
    res.status(200).json({ faqs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
};

// Teacher: Get all FAQs (including inactive)
exports.getTeacherFaqs = async (req, res) => {
  try {
    const faqs = await prisma.faq.findMany({
      orderBy: { position: 'asc' }
    });
    res.status(200).json({ faqs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
};

// Teacher: Create FAQ
exports.createFaq = async (req, res) => {
  try {
    const { question, answer, isActive, position } = req.body;
    
    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required' });
    }

    const faq = await prisma.faq.create({
      data: { question, answer, isActive, position: position || 0 }
    });

    res.status(201).json({ faq });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create FAQ' });
  }
};

// Teacher: Update FAQ
exports.updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, isActive, position } = req.body;
    
    const faq = await prisma.faq.update({
      where: { id },
      data: { question, answer, isActive, position }
    });

    res.status(200).json({ faq });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
};

// Teacher: Delete FAQ
exports.deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.faq.delete({ where: { id } });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
};
