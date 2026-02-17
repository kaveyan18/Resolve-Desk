const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Settings = require('../models/Settings');
const Message = require('../models/Message');

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private (User)
exports.createComplaint = async (req, res) => {
    try {
        req.body.user = req.user.id;

        // Check if auto-assignment is enabled globally
        let settings = await Settings.findOne();
        if (!settings) settings = await Settings.create({});

        if (settings.isAutoAssignEnabled) {
            // Auto-assignment logic based on Category/Skill
            const category = req.body.category;

            // Try matching skill first, fallback to all staff
            let staff = await User.find({ role: 'Staff', skills: category });
            if (staff.length === 0) {
                staff = await User.find({ role: 'Staff' });
            }

            if (staff.length > 0) {
                // Find staff member with least active complaints among candidates
                const staffList = await Promise.all(staff.map(async (member) => {
                    const count = await Complaint.countDocuments({
                        assignedTo: member._id,
                        status: { $in: ['Assigned', 'In-Progress'] }
                    });
                    return { member, count };
                }));

                // Sort by count ascending
                staffList.sort((a, b) => a.count - b.count);

                // Assign to the most available candidate
                req.body.assignedTo = staffList[0].member._id;
                req.body.status = 'Assigned';
            }
        }

        const complaint = await Complaint.create(req.body);

        // If assigned, create notification for staff and user
        if (complaint.assignedTo) {
            await Notification.create({
                user: complaint.assignedTo,
                message: `New complaint auto-assigned: "${complaint.title}"`,
                complaint: complaint._id,
                type: 'Assignment'
            });

            await Notification.create({
                user: complaint.user,
                message: `Your complaint "${complaint.title}" has been assigned to a staff member for resolution.`,
                complaint: complaint._id,
                type: 'Assignment'
            });
        }

        res.status(201).json({
            success: true,
            data: complaint
        });
    } catch (err) {
        console.error('Error in createComplaint:', err);
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

// Internal helper for auto-assignment
const runAutoAssignmentInternal = async () => {
    try {
        const settings = await Settings.findOne();
        if (!settings || !settings.isAutoAssignEnabled) return 0;

        const openComplaints = await Complaint.find({ status: 'Open' });
        if (openComplaints.length === 0) return 0;

        const staff = await User.find({ role: 'Staff' });
        if (staff.length === 0) return 0;

        let assignedCount = 0;
        for (const complaint of openComplaints) {
            let potentialStaff = await User.find({ role: 'Staff', skills: complaint.category });
            if (potentialStaff.length === 0) potentialStaff = staff;

            const staffList = await Promise.all(potentialStaff.map(async (member) => {
                const count = await Complaint.countDocuments({
                    assignedTo: member._id,
                    status: { $in: ['Assigned', 'In-Progress'] }
                });
                return { member, count };
            }));

            staffList.sort((a, b) => a.count - b.count);
            const bestStaff = staffList[0].member;

            complaint.assignedTo = bestStaff._id;
            complaint.status = 'Assigned';
            await complaint.save();

            await Notification.create({
                user: bestStaff._id,
                message: `Complaint auto-assigned: "${complaint.title}"`,
                complaint: complaint._id,
                type: 'Assignment'
            });

            await Notification.create({
                user: complaint.user,
                message: `Your complaint "${complaint.title}" has been auto-assigned to ${bestStaff.name} for resolution.`,
                complaint: complaint._id,
                type: 'Assignment'
            });

            assignedCount++;
        }
        return assignedCount;
    } catch (err) {
        console.error('Error in runAutoAssignmentInternal:', err);
        return 0;
    }
};

exports.runAutoAssignmentInternal = runAutoAssignmentInternal;

// Internal helper for SLA Escalation
const runSLAEscalationInternal = async () => {
    try {
        const overdueComplaints = await Complaint.find({
            status: { $nin: ['Resolved', 'Closed'] },
            sla_deadline: { $lt: new Date() },
            isEscalated: false
        });

        if (overdueComplaints.length === 0) return 0;

        const admins = await User.find({ role: 'Admin' });

        let escalatedCount = 0;
        for (const complaint of overdueComplaints) {
            complaint.isEscalated = true;
            complaint.priority = 'Urgent';
            await complaint.save();

            // Notify Admins
            for (const admin of admins) {
                await Notification.create({
                    user: admin._id,
                    message: `SLA BREACH: Complaint "${complaint.title}" (${complaint.complaint_unique_id}) has exceeded its deadline!`,
                    complaint: complaint._id,
                    type: 'Escalation'
                });
            }

            // Notify Assigned Staff
            if (complaint.assignedTo) {
                await Notification.create({
                    user: complaint.assignedTo,
                    message: `URGENT: Complaint "${complaint.title}" assigned to you has breached SLA!`,
                    complaint: complaint._id,
                    type: 'Escalation'
                });
            }

            escalatedCount++;
        }
        return escalatedCount;
    } catch (err) {
        console.error('Error in runSLAEscalationInternal:', err);
        return 0;
    }
};

exports.runSLAEscalationInternal = runSLAEscalationInternal;

// @desc    Get system settings
// @route   GET /api/complaints/settings
// @access  Private (Admin)
exports.getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) settings = await Settings.create({});
        res.status(200).json({ success: true, data: settings });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update system settings
// @route   PUT /api/complaints/settings
// @access  Private (Admin)
exports.updateSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) settings = await Settings.create({});

        settings.isAutoAssignEnabled = req.body.isAutoAssignEnabled !== undefined ? req.body.isAutoAssignEnabled : settings.isAutoAssignEnabled;
        settings.autoAssignIntervalMinutes = req.body.autoAssignIntervalMinutes || settings.autoAssignIntervalMinutes;

        await settings.save();
        res.status(200).json({ success: true, data: settings });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Manual trigger of auto-assignment (for compatibility)
