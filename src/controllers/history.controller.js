const prisma = require('../config/prisma');


// ================= INDEX =================
exports.index = async (req, res) => {
    try {
        const histories = await prisma.history.findMany({
            orderBy: { created_at: 'desc' },
            include: {
                checkout: {
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
                }
            }
        });

        res.json({
            success: true,
            message: 'List of histories',
            data: histories
        });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



// ================= STORE =================
exports.store = async (req, res) => {
    try {
        const { id_checkout } = req.body;

        if (!id_checkout) {
            return res.status(422).json({
                success: false,
                message: 'Validation error',
                errors: { id_checkout: 'Field wajib diisi' }
            });
        }

        // cek checkout ada
        const checkout = await prisma.checkout.findUnique({
            where: { id: parseInt(id_checkout) }
        });

        if (!checkout) {
            return res.status(422).json({
                success: false,
                message: 'Validation error',
                errors: { id_checkout: 'Check-out tidak ditemukan' }
            });
        }

        // cek unique
        const existing = await prisma.history.findFirst({
            where: { id_checkout: parseInt(id_checkout) }
        });

        if (existing) {
            return res.status(422).json({
                success: false,
                message: 'Validation error',
                errors: { id_checkout: 'Check-out ini sudah ada di history' }
            });
        }

        const history = await prisma.history.create({
            data: {
                id_checkout: parseInt(id_checkout)
            },
            include: {
                checkout: {
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
                }
            }
        });

        res.status(201).json({
            success: true,
            message: 'History created successfully',
            data: history
        });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



// ================= SHOW =================
exports.show = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const history = await prisma.history.findUnique({
            where: { id },
            include: {
                checkout: {
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
                }
            }
        });

        if (!history) {
            return res.status(404).json({
                success: false,
                message: 'History not found'
            });
        }

        // Format custom (sama seperti Laravel)
        const formatted = {
            id: history.id,
            id_checkout: history.id_checkout,
            checkout_date: history.checkout?.checkout_date,
            checkout_item_list: history.checkout?.item_list,
            checkin_date: history.checkout?.checkin?.checkin_date,
            checkin_item_list: history.checkout?.checkin?.item_list,
            reservation: {
                id_reservation: history.checkout?.checkin?.reservation?.id,
                name: history.checkout?.checkin?.reservation?.name,
                nik: history.checkout?.checkin?.reservation?.nik,
                gender: history.checkout?.checkin?.reservation?.gender,
                phone_number: history.checkout?.checkin?.reservation?.phone_number,
                address: history.checkout?.checkin?.reservation?.address,
                citizen: history.checkout?.checkin?.reservation?.citizen,
                id_card: history.checkout?.checkin?.reservation?.id_card,
                price: history.checkout?.checkin?.reservation?.price,
                start_date: history.checkout?.checkin?.reservation?.start_date,
            },
            mountain: {
                id: history.checkout?.checkin?.reservation?.mountain?.id,
                name: history.checkout?.checkin?.reservation?.mountain?.name
            },
            created_at: history.created_at,
            updated_at: history.updated_at
        };

        res.json({
            success: true,
            message: 'History detail',
            data: formatted
        });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



// ================= UPDATE =================
exports.update = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const history = await prisma.history.findUnique({ where: { id } });

        if (!history) {
            return res.status(404).json({
                success: false,
                message: 'History not found'
            });
        }

        const { id_checkout } = req.body;

        if (id_checkout) {
            const checkout = await prisma.checkout.findUnique({
                where: { id: parseInt(id_checkout) }
            });

            if (!checkout) {
                return res.status(422).json({
                    success: false,
                    message: 'Validation error',
                    errors: { id_checkout: 'Check-out tidak ditemukan' }
                });
            }

            const existing = await prisma.history.findFirst({
                where: {
                    id_checkout: parseInt(id_checkout),
                    NOT: { id }
                }
            });

            if (existing) {
                return res.status(422).json({
                    success: false,
                    message: 'Validation error',
                    errors: { id_checkout: 'Sudah digunakan' }
                });
            }
        }

        const updated = await prisma.history.update({
            where: { id },
            data: {
                ...(id_checkout && { id_checkout: parseInt(id_checkout) })
            },
            include: {
                checkout: {
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
                }
            }
        });

        res.json({
            success: true,
            message: 'History updated successfully',
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

        const history = await prisma.history.findUnique({ where: { id } });

        if (!history) {
            return res.status(404).json({
                success: false,
                message: 'History not found'
            });
        }

        await prisma.history.delete({ where: { id } });

        res.json({
            success: true,
            message: 'History deleted successfully'
        });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



// ================= GET BY CHECKOUT =================
exports.getByCheckout = async (req, res) => {
    try {
        const idCheckout = parseInt(req.params.id);

        const history = await prisma.history.findFirst({
            where: { id_checkout: idCheckout },
            include: {
                checkout: {
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
                }
            }
        });

        if (!history) {
            return res.status(404).json({
                success: false,
                message: 'History not found for this check-out'
            });
        }

        res.json({
            success: true,
            message: 'History detail',
            data: history
        });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



// ================= GET BY RESERVATION =================
exports.getByReservation = async (req, res) => {
    try {
        const idReservation = parseInt(req.params.id);

        const history = await prisma.history.findFirst({
            where: {
                checkout: {
                    checkin: {
                        id_reservation: idReservation
                    }
                }
            },
            include: {
                checkout: {
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
                }
            }
        });

        if (!history) {
            return res.status(404).json({
                success: false,
                message: 'History not found for this reservation'
            });
        }

        res.json({
            success: true,
            message: 'History detail',
            data: history
        });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



// ================= CREATE FROM CHECKOUT =================
exports.createFromCheckout = async (req, res) => {
    try {
        const idCheckout = parseInt(req.params.id);

        const checkout = await prisma.checkout.findUnique({
            where: { id: idCheckout }
        });

        if (!checkout) {
            return res.status(404).json({
                success: false,
                message: 'Check-out not found'
            });
        }

        const existing = await prisma.history.findFirst({
            where: { id_checkout: idCheckout }
        });

        if (existing) {
            return res.status(422).json({
                success: false,
                message: 'History already exists for this check-out'
            });
        }

        const history = await prisma.history.create({
            data: { id_checkout: idCheckout },
            include: {
                checkout: {
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
                }
            }
        });

        res.status(201).json({
            success: true,
            message: 'History created successfully from check-out',
            data: history
        });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};