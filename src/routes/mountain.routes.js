const express = require('express');
const router = express.Router();
const controller = require('../controllers/mountain.controller');
const upload = require('../middlewares/uploadMountain.middleware');

router.get('/', controller.index);
router.get('/gunung-3-bulan', controller.laporan3BulanTerakhir);
router.get('/:id', controller.show);

router.post('/', upload.single('image'), controller.store);
router.put('/:id', upload.single('image'), controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;