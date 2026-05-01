const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

const DEFAULT_IMAGE = 'mountains/defaultMountainPics.jpg';

// ======================
// GET ALL
// ======================
exports.index = async (req, res) => {
    try {
        const data = await prisma.mountain.findMany({
            orderBy: { created_at: 'desc' }
        });

        res.json({
            success: true,
            message: 'List of mountains',
            data
        });

    } catch (err) {
        res.status(500).json({
            message: 'Failed to fetch mountains',
            error: err.message
        });
    }
};

// ======================
// CREATE
// ======================
exports.store = async (req, res) => {
    try {
        const {
            name,
            status,
            manager,
            quota,
            location,
            contact,
            price,
            duration,
            pos,
            image_type,
            image_url,
            image_path
        } = req.body;

        // VALIDASI
        if (!name || !status || !manager || !quota || !location || !contact || !price || !duration || !pos || !image_type) {
            return res.status(422).json({
                message: 'Validation failed'
            });
        }

        const image = handleImage(req, {
            image_type,
            image_url,
            image_path
        });

        const data = await prisma.mountain.create({
            data: {
                name,
                status,
                manager,
                quota: Number(quota),
                location,
                contact,
                price: Number(price),
                duration,
                pos,
                image
            }
        });

        res.status(201).json({
            message: 'Mountain created successfully',
            data
        });

    } catch (err) {
        res.status(500).json({
            message: 'Failed to create mountain',
            error: err.message
        });
    }
};

// ======================
// GET BY ID
// ======================
exports.show = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await prisma.mountain.findUnique({
            where: { id: Number(id) }
        });

        if (!data) {
            return res.status(404).json({
                message: 'Mountain not found'
            });
        }

        res.json(data);

    } catch (err) {
        res.status(500).json({
            message: 'Error',
            error: err.message
        });
    }
};

// ======================
// UPDATE
// ======================
exports.update = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await prisma.mountain.findUnique({
            where: { id: Number(id) }
        });

        if (!existing) {
            return res.status(404).json({
                message: 'Mountain not found'
            });
        }

        const {
            name,
            status,
            manager,
            quota,
            location,
            contact,
            price,
            duration,
            pos,
            image_type,
            image_url,
            image_path
        } = req.body;

        let image = existing.image;

        if (image_type !== 'keep') {

            // HAPUS FILE LAMA (kalau file lokal)
            if (
                existing.image &&
                existing.image !== DEFAULT_IMAGE &&
                !existing.image.startsWith('http')
            ) {
                const oldPath = path.join('uploads', existing.image);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            image = handleImage(req, {
                image_type,
                image_url,
                image_path
            });
        }

        const updated = await prisma.mountain.update({
            where: { id: Number(id) },
            data: {
                name,
                status,
                manager,
                quota: Number(quota),
                location,
                contact,
                price: Number(price),
                duration,
                pos,
                image
            }
        });

        res.json({
            message: 'Mountain updated successfully',
            data: updated
        });

    } catch (err) {
        res.status(500).json({
            message: 'Failed to update mountain',
            error: err.message
        });
    }
};

// ======================
// DELETE
// ======================
exports.destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await prisma.mountain.findUnique({
            where: { id: Number(id) }
        });

        if (!existing) {
            return res.status(404).json({
                message: 'Mountain not found'
            });
        }

        // hapus file
        if (
            existing.image &&
            existing.image !== DEFAULT_IMAGE &&
            !existing.image.startsWith('http')
        ) {
            const filePath = path.join('uploads', existing.image);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await prisma.mountain.delete({
            where: { id: Number(id) }
        });

        res.json({
            message: 'Mountain deleted successfully'
        });

    } catch (err) {
        res.status(500).json({
            message: 'Failed to delete mountain',
            error: err.message
        });
    }
};

// ======================
// HELPER IMAGE HANDLER
// ======================
function handleImage(req, { image_type, image_url, image_path }) {

    switch (image_type) {
        case 'file':
            if (req.file) {
                return `mountains/${req.file.filename}`;
            }
            return DEFAULT_IMAGE;

        case 'url':
            if (image_url && image_url.startsWith('http')) {
                return image_url;
            }
            return DEFAULT_IMAGE;

        case 'default':
        default:
            return image_path || DEFAULT_IMAGE;
    }
}

// ======================
// LAPORAN 3 BULAN
// ======================
exports.laporan3BulanTerakhir = async (req, res) => {
    try {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        const data = await prisma.reservation.groupBy({
            by: ['id_mountain'],
            _count: {
                id: true
            },
            _sum: {
                price: true
            },
            where: {
                created_at: {
                    gte: threeMonthsAgo
                }
            }
        });

        // join manual ke mountain
        const result = await Promise.all(
            data.map(async (item) => {
                const mountain = await prisma.mountain.findUnique({
                    where: { id: item.id_mountain }
                });

                return {
                    mountain_id: item.id_mountain,
                    nama_gunung: mountain?.name,
                    total_pendaki: item._count.id,
                    total_pendapatan: item._sum.price || 0
                };
            })
        );

        res.json({
            success: true,
            message: 'Laporan gunung 3 bulan terakhir',
            data: result.sort((a, b) => b.total_pendapatan - a.total_pendapatan)
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};