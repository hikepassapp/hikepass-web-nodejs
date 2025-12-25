const { body } = require('express-validator');
exports.validateBeritaEvent = [
  body('judul')
    .trim()
    .notEmpty().withMessage('Judul tidak boleh kosong')
    .isLength({ min: 5 }).withMessage('Judul minimal 5 karakter'),
  
  body('jenis')
    .isIn(['berita', 'event']).withMessage('Jenis harus berita atau event'),
  
  body('tanggalPublish')
    .notEmpty().withMessage('Tanggal publish tidak boleh kosong')
    .isISO8601().withMessage('Format tanggal tidak valid'),
  
  body('penulis')
    .trim()
    .notEmpty().withMessage('Penulis tidak boleh kosong'),
  
  body('deskripsi')
    .trim()
    .notEmpty().withMessage('Deskripsi tidak boleh kosong')
    .isLength({ min: 20 }).withMessage('Deskripsi minimal 20 karakter')
];
exports.validateBeritaEventUpdate = [
  body('judul')
    .optional()
    .trim()
    .notEmpty().withMessage('Judul tidak boleh kosong')
    .isLength({ min: 5 }).withMessage('Judul minimal 5 karakter'),
  
  body('jenis')
    .optional()
    .isIn(['berita', 'event']).withMessage('Jenis harus berita atau event'),
  
  body('tanggalPublish')
    .optional()
    .isISO8601().withMessage('Format tanggal tidak valid'),
  
  body('penulis')
    .optional()
    .trim()
    .notEmpty().withMessage('Penulis tidak boleh kosong'),
  
  body('deskripsi')
    .optional()
    .trim()
    .notEmpty().withMessage('Deskripsi tidak boleh kosong')
    .isLength({ min: 20 }).withMessage('Deskripsi minimal 20 karakter')
];
