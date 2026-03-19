const Document = require('../models/Document.js');
const Flashcard = require('../models/Flashcard.js');
const Quiz = require('../models/Quiz.js');

const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;

        const totalDocuments = await Document.countDocuments({ userRef: userId });
        const totalFlashcards = await Flashcard.countDocuments({ userRef: userId });
        const totalQuizzes = await Quiz.countDocuments({ userRef: userId });

        // Get recent activity
        const recentDocs = await Document.find({ userRef: userId }).sort({ createdAt: -1 }).limit(3);
        const recentQuizzes = await Quiz.find({ userRef: userId }).sort({ createdAt: -1 }).limit(3);

        const activityLine = [];
        recentDocs.forEach(doc => activityLine.push({ type: 'Document Uploaded', title: doc.title, date: doc.createdAt }));
        recentQuizzes.forEach(quiz => activityLine.push({ type: 'Quiz Generated', title: quiz.title, date: quiz.createdAt }));

        activityLine.sort((a, b) => b.date - a.date);
        const recentActivity = activityLine.slice(0, 5);

        res.json({
            stats: {
                totalDocuments,
                totalFlashcards,
                totalQuizzes
            },
            recentActivity
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats };
