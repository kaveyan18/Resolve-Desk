const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private (User)
exports.createComplaint = async (req, res) => {
    try {
        req.body.user = req.user.id;

        const complaint = await Complaint.create(req.body);

        res.status(201).json({
            success: true,
            data: complaint
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private (Admin/Staff)
exports.getComplaints = async (req, res) => {
    try {
        let query;

        // Admin sees everything, Staff sees assigned, User sees their own
        if (req.user.role === 'Admin') {
            query = Complaint.find().populate('user', 'name email').populate('assignedTo', 'name email');
        } else if (req.user.role === 'Staff') {
            query = Complaint.find({ assignedTo: req.user.id }).populate('user', 'name email');
        } else {
            query = Complaint.find({ user: req.user.id }).populate('assignedTo', 'name email');
        }

        const complaints = await query.sort('-createdAt');

        res.status(200).json({
            success: true,
            count: complaints.length,
            data: complaints
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
exports.getComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate('user', 'name email')
            .populate('assignedTo', 'name email');

        if (!complaint) {
            return res.status(404).json({ success: false, message: 'Complaint not found' });
        }

        // Check ownership
        if (req.user.role !== 'Admin' && complaint.user._id.toString() !== req.user.id && complaint.assignedTo?._id.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        res.status(200).json({ success: true, data: complaint });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update complaint (Status/Assignment)
// @route   PUT /api/complaints/:id
// @access  Private (Admin/Staff)
exports.updateComplaint = async (req, res) => {
    try {
        let complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ success: false, message: 'Complaint not found' });
        }

        const oldStatus = complaint.status;
        const oldStaff = complaint.assignedTo?.toString();

        // Update logic based on role
        if (req.user.role === 'User') {
            // Users can only update feedback for their own complaints
            if (complaint.user.toString() !== req.user.id) {
                return res.status(401).json({ success: false, message: 'Not authorized to update this complaint' });
            }

            // Only allow feedback updates if complaint is Resolved or Closed
            if (complaint.status !== 'Resolved' && complaint.status !== 'Closed') {
                return res.status(400).json({ success: false, message: 'Can only provide feedback for resolved or closed complaints' });
            }

            if (req.body.feedback) {
                complaint.feedback = {
                    rating: req.body.feedback.rating,
                    comment: req.body.feedback.comment
                };
            }

            await complaint.save();
        } else if (req.user.role === 'Staff') {
            if (complaint.assignedTo.toString() !== req.user.id) {
                return res.status(401).json({ success: false, message: 'Not authorized to update this complaint' });
            }
            // Staff can update status and resolution notes
            if (req.body.status) complaint.status = req.body.status;
            if (req.body.resolutionNotes) complaint.resolutionNotes = req.body.resolutionNotes;

            await complaint.save();
        } else if (req.user.role === 'Admin') {
            // Admin can update status, assignedTo, and resolutionNotes
            if (req.body.status) complaint.status = req.body.status;
            if (req.body.assignedTo) complaint.assignedTo = req.body.assignedTo;
            if (req.body.resolutionNotes) complaint.resolutionNotes = req.body.resolutionNotes;

            // If assigned, update status to Assigned
            if (req.body.assignedTo && complaint.status === 'Open') {
                complaint.status = 'Assigned';
            }

            await complaint.save();
        }

        // Create notification for user if status changed
        if (complaint.status !== oldStatus) {
            await Notification.create({
                user: complaint.user,
                message: `Your complaint "${complaint.title}" status has been updated to ${complaint.status}.`,
                complaint: complaint._id,
                type: 'StatusChange'
            });
        }

        // Create notification for user if staff assigned/changed
        if (req.user.role === 'Admin' && req.body.assignedTo && req.body.assignedTo !== oldStaff) {
            await Notification.create({
                user: complaint.user,
                message: `A staff member has been assigned to your complaint "${complaint.title}".`,
                complaint: complaint._id,
                type: 'Assignment'
            });

            // Also notify the staff member
            await Notification.create({
                user: req.body.assignedTo,
                message: `You have been assigned a new complaint: "${complaint.title}".`,
                complaint: complaint._id,
                type: 'Assignment'
            });
        }

        res.status(200).json({ success: true, data: complaint });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get single complaint by unique ID
// @route   GET /api/complaints/track/:uid
// @access  Private
exports.getComplaintByUniqueId = async (req, res) => {
    try {
        const complaint = await Complaint.findOne({ complaint_unique_id: req.params.uid })
            .populate('user', 'name email')
            .populate('assignedTo', 'name email');

        if (!complaint) {
            return res.status(404).json({ success: false, message: 'Complaint not found' });
        }

        // Check ownership
        if (req.user.role !== 'Admin' && complaint.user._id.toString() !== req.user.id && complaint.assignedTo?._id.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        res.status(200).json({ success: true, data: complaint });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get analytics for Admin
// @route   GET /api/complaints/analytics
// @access  Private (Admin)
exports.getAnalytics = async (req, res) => {
    try {
        const totalComplaints = await Complaint.countDocuments();
        const totalUsers = await User.countDocuments({ role: 'User' });
        const totalStaff = await User.countDocuments({ role: 'Staff' });

        // Complaints by status
        const statusCounts = await Complaint.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Complaints by category
        const categoryCounts = await Complaint.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        // Recent complaints (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentStats = await Complaint.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalComplaints,
                totalUsers,
                totalStaff,
                statusCounts,
                categoryCounts,
                recentStats
            }
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get public stats for home page
// @route   GET /api/complaints/public/stats
// @access  Public
exports.getPublicStats = async (req, res) => {
    try {
        const totalComplaints = await Complaint.countDocuments();
        const resolvedComplaints = await Complaint.countDocuments({ status: 'Resolved' });
        const totalStaff = await User.countDocuments({ role: 'Staff' });

        res.status(200).json({
            success: true,
            data: {
                totalComplaints,
                resolvedComplaints,
                totalStaff
            }
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
