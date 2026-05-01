const express = require('express');
const router = express.Router();
const LaporanController = require('../controllers/LaporanController');

router.get('/', LaporanController.index);
router.get('/:id', LaporanController.show);
router.post('/', LaporanController.store);
router.put('/:id', LaporanController.update);
router.delete('/:id', LaporanController.destroy);

module.exports = router;