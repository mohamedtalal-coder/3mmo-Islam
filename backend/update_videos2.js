const prisma = require('./src/db');
async function main() {
  const lessons = await prisma.lesson.findMany();
  for (const lesson of lessons) {
    if (lesson.title.includes('المبتدأ')) {
      await prisma.lesson.update({
        where: { id: lesson.id },
        data: { vimeoId: 'https://www.youtube.com/embed/Pv0HjFCsTpw' }
      });
    } else if (lesson.title.includes('الفاعل')) {
      await prisma.lesson.update({
        where: { id: lesson.id },
        data: { vimeoId: 'https://www.youtube.com/embed/1TjO-K6w2VM' }
      });
    }
  }
  console.log("Updated videos to REAL valid ones!");
}
main().catch(console.error).finally(() => process.exit(0));
