const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
    explanation: { type: String, required: true } // AI provided reasoning
});

const quizSchema = new mongoose.Schema({
    title: {
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
    questions: [questionSchema],
    score: {
        type: Number,
        default: null // null indicates it hasn't been taken yet
    }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
