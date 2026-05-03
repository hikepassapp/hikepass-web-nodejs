const express = require('express');
const router = express.Router();

const controller = require('../controllers/reservation.controller');
const validate = require('../middlewares/validate.middleware');

const {
    createReservationSchema,
    updateReservationSchema
} = require('../validators/reservation.validator');

const upload = require('../middlewares/uploadIdCard.middleware');


// ===============================
// CREATE RESERVATION
// ===============================
router.post(
    '/',
    upload.single('id_card'),                 // upload file
    validate(createReservationSchema),        // validasi body
    controller.store                          // ⚠️ sesuai controller
);


// ===============================
// UPDATE RESERVATION
// ===============================
router.put(
    '/:id',
    upload.single('id_card'),
    validate(updateReservationSchema),
    controller.update
);


// ===============================
// GET ALL RESERVATIONS
// ===============================
router.get(
    '/',
    async (req, res) => {
        try {
            const data = await require('../config/prisma').reservation.findMany({
                include: { mountain: true },
                orderBy: { created_at: 'desc' }
            });

            res.json({
                success: true,
                data
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
);


// ===============================
// GET RESERVATION BY ID
// ===============================
router.get(
    '/:id',
    async (req, res) => {
        try {
            const prisma = require('../config/prisma');

            const data = await prisma.reservation.findUnique({
                where: { id: parseInt(req.params.id) },
                include: { mountain: true }
            });

            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: 'Reservation not found'
                });
            }

            res.json({
                success: true,
                data
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
);


// ===============================
// DELETE RESERVATION
// ===============================
router.delete(
    '/:id',
    async (req, res) => {
        try {
            const prisma = require('../config/prisma');

            const existing = await prisma.reservation.findUnique({
                where: { id: parseInt(req.params.id) }
            });

            if (!existing) {
                return res.status(404).json({
                    success: false,
                    message: 'Reservation not found'
                });
            }

            await prisma.reservation.delete({
                where: { id: parseInt(req.params.id) }
            });

            res.json({
                success: true,
                message: 'Reservation deleted successfully'
            });

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
);

module.exports = router;