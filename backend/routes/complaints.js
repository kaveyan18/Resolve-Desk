const express = require('express');
const {
    createComplaint,
    getComplaints,
    getComplaint,
    updateComplaint,
    getComplaintByUniqueId,
    getAnalytics,
    getPublicStats,
    autoAssignComplaints,
    getSettings,
    updateSettings,
    getComplaintMessages,
    exportComplaints
} = require('../controllers/complaints');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/public/stats', getPublicStats);

// Protected routes
router.use(protect);

router.get('/analytics', authorize('Admin'), getAnalytics);
router.get('/export', authorize('Admin'), exportComplaints);
router.post('/auto-assign', authorize('Admin'), autoAssignComplaints);
router.get('/settings', authorize('Admin'), getSettings);
router.put('/settings', authorize('Admin'), updateSettings);
router.get('/track/:uid', getComplaintByUniqueId);

router
    .route('/')
    .get(getComplaints)
    .post(authorize('User'), createComplaint);

router
    .route('/:id')
    .get(getComplaint)
    .put(updateComplaint);

router.get('/:id/messages', getComplaintMessages);

module.exports = router;
