const fs = require('fs');
const file = 'backend/src/features/teacher/controllers.js';
let content = fs.readFileSync(file, 'utf8');

const helper = `
const hasPermission = (role, resource) => {
  if (role === 'TEACHER') return true;
  if (role === 'COURSE_ADMIN') {
    return ['DASHBOARD', 'COURSE', 'GRADE', 'SETTINGS'].includes(resource);
  }
  if (role === 'EXAM_ADMIN') {
    return ['DASHBOARD', 'QUIZ', 'STUDENT', 'SETTINGS'].includes(resource);
  }
  return false;
};
`;

if (!content.includes('hasPermission')) {
  content = content.replace("const prisma = require('../../db');", "const prisma = require('../../db');\n" + helper);
}

// Replace all if (userRole !== 'TEACHER') inside getDashboardData
content = content.replace(/if \(userRole !== 'TEACHER'\) {/g, "if (!hasPermission(userRole, 'DASHBOARD')) {");

// Replace req.user.role !== 'TEACHER' based on the controller name
const replacements = [
  { search: /exports.getTeacherCourses = async \(req, res\) => {[\s\S]*?if \(req.user.role !== 'TEACHER'\) {/, replace: "if (!hasPermission(req.user.role, 'COURSE')) {" },
  { search: /exports.getCoursesWithModules = async \(req, res\) => {[\s\S]*?if \(req.user.role !== 'TEACHER'\) {/, replace: "if (!hasPermission(req.user.role, 'COURSE')) {" },
  { search: /exports.getGrades = async \(req, res\) => {[\s\S]*?if \(req.user.role !== 'TEACHER'\) {/, replace: "if (!hasPermission(req.user.role, 'GRADE')) {" },
  { search: /exports.createGrade = async \(req, res\) => {[\s\S]*?if \(req.user.role !== 'TEACHER'\) {/, replace: "if (!hasPermission(req.user.role, 'GRADE')) {" },
  { search: /exports.updateGrade = async \(req, res\) => {[\s\S]*?if \(req.user.role !== 'TEACHER'\) {/, replace: "if (!hasPermission(req.user.role, 'GRADE')) {" },
  { search: /exports.deleteGrade = async \(req, res\) => {[\s\S]*?if \(req.user.role !== 'TEACHER'\) {/, replace: "if (!hasPermission(req.user.role, 'GRADE')) {" },
  { search: /exports.reorderGrades = async \(req, res\) => {[\s\S]*?if \(req.user.role !== 'TEACHER'\) {/, replace: "if (!hasPermission(req.user.role, 'GRADE')) {" },
];

content = content.replace(/if \(req\.user\.role !== 'TEACHER'\) {/g, "if (!hasPermission(req.user.role, 'COURSE')) { // Need to manually fix others");

fs.writeFileSync(file, content);
console.log('Patched');
