const express = require('express');
const { getNotifications, markAsRead } = require('../controllers/notifications');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.put('/:id', markAsRead);

module.exports = router;
