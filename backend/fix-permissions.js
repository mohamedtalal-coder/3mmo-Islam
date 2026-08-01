const fs = require('fs');
let content = fs.readFileSync('src/features/teacher/controllers.js', 'utf8');

content = content.replace(/hasPermission\(userRole,/g, 'hasPermission(req.user,');
content = content.replace(/hasPermission\(req\.user\.role,/g, 'hasPermission(req.user,');

const oldFunc = `const hasPermission = (role, resource) => {
  if (role === 'TEACHER') return true;
  if (role === 'COURSE_ADMIN') {
    return ['DASHBOARD', 'COURSE'].includes(resource);
  }
  if (role === 'EXAM_ADMIN') {
    return ['DASHBOARD', 'QUIZ'].includes(resource);
  }
  return false;
};`;

const newFunc = `const hasPermission = (user, resource) => {
  if (!user) return false;
  if (user.role === 'TEACHER') return true;
  if (user.role === 'ASSISTANT') {
    return user.permissions && user.permissions.includes(resource);
  }
  return false;
};`;

content = content.replace(oldFunc, newFunc);
fs.writeFileSync('src/features/teacher/controllers.js', content);
console.log('Successfully replaced hasPermission');
