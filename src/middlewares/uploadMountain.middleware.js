const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/mountains');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

module.exports = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});