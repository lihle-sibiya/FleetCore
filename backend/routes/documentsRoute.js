'use strict';

const router      = require('express').Router();
const multer      = require('multer');
const path        = require('path');
const fs          = require('fs');
const { Document } = require('../models');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// Store uploads in /uploads folder, organised by application id
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads', req.params.applicationId);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${file.originalname}`;
    cb(null, unique);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only PDF and images allowed'));
  },
});

// GET /api/documents/:applicationId
router.get('/:applicationId', async (req, res) => {
  try {
    const docs = await Document.findAll({
      where: { application_id: req.params.applicationId },
      order: [['uploaded_at', 'DESC']],
    });
    res.json(docs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/documents/:applicationId  — upload one or more files
router.post('/:applicationId', upload.array('files', 10), async (req, res) => {
  try {
    const { doc_type, source = 'digital_upload' } = req.body;
    if (!req.files?.length) return res.status(400).json({ message: 'No files uploaded' });

    const docs = await Document.bulkCreate(
      req.files.map((f) => ({
        application_id:    req.params.applicationId,
        doc_type,
        source,
        file_path:         f.path,
        original_filename: f.originalname,
      }))
    );
    res.status(201).json(docs);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE /api/documents/:applicationId/:docId
router.delete('/:applicationId/:docId', async (req, res) => {
  try {
    const doc = await Document.findByPk(req.params.docId);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    // Remove file from disk
    if (fs.existsSync(doc.file_path)) fs.unlinkSync(doc.file_path);
    await doc.destroy();
    res.json({ message: 'Document removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;