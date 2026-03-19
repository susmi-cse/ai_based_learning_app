const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
    frontText: {
        type: String,
        required: true,
    },
    backText: {
        type: String,
        required: true,
    },
    documentRef: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Document',
    },
    userRef: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    isFavorite: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

module.exports = mongoose.model('Flashcard', flashcardSchema);
