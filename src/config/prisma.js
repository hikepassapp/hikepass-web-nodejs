const { PrismaClient } = require('@prisma/client');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const prisma = new PrismaClient({
    adapter: {
        provider: 'mysql',
        pool,
    },
});

module.exports = prisma;