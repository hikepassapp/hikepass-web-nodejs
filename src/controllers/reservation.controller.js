
const prisma = require('../config/prisma');

// ===============================
// CREATE
// ===============================
exports.store = async (req, res) => {
    try {
        const {
            id_mountain,
            start_date,
            name,
            nik,
            gender,
            phone_number,
            address,
            citizen,
            price
        } = req.body;

        if (
            !id_mountain || !start_date || !name || !nik ||
            !gender || !phone_number || !address || !citizen || !price
        ) {
            return res.status(422).json({
                success: false,
                message: 'Validation error'
            });
        }

        const reservation = await prisma.reservation.create({
            data: {
                id_mountain: parseInt(id_mountain),
                start_date: new Date(start_date),
                name,
                nik,
                gender,
                phone_number,
                address,
                citizen,
                price: parseInt(price),
                id_card: req.uploadedFile // 🔥 dari middleware
            },
            include: { mountain: true }
        });

        res.status(201).json({
            success: true,
            message: 'Reservation created successfully',
            data: reservation
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ===============================
// UPDATE
// ===============================
exports.update = async (req, res) => {
    try {
        const { id } = req.params;

        const reservation = await prisma.reservation.findUnique({
            where: { id: parseInt(id) }
        });

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Reservation not found'
            });
        }

        let data = { ...req.body };

        if (data.id_mountain) data.id_mountain = parseInt(data.id_mountain);
        if (data.price) data.price = parseInt(data.price);
        if (data.start_date) data.start_date = new Date(data.start_date);

        // 🔥 kalau ada file baru dari middleware
        if (req.uploadedFile) {
            data.id_card = req.uploadedFile;
        }

        const updated = await prisma.reservation.update({
            where: { id: parseInt(id) },
            data,
            include: { mountain: true }
        });

        res.json({
            success: true,
            message: 'Reservation updated successfully',
            data: updated
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};