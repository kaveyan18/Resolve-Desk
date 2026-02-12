const express = require('express');
const {
    createComplaint,
    getComplaints,
    getComplaint,
    updateComplaint,
    getComplaintByUniqueId,
    getAnalytics,
    getPublicStats
} = require('../controllers/complaints');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/public/stats', getPublicStats);

// Protected routes
router.use(protect);

router.get('/analytics', authorize('Admin'), getAnalytics);
router.get('/track/:uid', getComplaintByUniqueId);

router
    .route('/')
    .get(getComplaints)
    .post(authorize('User'), createComplaint);

router
    .route('/:id')
    .get(getComplaint)
    .put(updateComplaint);

module.exports = router;
