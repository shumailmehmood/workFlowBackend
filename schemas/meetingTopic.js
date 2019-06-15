const mongoose = require('mongoose');

const meetingSchema = mongoose.Schema({

    topic: {
        type: String,
        required: true,
    },
    discussion_points: {
        type: String,
        required: true,
    },
    timming:
    {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('MeetingSchema', meetingSchema);
