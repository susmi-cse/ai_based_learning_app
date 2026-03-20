const Document = require('../models/Document.js');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const path = require('path');

// @desc    Upload a document and extract text
// @route   POST /api/documents/upload
// @access  Private
const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { originalname, size, path: filePath } = req.file;
        const title = req.body.title || originalname;

        // Parse PDF for text
        const dataBuffer = fs.readFileSync(filePath);
        
        // BULLETPROOF PDF FIX: Checks how the server loaded the package
        let extractedText = "";
        try {
            const parseDoc = typeof pdfParse === 'function' ? pdfParse : pdfParse.default;
            const pdfData = await parseDoc(dataBuffer);
            extractedText = pdfData.text;
        } catch (parseError) {
            console.error("Warning: Could not extract text. Saving file anyway.", parseError);
            extractedText = "Text extraction unavailable for this document.";
        }

        const document = await Document.create({
            title,
            originalName: originalname,
            size,
            storagePath: filePath, // Storing local path for now
            extractedText,
            userRef: req.user._id,
        });

        res.status(201).json(document);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's documents
// @route   GET /api/documents
// @access  Private
const getUserDocuments = async (req, res) => {
    try {
        const documents = await Document.find({ userRef: req.user._id }).sort({ createdAt: -1 });
        // Exclude full extracted text to keep the response light
        const strippedDocs = documents.map(doc => ({
            _id: doc._id,
            title: doc.title,
            originalName: doc.originalName,
            size: doc.size,
            createdAt: doc.createdAt
        }));
        res.json(strippedDocs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get URL for document viewing
// @route   GET /api/documents/:id/url
// @access  Private
const getDocumentUrl = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        if (document.userRef.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Return the static file serving URL
        const fileUrl = `https://ai-based-learning-app-1.onrender.com/${document.storagePath.replace(/\\/g, '/')}`;
        res.json({ url: fileUrl });

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    uploadDocument,
    getUserDocuments,
    getDocumentUrl
};