const express = require('express');
const router = express.Router();
const InformasiController = require('../controllers/InformasiController');

router.get('/', InformasiController.index);
router.get('/:id', InformasiController.show);
router.post('/', InformasiController.store);
router.put('/:id', InformasiController.update);
router.delete('/:id', InformasiController.destroy);

module.exports = router;