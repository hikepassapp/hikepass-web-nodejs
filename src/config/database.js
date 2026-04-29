const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const connectWithRetry = (retries = 10) => {
  db.getConnection((err, connection) => {
    if (err) {
      if (retries === 0) {
        console.error("❌ Gagal konek ke MySQL, stop.");
        process.exit(1);
      }
      console.log("⏳ MySQL belum siap, retry 5 detik...");
      setTimeout(() => connectWithRetry(retries - 1), 5000);
    } else {
      console.log("✅ Connected to MySQL");
      connection.release();
    }
  });
};

connectWithRetry();

module.exports = db;