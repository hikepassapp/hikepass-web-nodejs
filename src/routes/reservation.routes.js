const express = require('express');
const router = express.Router();
const ReservationController = require('../controllers/ReservationController');

router.get('/all', ReservationController.all);

router.get('/', ReservationController.index);
router.get('/:id', ReservationController.show);
router.post('/', ReservationController.store);
router.put('/:id', ReservationController.update);
router.delete('/:id', ReservationController.destroy);

module.exports = router;