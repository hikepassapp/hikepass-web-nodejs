const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

// GET ALL
exports.index = async (req, res) => {
    try {
        const data = await prisma.laporan.findMany({
            orderBy: { created_at: 'desc' }
        });

        res.json({
            success: true,
            data
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// CREATE
exports.store = async (req, res) => {
    try {
        const {
            nama_pelapor,
            tanggal_kejadian,
            lokasi_kejadian,
            deskripsi_kejadian
        } = req.body;

        // Validasi manual
        if (!nama_pelapor || !tanggal_kejadian || !lokasi_kejadian || !deskripsi_kejadian) {
            return res.status(422).json({
                success: false,
                message: 'Semua field wajib diisi'
            });
        }

        let foto_bukti = null;

        if (req.file) {
            foto_bukti = `laporan/${req.file.filename}`;
        }

        const data = await prisma.laporan.create({
            data: {
                nama_pelapor,
                tanggal_kejadian: new Date(tanggal_kejadian),
                lokasi_kejadian,
                deskripsi_kejadian,
                foto_bukti
            }
        });

        res.status(201).json({
            success: true,
            message: 'Laporan berhasil dibuat',
            data
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// GET BY ID
exports.show = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await prisma.laporan.findUnique({
            where: { id: Number(id) }
        });

        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Laporan tidak ditemukan'
            });
        }

        res.json({
            success: true,
            data
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// UPDATE
exports.update = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await prisma.laporan.findUnique({
            where: { id: Number(id) }
        });

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Laporan tidak ditemukan'
            });
        }

        const {
            nama_pelapor,
            tanggal_kejadian,
            lokasi_kejadian,
            deskripsi_kejadian
        } = req.body;

        let foto_bukti = existing.foto_bukti;

        if (req.file) {
            // hapus file lama
            if (existing.foto_bukti) {
                const oldPath = path.join('uploads', existing.foto_bukti);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            foto_bukti = `laporan/${req.file.filename}`;
        }

        const updated = await prisma.laporan.update({
            where: { id: Number(id) },
            data: {
                nama_pelapor,
                tanggal_kejadian: tanggal_kejadian ? new Date(tanggal_kejadian) : undefined,
                lokasi_kejadian,
                deskripsi_kejadian,
                foto_bukti
            }
        });

        res.json({
            success: true,
            message: 'Laporan berhasil diupdate',
            data: updated
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// DELETE
exports.destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await prisma.laporan.findUnique({
            where: { id: Number(id) }
        });

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Laporan tidak ditemukan'
            });
        }

        // hapus file
        if (existing.foto_bukti) {
            const filePath = path.join('uploads', existing.foto_bukti);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await prisma.laporan.delete({
            where: { id: Number(id) }
        });

        res.json({
            success: true,
            message: 'Laporan berhasil dihapus'
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};