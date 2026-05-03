const express = require('express');
const router = express.Router();
const CheckoutController = require('../controllers/checkout.controller');

router.get('/checkin/:id', CheckoutController.getByCheckin);
router.get('/reservation/:id', CheckoutController.getByReservation);

router.get('/', CheckoutController.index);
router.get('/:id', CheckoutController.show);
router.post('/', CheckoutController.store);
router.put('/:id', CheckoutController.update);
router.delete('/:id', CheckoutController.destroy);

module.exports = router;