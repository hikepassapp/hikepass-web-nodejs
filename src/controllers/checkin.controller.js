const prisma = require('../config/prisma');


// ================= INDEX =================
// Ambil checkin yang BELUM punya checkout
exports.index = async (req, res) => {
    try {
        const checkins = await prisma.checkin.findMany({
            where: {
                checkouts: {
                    none: {} // whereDoesntHave('checkout')
                }
            },
            include: {
                reservation: {
                    include: {
                        mountain: true
                    }
                }
            }
        });

        res.json({
            success: true,
            message: 'List of check-ins',
            data: checkins
        });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



// ================= STORE =================
exports.store = async (req, res) => {
    try {
        const { id_reservation, item_list, checkin_date } = req.body;

        // Validasi manual
        if (!id_reservation || !item_list || !checkin_date) {
            return res.status(422).json({
                success: false,
                message: 'Validation error',
                errors: 'Semua field wajib diisi'
            });
        }

        // Cek reservation ada
        const reservation = await prisma.reservation.findUnique({
            where: { id: parseInt(id_reservation) }
        });

        if (!reservation) {
            return res.status(422).json({
                success: false,
                message: 'Validation error',
                errors: { id_reservation: 'Reservasi tidak ditemukan' }
            });
        }

        // Cek unique (1 reservation hanya 1 checkin)
        const existing = await prisma.checkin.findFirst({
            where: { id_reservation: parseInt(id_reservation) }
        });

        if (existing) {
            return res.status(422).json({
                success: false,
                message: 'Validation error',
                errors: { id_reservation: 'Reservasi ini sudah melakukan check-in' }
            });
        }

        const checkin = await prisma.checkin.create({
            data: {
                id_reservation: parseInt(id_reservation),
                item_list,
                checkin_date: new Date(checkin_date)
            },
            include: {
                reservation: {
                    include: {
                        mountain: true
                    }
                }
            }
        });

        res.status(201).json({
            success: true,
            message: 'Check-in created successfully',
            data: checkin
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



// ================= SHOW =================
exports.show = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const checkin = await prisma.checkin.findUnique({
            where: { id },
            include: {
                reservation: {
                    include: {
                        mountain: true
                    }
                }
            }
        });

        if (!checkin) {
            return res.status(404).json({
                success: false,
                message: 'Check-in not found'
            });
        }

        res.json({
            success: true,
            message: 'Check-in detail',
            data: checkin
        });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



// ================= UPDATE =================
exports.update = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const checkin = await prisma.checkin.findUnique({ where: { id } });

        if (!checkin) {
            return res.status(404).json({
                success: false,
                message: 'Check-in not found'
            });
        }

        const { id_reservation, item_list, checkin_date } = req.body;

        // Validasi optional
        if (id_reservation) {
            const reservation = await prisma.reservation.findUnique({
                where: { id: parseInt(id_reservation) }
            });

            if (!reservation) {
                return res.status(422).json({
                    success: false,
                    message: 'Validation error',
                    errors: { id_reservation: 'Reservasi tidak ditemukan' }
                });
            }

            // unique check (exclude current)
            const existing = await prisma.checkin.findFirst({
                where: {
                    id_reservation: parseInt(id_reservation),
                    NOT: { id }
                }
            });

            if (existing) {
                return res.status(422).json({
                    success: false,
                    message: 'Validation error',
                    errors: { id_reservation: 'Reservasi ini sudah digunakan' }
                });
            }
        }

        const updated = await prisma.checkin.update({
            where: { id },
            data: {
                ...(id_reservation && { id_reservation: parseInt(id_reservation) }),
                ...(item_list && { item_list }),
                ...(checkin_date && { checkin_date: new Date(checkin_date) })
            },
            include: {
                reservation: {
                    include: {
                        mountain: true
                    }
                }
            }
        });

        res.json({
            success: true,
            message: 'Check-in updated successfully',
            data: updated
        });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



// ================= DELETE =================
exports.destroy = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const checkin = await prisma.checkin.findUnique({ where: { id } });

        if (!checkin) {
            return res.status(404).json({
                success: false,
                message: 'Check-in not found'
            });
        }

        await prisma.checkin.delete({ where: { id } });

        res.json({
            success: true,
            message: 'Check-in deleted successfully'
        });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



// ================= GET BY RESERVATION =================
exports.getByReservation = async (req, res) => {
    try {
        const idReservation = parseInt(req.params.id);

        const checkin = await prisma.checkin.findFirst({
            where: { id_reservation: idReservation },
            include: {
                reservation: {
                    include: {
                        mountain: true
                    }
                }
            }
        });

        if (!checkin) {
            return res.status(404).json({
                success: false,
                message: 'Check-in not found for this reservation'
            });
        }

        res.json({
            success: true,
            message: 'Check-in detail',
            data: checkin
        });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};