const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const auth = require('../middlewares/auth.middleware');

router.use(auth);

router.get('/customers', UserController.getCustomers);
router.get('/admins', UserController.getAdmins);
router.post('/', UserController.store);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.destroy);

module.exports = router;