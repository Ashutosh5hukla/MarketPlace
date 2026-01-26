import express from 'express';
import { upload } from '../config/cloudinary.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Upload single image
// @route   POST /api/upload/image
// @access  Private
router.post('/image', protect, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ message: err.message || 'Failed to upload image' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    res.json({
      url: req.file.path,
      publicId: req.file.filename,
    });
  });
});

// @desc    Upload multiple images
// @route   POST /api/upload/images
// @access  Private
router.post('/images', protect, (req, res) => {
  upload.array('images', 5)(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ message: err.message || 'Failed to upload images' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadedImages = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));

    res.json(uploadedImages);
  });
});

export default router;
