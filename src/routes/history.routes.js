const express = require('express');
const router = express.Router();
const HistoryController = require('../controllers/HistoryController');

router.get('/checkout/:id', HistoryController.getByCheckout);
router.get('/reservation/:id', HistoryController.getByReservation);

router.post('/checkout/:id/create', HistoryController.createFromCheckout);

router.get('/', HistoryController.index);
router.get('/:id', HistoryController.show);
router.post('/', HistoryController.store);
router.put('/:id', HistoryController.update);
router.delete('/:id', HistoryController.destroy);

module.exports = router;