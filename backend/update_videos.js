const prisma = require('./src/db');
async function main() {
  const lessons = await prisma.lesson.findMany();
  for (const lesson of lessons) {
    if (lesson.title.includes('المبتدأ')) {
      await prisma.lesson.update({
        where: { id: lesson.id },
        data: { vimeoId: 'https://www.youtube.com/embed/P6s-b5m4p6E' }
      });
    } else if (lesson.title.includes('الفاعل')) {
      await prisma.lesson.update({
        where: { id: lesson.id },
        data: { vimeoId: 'https://www.youtube.com/embed/5U9N5Jg92eE' }
      });
    }
  }
  console.log("Updated videos!");
}
main().catch(console.error).finally(() => process.exit(0));
