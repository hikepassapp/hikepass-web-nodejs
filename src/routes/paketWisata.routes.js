const express = require('express');
const router = express.Router();
const paketWisataController = require('../controllers/paketWisata.controller');
const upload = require('../middlewares/upload.middleware');
const { validatePaketWisata, validatePaketWisataUpdate } = require('../validators/paketWisata.validator');
const { validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

router.get('/', paketWisataController.getAllPaketWisata);
router.get('/:id', paketWisataController.getPaketWisataById);
router.post('/', upload.single('image'), validatePaketWisata, handleValidation, paketWisataController.createPaketWisata);
router.put('/:id', upload.single('image'), validatePaketWisataUpdate, handleValidation, paketWisataController.updatePaketWisata);
router.delete('/:id', paketWisataController.deletePaketWisata);

module.exports = router;