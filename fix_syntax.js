const fs = require('fs');
let content = fs.readFileSync('backend/src/features/teacher/controllers.js', 'utf8');

// Fix `where: {  ,` and `data: {  ,`
content = content.replace(/{\s*,/g, '{');
// Fix `,  }`
content = content.replace(/,\s*}/g, '}');
// Fix `where: {   }` (empty where)
// If we have `where: {   }`, we should remove it, or leave it as `where: {}`. `where: {}` is valid in Prisma and means no filter.
content = content.replace(/where: {\s*}/g, 'where: {}');

fs.writeFileSync('backend/src/features/teacher/controllers.js', content);
