const { PrismaClient } = require('@prisma/client');

require('dotenv').config();

function createPrismaClient() {
  return new PrismaClient();
}

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = createPrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = createPrismaClient();
  }
  prisma = global.prisma;
}

module.exports = prisma;
