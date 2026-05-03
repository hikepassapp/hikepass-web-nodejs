const express = require('express');
const router = express.Router();
const CheckinController = require('../controllers/checkin.controller');

router.get('/reservation/:id', CheckinController.getByReservation);

router.get('/', CheckinController.index);
router.get('/:id', CheckinController.show);
router.post('/', CheckinController.store);
router.put('/:id', CheckinController.update);
router.delete('/:id', CheckinController.destroy);

module.exports = router;