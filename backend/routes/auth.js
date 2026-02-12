const express = require('express');
const { register, login, getMe, updateDetails, getAllUsers } = require('../controllers/auth');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.get('/users', protect, authorize('Admin'), getAllUsers);

module.exports = router;
