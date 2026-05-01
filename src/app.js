const express = require('express');
const cors = require('cors');
const path = require('path');
const paketWisataRoutes = require('./routes/paketWisata.routes');
const beritaEventRoutes = require('./routes/beritaEvent.routes');
const errorHandler = require('./middlewares/errorHandler.middleware');

const app = express();

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const mountainRoutes = require('./routes/mountain.routes');
const reservationRoutes = require('./routes/reservation.routes');
const checkinRoutes = require('./routes/checkin.routes');
const checkoutRoutes = require('./routes/checkout.routes');
const historyRoutes = require('./routes/history.routes');
const laporanRoutes = require('./routes/laporan.routes');
const informasiRoutes = require('./routes/informasi.routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mountains', mountainRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/checkins', checkinRoutes);
app.use('/api/checkouts', checkoutRoutes);
app.use('/api/histories', historyRoutes);
app.use('/api/laporans', laporanRoutes);
app.use('/api/informasi', informasiRoutes);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/paket-wisata', paketWisataRoutes);
app.use('/api/berita-event', beritaEventRoutes);

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