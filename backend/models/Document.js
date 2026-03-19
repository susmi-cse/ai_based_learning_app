const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    originalName: {
        type: String,
        required: true,
    },
    size: {
        type: Number, // in bytes
        required: true,
    },
    storagePath: {
        type: String,
        required: true,
    },
    extractedText: {
        type: String,
        required: false, // will be generated after upload
    },
    userRef: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    }
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
