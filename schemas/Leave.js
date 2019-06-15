const mongoose = require('mongoose');

const leaveSchema = mongoose.Schema({

    reason: {
        type: String,
        required: true,
    },
    sender_email: {
        type: String,
        required: true,
    },
    reciever_email: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'pending'
    },
    from:
    {
        type: String,
        required: true
    },
    to:
    {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('LeaveSchema', leaveSchema);
