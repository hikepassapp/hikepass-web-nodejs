const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');


// ================= GET CUSTOMERS =================
exports.getCustomers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: { role: 'customer' },
            orderBy: { created_at: 'desc' }
        });

        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};


// ================= GET ADMINS =================
exports.getAdmins = async (req, res) => {
    try {
        const admins = await prisma.user.findMany({
            where: { role: 'admin' },
            orderBy: { created_at: 'desc' }
        });

        res.json(admins);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};


// ================= CREATE USER =================
exports.store = async (req, res) => {
    try {
        const { name, email, password, role, posisi } = req.body;

        // Validasi manual
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'Field wajib diisi' });
        }

        if (!['admin', 'customer'].includes(role)) {
            return res.status(400).json({ message: 'Role tidak valid' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password minimal 6 karakter' });
        }

        // Cek email unik
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ message: 'Email sudah digunakan' });
        }

        // Hash password
        const hashed = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashed,
                role,
                posisi
            }
        });

        res.status(201).json({
            message: 'Data berhasil ditambahkan',
            data: user
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// ================= UPDATE USER =================
exports.update = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        const data = { ...req.body };

        // Kalau update password → hash ulang
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data
        });

        res.json({
            message: 'User updated successfully',
            data: updatedUser
        });

    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};


// ================= DELETE USER =================
exports.destroy = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        await prisma.user.delete({
            where: { id }
        });

        res.json({ message: 'Berhasil dihapus' });

    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};