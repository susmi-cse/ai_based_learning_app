const Document = require('../models/Document.js');
const Flashcard = require('../models/Flashcard.js');
const Quiz = require('../models/Quiz.js');
const geminiService = require('../services/gemini-1.5-flash');

// Helper to get document text and check auth
const getDocumentContext = async (docId, userId) => {
    const document = await Document.findById(docId);
    if (!document) throw new Error('Document not found');
    if (document.userRef.toString() !== userId.toString()) throw new Error('Not authorized');
    if (!document.extractedText) throw new Error('No text extracted for this document');
    return document.extractedText;
};

const chat = async (req, res) => {
    try {
        const { documentId, prompt } = req.body;
        const context = await getDocumentContext(documentId, req.user._id);
        const responseText = await geminiService.generateChatResponse(context, prompt);
        res.json({ answer: responseText });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const summarize = async (req, res) => {
    try {
        const { documentId } = req.body;
        const context = await getDocumentContext(documentId, req.user._id);
        const summary = await geminiService.summarizeDocument(context);
        res.json({ summary });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const explain = async (req, res) => {
    try {
        const { documentId, concept } = req.body;
        const context = await getDocumentContext(documentId, req.user._id);
        const explanation = await geminiService.explainConcept(context, concept);
        res.json({ explanation });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const generateFlashcards = async (req, res) => {
    try {
        const { documentId, count } = req.body;
        const context = await getDocumentContext(documentId, req.user._id);
        const flashcardData = await geminiService.generateFlashcards(context, count);

        // Save generated flashcards to DB
        const savedFlashcards = await Promise.all(flashcardData.map(async (fc) => {
            return await Flashcard.create({
                frontText: fc.frontText,
                backText: fc.backText,
                documentRef: documentId,
                userRef: req.user._id
            });
        }));

        res.status(201).json(savedFlashcards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const generateQuiz = async (req, res) => {
    try {
        const { documentId, numQuestions, title } = req.body;
        const context = await getDocumentContext(documentId, req.user._id);
        const quizQuestions = await geminiService.generateQuiz(context, numQuestions);

        const quiz = await Quiz.create({
            title: title || 'Auto-Generated Quiz',
            documentRef: documentId,
            userRef: req.user._id,
            questions: quizQuestions,
            score: null
        });

        res.status(201).json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    chat,
    summarize,
    explain,
    generateFlashcards,
    generateQuiz
};
