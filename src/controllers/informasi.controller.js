const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

// GET ALL
exports.index = async (req, res) => {
    try {
        const data = await prisma.informasi.findMany();

        res.json({
            success: true,
            data
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// CREATE
exports.store = async (req, res) => {
    try {
        const { judul, deskripsi } = req.body;

        if (!judul || !deskripsi) {
            return res.status(422).json({
                success: false,
                message: 'Judul dan deskripsi wajib'
            });
        }

        let gambar = null;

        if (req.file) {
            gambar = `informasi/${req.file.filename}`;
        }

        const data = await prisma.informasi.create({
            data: {
                judul,
                deskripsi,
                gambar
            }
        });

        res.status(201).json({
            success: true,
            message: 'Informasi berhasil dibuat',
            data
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET BY ID
exports.show = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await prisma.informasi.findUnique({
            where: { id: Number(id) }
        });

        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Informasi tidak ditemukan'
            });
        }

        res.json({
            success: true,
            data
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// UPDATE
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { judul, deskripsi } = req.body;

        const existing = await prisma.informasi.findUnique({
            where: { id: Number(id) }
        });

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Informasi tidak ditemukan'
            });
        }

        let gambar = existing.gambar;

        if (req.file) {
            // hapus file lama
            if (existing.gambar) {
                const oldPath = path.join('uploads', existing.gambar);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            gambar = `informasi/${req.file.filename}`;
        }

        const updated = await prisma.informasi.update({
            where: { id: Number(id) },
            data: {
                judul,
                deskripsi,
                gambar
            }
        });

        res.json({
            success: true,
            message: 'Informasi berhasil diupdate',
            data: updated
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// DELETE
exports.destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await prisma.informasi.findUnique({
            where: { id: Number(id) }
        });

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Informasi tidak ditemukan'
            });
        }

        // hapus file
        if (existing.gambar) {
            const filePath = path.join('uploads', existing.gambar);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await prisma.informasi.delete({
            where: { id: Number(id) }
        });

        res.json({
            success: true,
            message: 'Informasi berhasil dihapus'
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};