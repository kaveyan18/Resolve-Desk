const express = require('express');
const { register, login, getMe, updateDetails, getAllUsers, updateUser } = require('../controllers/auth');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);

// Admin only routes
router.use(protect);
router.use(authorize('Admin'));

router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);

module.exports = router;
