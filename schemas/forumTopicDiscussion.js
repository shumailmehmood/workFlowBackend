const mongoose = require('mongoose');

const forumDiscussionSchema = mongoose.Schema({

    topic_id: {
        type: String,
        required: true,
    },
    commentBy_email: {
        type: String,
        required: true,
    },
    comment_text: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('ForumDiscussionSchema', forumDiscussionSchema);
