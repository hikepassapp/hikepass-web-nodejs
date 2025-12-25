const express = require('express');
const router = express.Router();
const beritaEventController = require('../controllers/beritaEvent.controller');
const upload = require('../middlewares/upload.middleware');
const { validateBeritaEvent, validateBeritaEventUpdate } = require('../validators/beritaEvent.validator');
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

router.get('/', beritaEventController.getAllBeritaEvent);
router.get('/:id', beritaEventController.getBeritaEventById);
router.post('/', upload.single('image'), validateBeritaEvent, handleValidation, beritaEventController.createBeritaEvent);
router.put('/:id', upload.single('image'), validateBeritaEventUpdate, handleValidation, beritaEventController.updateBeritaEvent);
router.delete('/:id', beritaEventController.deleteBeritaEvent);

module.exports = router;