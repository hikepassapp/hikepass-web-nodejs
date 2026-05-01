const multer = require('multer');
const fs = require('fs');

// pastikan folder ada
const uploadPath = 'uploads/id_card';
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

// filter file (hanya gambar)
const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('File harus berupa gambar'), false);
    }
};

module.exports = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB (sesuai Laravel kamu)
    }
});