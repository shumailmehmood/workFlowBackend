const mongoose = require('mongoose');

const meetingDistributionSchema = mongoose.Schema({

    topic_id: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    sender_email: {
        type: String,
        required: true,
    },
    reciever_email: {
        type: String,
        required: true,
    },
    status:
    {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model('MeetingDistributionSchema', meetingDistributionSchema);
