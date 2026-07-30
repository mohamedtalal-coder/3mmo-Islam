const fs = require('fs');
let content = fs.readFileSync('backend/src/features/teacher/controllers.js', 'utf8');

const helper = `
const getMainTeacherId = async () => {
  const teacher = await prisma.user.findFirst({ where: { role: 'TEACHER' } });
  return teacher ? teacher.id : null;
};
`;

if (!content.includes('getMainTeacherId')) {
  content = content.replace("const hasPermission", helper + "\nconst hasPermission");
}

// In createCourse, we need to set teacherId: await getMainTeacherId() || userId,
content = content.replace(/title,\s*description,/g, "teacherId: await getMainTeacherId() || userId,\n        title,\n        description,");

fs.writeFileSync('backend/src/features/teacher/controllers.js', content);
