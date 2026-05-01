const prisma = require('../config/prisma');


// ================= INDEX =================
// Ambil checkout yang BELUM punya history
exports.index = async (req, res) => {
    try {
        const checkouts = await prisma.checkout.findMany({
            where: {
                history: null // whereDoesntHave('history')
            },
            include: {
                checkin: {
                    include: {
                        reservation: {
                            include: {
                                mountain: true
                            }
                        }
                    }
                }
            }
        });

        res.json({
            success: true,
            message: 'List of check-outs',
            data: checkouts
        });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



// ================= STORE =================
exports.store = async (req, res) => {
    try {
        const { id_checkin, item_list, checkout_date } = req.body;

        // Validasi dasar
        if (!id_checkin || !item_list || !checkout_date) {
            return res.status(422).json({
                success: false,
                message: 'Validation error',
                errors: 'Semua field wajib diisi'
            });
        }

        // cek checkin ada
        const checkin = await prisma.checkin.findUnique({
            where: { id: parseInt(id_checkin) }
        });

        if (!checkin) {
            return res.status(422).json({
                success: false,
                message: 'Validation error',
                errors: { id_checkin: 'Check-in tidak ditemukan' }
            });
        }

        // cek unique (1 checkin hanya 1 checkout)
        const existing = await prisma.checkout.findFirst({
            where: { id_checkin: parseInt(id_checkin) }
        });

        if (existing) {
            return res.status(422).json({
                success: false,
                message: 'Validation error',
                errors: { id_checkin: 'Check-in ini sudah melakukan check-out' }
            });
        }

        const checkoutDate = new Date(checkout_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // validasi >= hari ini
        if (checkoutDate < today) {
            return res.status(422).json({
                success: false,
                message: 'Validation error',
                errors: { checkout_date: 'Tanggal check-out tidak boleh sebelum hari ini' }
            });
        }

        // validasi >= checkin_date
        if (checkoutDate < new Date(checkin.checkin_date)) {
            return res.status(422).json({
                success: false,
                message: 'Validation error',
                errors: { checkout_date: 'Tanggal check-out tidak boleh sebelum tanggal check-in' }
            });
        }

        const checkout = await prisma.checkout.create({
            data: {
                id_checkin: parseInt(id_checkin),
                item_list,
                checkout_date: checkoutDate
            },
            include: {
                checkin: {
                    include: {
                        reservation: {
                            include: {
                                mountain: true
                            }
                        }
                    }
                }
            }
        });

        res.status(201).json({
            success: true,
            message: 'Check-out created successfully',
            data: checkout
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

        const checkout = await prisma.checkout.findUnique({
            where: { id },
            include: {
                checkin: {
                    include: {
                        reservation: {
                            include: {
                                mountain: true
                            }
                        }
                    }
                }
            }
        });

        if (!checkout) {
            return res.status(404).json({
                success: false,
                message: 'Check-out not found'
            });
        }

        res.json({
            success: true,
            message: 'Check-out detail',
            data: checkout
        });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



// ================= UPDATE =================
exports.update = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const checkout = await prisma.checkout.findUnique({ where: { id } });

        if (!checkout) {
            return res.status(404).json({
                success: false,
                message: 'Check-out not found'
            });
        }

        const { id_checkin, item_list, checkout_date } = req.body;

        // validasi id_checkin
        if (id_checkin) {
            const checkin = await prisma.checkin.findUnique({
                where: { id: parseInt(id_checkin) }
            });

            if (!checkin) {
                return res.status(422).json({
                    success: false,
                    message: 'Validation error',
                    errors: { id_checkin: 'Check-in tidak ditemukan' }
                });
            }

            // unique check (exclude current)
            const existing = await prisma.checkout.findFirst({
                where: {
                    id_checkin: parseInt(id_checkin),
                    NOT: { id }
                }
            });

            if (existing) {
                return res.status(422).json({
                    success: false,
                    message: 'Validation error',
                    errors: { id_checkin: 'Check-in ini sudah digunakan' }
                });
            }
        }

        // validasi tanggal
        if (checkout_date) {
            const checkin = await prisma.checkin.findUnique({
                where: { id: checkout.id_checkin }
            });

            if (new Date(checkout_date) < new Date(checkin.checkin_date)) {
                return res.status(422).json({
                    success: false,
                    message: 'Validation error',
                    errors: { checkout_date: 'Tanggal check-out tidak boleh sebelum tanggal check-in' }
                });
            }
        }

        const updated = await prisma.checkout.update({
            where: { id },
            data: {
                ...(id_checkin && { id_checkin: parseInt(id_checkin) }),
                ...(item_list && { item_list }),
                ...(checkout_date && { checkout_date: new Date(checkout_date) })
            },
            include: {
                checkin: {
                    include: {
                        reservation: {
                            include: {
                                mountain: true
                            }
                        }
                    }
                }
            }
        });

        res.json({
            success: true,
            message: 'Check-out updated successfully',
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

        const checkout = await prisma.checkout.findUnique({ where: { id } });

        if (!checkout) {
            return res.status(404).json({
                success: false,
                message: 'Check-out not found'
            });
        }

        await prisma.checkout.delete({ where: { id } });

        res.json({
            success: true,
            message: 'Check-out deleted successfully'
        });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



// ================= GET BY CHECKIN =================
exports.getByCheckin = async (req, res) => {
    try {
        const idCheckin = parseInt(req.params.id);

        const checkout = await prisma.checkout.findFirst({
            where: { id_checkin: idCheckin },
            include: {
                checkin: {
                    include: {
                        reservation: {
                            include: {
                                mountain: true
                            }
                        }
                    }
                }
            }
        });

        if (!checkout) {
            return res.status(404).json({
                success: false,
                message: 'Check-out not found for this check-in'
            });
        }

        res.json({
            success: true,
            message: 'Check-out detail',
            data: checkout
        });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



// ================= GET BY RESERVATION =================
exports.getByReservation = async (req, res) => {
    try {
        const idReservation = parseInt(req.params.id);

        const checkout = await prisma.checkout.findFirst({
            where: {
                checkin: {
                    id_reservation: idReservation
                }
            },
            include: {
                checkin: {
                    include: {
                        reservation: {
                            include: {
                                mountain: true
                            }
                        }
                    }
                }
            }
        });

        if (!checkout) {
            return res.status(404).json({
                success: false,
                message: 'Check-out not found for this reservation'
            });
        }

        res.json({
            success: true,
            message: 'Check-out detail',
            data: checkout
        });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};