const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');

// ================= REGISTER =================
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validasi sederhana
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Semua field wajib diisi' });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: 'Password minimal 8 karakter' });
        }

        // Cek email
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ message: 'Email sudah digunakan' });
        }

        // Hash password
        const hashed = await bcrypt.hash(password, 10);

        // Simpan user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashed,
                role: 'customer'
            }
        });

        // Generate token
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        return res.status(201).json({
            message: 'Register berhasil',
            access_token: accessToken,
            refresh_token: refreshToken,
            user
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};



// ================= LOGIN =================
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Email atau password salah' });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ message: 'Email atau password salah' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        return res.json({
            message: 'Login berhasil',
            access_token: accessToken,
            refresh_token: refreshToken,
            user
        });

    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};



// ================= LOGOUT =================
exports.logout = async (req, res) => {
    // JWT stateless → logout di client (hapus token)
    return res.json({ message: 'Logout berhasil' });
};



// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Email tidak ditemukan' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const otpHash = await bcrypt.hash(otp, 10);

        const expiredAt = new Date(Date.now() + 5 * 60 * 1000); // 5 menit

        await prisma.passwordOtp.upsert({
            where: { email },
            update: {
                otp_hash: otpHash,
                expired_at: expiredAt
            },
            create: {
                email,
                otp_hash: otpHash,
                expired_at: expiredAt
            }
        });

        // 🔥 sementara: tampilkan OTP di console
        console.log(`OTP untuk ${email}: ${otp}`);

        return res.json({
            message: 'OTP berhasil dikirim (cek console server)',
        });

    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};



// ================= VERIFY OTP =================
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const record = await prisma.passwordOtp.findUnique({
            where: { email }
        });

        if (!record) {
            return res.status(422).json({ message: 'OTP tidak ditemukan' });
        }

        if (new Date() > record.expired_at) {
            return res.status(422).json({ message: 'OTP kadaluarsa' });
        }

        const valid = await bcrypt.compare(otp, record.otp_hash);
        if (!valid) {
            return res.status(422).json({ message: 'OTP salah' });
        }

        return res.json({ message: 'OTP valid' });

    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};



// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (password.length < 8) {
            return res.status(400).json({ message: 'Password minimal 8 karakter' });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        const hashed = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { email },
            data: { password: hashed }
        });

        // hapus OTP
        await prisma.passwordOtp.delete({
            where: { email }
        });

        return res.json({
            message: 'Password berhasil direset'
        });

    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};



// ================= REFRESH TOKEN =================
exports.refreshToken = (req, res) => {
    const { token } = req.body;

    if (!token) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        const newAccessToken = generateAccessToken({
            id: decoded.id,
            email: decoded.email
        });

        res.json({ access_token: newAccessToken });

    } catch (err) {
        return res.sendStatus(403);
    }
};