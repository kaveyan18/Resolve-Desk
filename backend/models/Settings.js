const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    isAutoAssignEnabled: {
        type: Boolean,
        default: true
    },
    autoAssignIntervalMinutes: {
        type: Number,
        default: 5
    }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
