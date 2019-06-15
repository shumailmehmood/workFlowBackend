const mongoose = require('mongoose');

const forumSchema = mongoose.Schema({

    topic: {
        type: String,
        required: true,
    },
    creater_email: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('ForumSchema', forumSchema);
