const express = require('express');
const cors = require('cors');
const path = require('path');
const paketWisataRoutes = require('./routes/paketWisata.routes');
const errorHandler = require('./middlewares/errorHandler.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/paket-wisata', paketWisataRoutes);
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server berjalan dengan baik'
  });
});
app.use(errorHandler);
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route tidak ditemukan'
  });
});
module.exports = app;