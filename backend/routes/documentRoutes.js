const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadDocument, getUserDocuments, getDocumentUrl } = require('../controllers/documentController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

const checkFileType = (file, cb) => {
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: PDFs Only!');
    }
};

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

router.post('/upload', protect, upload.single('document'), uploadDocument);
router.get('/', protect, getUserDocuments);
router.get('/:id/url', protect, getDocumentUrl);

module.exports = router;
