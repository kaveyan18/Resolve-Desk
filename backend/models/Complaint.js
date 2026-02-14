const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    complaint_unique_id: {
        type: String,
        unique: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['Plumbing', 'Electrical', 'Facility', 'IT', 'Other']
    },
    status: {
        type: String,
        enum: ['Open', 'Assigned', 'In-Progress', 'Resolved', 'Closed'],
        default: 'Open'
    },
    assignedTo: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: null
    },
    attachment: {
        type: String,
        default: null
    },
    resolutionNotes: {
        type: String,
        default: ''
    },
    feedback: {
        rating: {
            type: Number,
            min: 1,
            max: 5,
            default: null
        },
        comment: {
            type: String,
            default: ''
        }
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Medium'
    },
    isEscalated: {
        type: Boolean,
        default: false
    },
    sla_deadline: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Generate unique ID before saving
complaintSchema.pre('save', async function () {
    if (!this.complaint_unique_id) {
        const count = await this.constructor.countDocuments();
        this.complaint_unique_id = `COMP-${1000 + count + 1}`;
    }

    // Set default SLA (e.g., 48 hours for Open complaints)
    if (!this.sla_deadline) {
        this.sla_deadline = new Date(Date.now() + 48 * 60 * 60 * 1000);
    }
});

module.exports = mongoose.model('Complaint', complaintSchema);