// @route   POST /api/complaints/auto-assign
// @access  Private (Admin)
exports.autoAssignComplaints = async (req, res) => {
    const count = await runAutoAssignmentInternal();
    res.status(200).json({
        success: true,
        message: `Successfully auto-assigned ${count} complaints.`,
        count
    });
};

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
// @desc    Get messages for a complaint
// @route   GET /api/complaints/:id/messages
// @access  Private
exports.getComplaintMessages = async (req, res) => {
    try {
        const messages = await Message.find({ complaint: req.params.id })
            .populate('sender', 'name role')
            .sort('createdAt');

        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Export complaints to CSV
// @route   GET /api/complaints/export
// @access  Private (Admin)
exports.exportComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate('user', 'name email')
            .populate('assignedTo', 'name email')
            .sort('-createdAt');

        // CSV Header
        let csv = 'ID,Date,User,Email,Title,Category,Status,Priority,Assigned To,Deadline,Escalated\n';

        // Add rows
        complaints.forEach(c => {
            const date = new Date(c.createdAt).toLocaleDateString();
            const deadline = c.sla_deadline ? new Date(c.sla_deadline).toLocaleDateString() : 'N/A';
            const userName = c.user?.name || 'Deleted User';
            const userEmail = c.user?.email || 'N/A';
            const staffName = c.assignedTo?.name || 'Unassigned';

            // Escape commas and quotes for CSV
            const title = `"${c.title.replace(/"/g, '""')}"`;

            csv += `${c.complaint_unique_id},${date},${userName},${userEmail},${title},${c.category},${c.status},${c.priority},${staffName},${deadline},${c.isEscalated}\n`;
        });

        // Set response headers
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=complaints-report-${Date.now()}.csv`);
        res.status(200).send(csv);

    } catch (err) {
        console.error('Export error:', err);
        res.status(500).json({ success: false, message: 'Failed to generate report' });
    }
};
