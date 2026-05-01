const express = require('express');
const router = express.Router();
const MountainController = require('../controllers/MountainController');

router.get('/gunung-3-bulan', MountainController.laporan3BulanTerakhir);

router.get('/', MountainController.index);
router.get('/:id', MountainController.show);
router.post('/', MountainController.store);
router.put('/:id', MountainController.update);
router.delete('/:id', MountainController.destroy);

module.exports = router;