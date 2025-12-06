const multer = require('multer');
const sharp = require('sharp');
const Media = require('../models/Media');

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: fileFilter
});

// Process and resize images
const processImage = async (file, progressCallback) => {
  try {
    progressCallback(10, 'Reading image...');
    
    const metadata = await sharp(file.buffer).metadata();
    const originalWidth = metadata.width;
    const originalHeight = metadata.height;

    progressCallback(30, 'Generating large size...');
    // Large: max 1920px on longest side
    const largeSize = Math.max(originalWidth, originalHeight) > 1920 ? 1920 : null;
    const largeBuffer = await sharp(file.buffer)
      .resize(largeSize, largeSize, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer();
    
    const largeMetadata = await sharp(largeBuffer).metadata();
    progressCallback(50, 'Generating medium size...');
    
    // Medium: max 800px on longest side
    const mediumSize = Math.max(originalWidth, originalHeight) > 800 ? 800 : null;
    const mediumBuffer = await sharp(file.buffer)
      .resize(mediumSize, mediumSize, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 80, mozjpeg: true })
      .toBuffer();
    
    const mediumMetadata = await sharp(mediumBuffer).metadata();
    progressCallback(70, 'Generating thumbnail...');
    
    // Thumbnail: 300x300 cropped
    const thumbnailBuffer = await sharp(file.buffer)
      .resize(300, 300, {
        fit: 'cover'
      })
      .jpeg({ quality: 75, mozjpeg: true })
      .toBuffer();
    
    const thumbnailMetadata = await sharp(thumbnailBuffer).metadata();
    progressCallback(90, 'Saving to database...');

    return {
      large: {
        data: largeBuffer,
        width: largeMetadata.width,
        height: largeMetadata.height
      },
      medium: {
        data: mediumBuffer,
        width: mediumMetadata.width,
        height: mediumMetadata.height
      },
      thumbnail: {
        data: thumbnailBuffer,
        width: thumbnailMetadata.width,
        height: thumbnailMetadata.height
      }
    };
  } catch (error) {
    console.error('Image processing error:', error);
    throw error;
  }
};

// Handle single image upload
const uploadSingle = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Create progress callback for client updates (would need WebSocket for real-time)
    const progressCallback = (progress, message) => {
      console.log(`Upload progress: ${progress}% - ${message}`);
    };

    const processedImages = await processImage(req.file, progressCallback);

    const media = new Media({
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      large: processedImages.large,
      medium: processedImages.medium,
      thumbnail: processedImages.thumbnail
    });

    await media.save();

    res.json({
      success: true,
      media: {
        id: media._id,
        originalName: media.originalName,
        mimeType: media.mimeType,
        size: media.size
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Handle multiple image uploads
const uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedMedia = [];

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      
      const progressCallback = (progress, message) => {
        console.log(`File ${i + 1}/${req.files.length}: ${progress}% - ${message}`);
      };

      const processedImages = await processImage(file, progressCallback);

      const media = new Media({
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        large: processedImages.large,
        medium: processedImages.medium,
        thumbnail: processedImages.thumbnail
      });

      await media.save();
      uploadedMedia.push({
        id: media._id,
        originalName: media.originalName,
        mimeType: media.mimeType,
        size: media.size
      });
    }

    res.json({
      success: true,
      count: uploadedMedia.length,
      media: uploadedMedia
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  upload,
  processImage,
  uploadSingle,
  uploadMultiple
};

