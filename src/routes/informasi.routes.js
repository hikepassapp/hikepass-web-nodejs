const express = require('express');
const router = express.Router();
const controller = require('../controllers/informasi.controller');
const upload = require('../middlewares/uploadInformasi.middleware');

// GET
router.get('/', controller.index);
router.get('/:id', controller.show);

// POST
router.post('/', upload.single('gambar'), controller.store);

// PUT
router.put('/:id', upload.single('gambar'), controller.update);

// DELETE
router.delete('/:id', controller.destroy);

module.exports = router;