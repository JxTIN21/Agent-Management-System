const mongoose = require('mongoose');

const ListItemSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    notes: {
        type: String,
        trim: true
    },
    assignedTo: {
        type: mongoose.Schema.ObjectId,
        ref: 'Agent',
        required: true
    },
    batchId: {
        type: String,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('ListItem', ListItemSchema);