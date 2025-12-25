const { body } = require('express-validator');
exports.validatePaketWisata = [
  body('judul')
    .trim()
    .notEmpty().withMessage('Judul tidak boleh kosong')
    .isLength({ min: 5 }).withMessage('Judul minimal 5 karakter'),
  
  body('penulis')
    .trim()
    .notEmpty().withMessage('Penulis tidak boleh kosong'),
  
  body('jenis')
    .isIn(['private', 'open trip']).withMessage('Jenis harus private atau open trip'),
  
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 }).withMessage('Rating harus antara 0-5'),
  
  body('tanggal')
    .notEmpty().withMessage('Tanggal tidak boleh kosong')
    .isISO8601().withMessage('Format tanggal tidak valid'),
  
  body('biaya')
    .notEmpty().withMessage('Biaya tidak boleh kosong')
    .isNumeric().withMessage('Biaya harus berupa angka')
    .custom(value => value >= 0).withMessage('Biaya tidak boleh negatif'),
  
  body('titikKumpul')
    .trim()
    .notEmpty().withMessage('Titik kumpul tidak boleh kosong'),
  
  body('waktu')
    .trim()
    .notEmpty().withMessage('Waktu tidak boleh kosong'),
  
  body('kontak')
    .trim()
    .notEmpty().withMessage('Kontak tidak boleh kosong'),
  
  body('deskripsi')
    .trim()
    .notEmpty().withMessage('Deskripsi tidak boleh kosong')
    .isLength({ min: 20 }).withMessage('Deskripsi minimal 20 karakter'),
  
  body('guide')
    .trim()
    .notEmpty().withMessage('Guide tidak boleh kosong')
];
exports.validatePaketWisataUpdate = [
  body('judul')
    .optional()
    .trim()
    .notEmpty().withMessage('Judul tidak boleh kosong')
    .isLength({ min: 5 }).withMessage('Judul minimal 5 karakter'),
  
  body('penulis')
    .optional()
    .trim()
    .notEmpty().withMessage('Penulis tidak boleh kosong'),
  
  body('jenis')
    .optional()
    .isIn(['private', 'open trip']).withMessage('Jenis harus private atau open trip'),
  
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 }).withMessage('Rating harus antara 0-5'),
  
  body('tanggal')
    .optional()
    .isISO8601().withMessage('Format tanggal tidak valid'),
  
  body('biaya')
    .optional()
    .isNumeric().withMessage('Biaya harus berupa angka')
    .custom(value => value >= 0).withMessage('Biaya tidak boleh negatif'),
  
  body('titikKumpul')
    .optional()
    .trim()
    .notEmpty().withMessage('Titik kumpul tidak boleh kosong'),
  
  body('waktu')
    .optional()
    .trim()
    .notEmpty().withMessage('Waktu tidak boleh kosong'),
  
  body('kontak')
    .optional()
    .trim()
    .notEmpty().withMessage('Kontak tidak boleh kosong'),
  
  body('deskripsi')
    .optional()
    .trim()
    .notEmpty().withMessage('Deskripsi tidak boleh kosong')
    .isLength({ min: 20 }).withMessage('Deskripsi minimal 20 karakter'),
  
  body('guide')
    .optional()
    .trim()
    .notEmpty().withMessage('Guide tidak boleh kosong')
];