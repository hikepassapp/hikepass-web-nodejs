require('dotenv').config();
const app = require('./src/app');
require('./src/config/database'); // cukup panggil, jangan pakai getConnection

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});