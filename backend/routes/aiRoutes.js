const express = require('express');
const { chat, summarize, explain, generateFlashcards, generateQuiz } = require('../controllers/aiController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/chat', protect, chat);
router.post('/summarize', protect, summarize);
router.post('/explain', protect, explain);
router.post('/flashcards', protect, generateFlashcards);
router.post('/quiz', protect, generateQuiz);

module.exports = router;
