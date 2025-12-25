require('dotenv').config();
const app = require('./src/app');
const db = require('./src/config/database');

const PORT = process.env.PORT || 5000;

db.getConnection((err, connection) => {
  if (err) {
    console.error('Error koneksi database:', err.message);
    process.exit(1);
  }
  console.log('Database MySQL terhubung');
  connection.release();
});

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});