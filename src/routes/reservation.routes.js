const express = require('express');
const router = express.Router();

const controller = require('../controllers/reservation.controller');
const uploadIdCard = require('../middlewares/uploadIdCard.middleware');

// CREATE (wajib upload)
router.post(
    '/',
    uploadIdCard.single('id_card'),
    controller.store
);

// UPDATE (optional upload)
router.put(
    '/:id',
    uploadIdCard.single('id_card'),
    controller.update
);

module.exports = router;