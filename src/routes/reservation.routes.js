const express = require('express');
const router = express.Router();

const controller = require('../controllers/reservation.controller');
const validate = require('../middlewares/validate.middleware');
const {
    createReservationSchema,
    updateReservationSchema
} = require('../validators/reservation.validator');

const upload = require('../middlewares/uploadIdCard'); // multer kamu

// CREATE
router.post(
    '/',
    upload.single('id_card'),
    validate(createReservationSchema),
    controller.createReservation
);

// UPDATE
router.put(
    '/:id',
    upload.single('id_card'),
    validate(updateReservationSchema),
    controller.updateReservation
);

module.exports = router;