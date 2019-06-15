const mongoose = require('mongoose');
const paperSchema = mongoose.Schema({

    file_name: {
        type: String,
        required: true,
    },
    file_path: {
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
    status: {
        type: String,
        required: true,
        default: 'pending'
    },
    date: {
        type: String,
        required: true,
        default: new Date().toISOString()
    }
});

module.exports = mongoose.model('PaperSchema', paperSchema);
