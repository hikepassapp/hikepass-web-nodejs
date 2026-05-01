const express = require('express');
const router = express.Router();
const controller = require('../controllers/laporan.controller');
const upload = require('../middlewares/uploadLaporan.middleware');

// GET
router.get('/', controller.index);
router.get('/:id', controller.show);

// POST
router.post('/', upload.single('foto_bukti'), controller.store);

// PUT
router.put('/:id', upload.single('foto_bukti'), controller.update);

// DELETE
router.delete('/:id', controller.destroy);

module.exports = router;