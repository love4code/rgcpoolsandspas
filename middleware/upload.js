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

// Process and resize images with optional flip
const processImage = async (file, progressCallback, flipHorizontal = false, flipVertical = false) => {
  try {
    progressCallback(10, 'Reading image...');
    
    let imageProcessor = sharp(file.buffer);
    
    // Apply flips if needed
    if (flipHorizontal) {
      imageProcessor = imageProcessor.flop(); // Horizontal flip
    }
    if (flipVertical) {
      imageProcessor = imageProcessor.flip(); // Vertical flip
    }
    
    const metadata = await imageProcessor.metadata();
    const originalWidth = metadata.width;
    const originalHeight = metadata.height;

    progressCallback(30, 'Generating large size...');
    // Large: max 1920px on longest side
    const largeSize = Math.max(originalWidth, originalHeight) > 1920 ? 1920 : null;
    let largeProcessor = imageProcessor.clone();
    if (largeSize) {
      largeProcessor = largeProcessor.resize(largeSize, largeSize, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    const largeBuffer = await largeProcessor
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer();
    
    const largeMetadata = await sharp(largeBuffer).metadata();
    progressCallback(50, 'Generating medium size...');
    
    // Medium: max 800px on longest side
    const mediumSize = Math.max(originalWidth, originalHeight) > 800 ? 800 : null;
    let mediumProcessor = imageProcessor.clone();
    if (mediumSize) {
      mediumProcessor = mediumProcessor.resize(mediumSize, mediumSize, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    const mediumBuffer = await mediumProcessor
      .jpeg({ quality: 80, mozjpeg: true })
      .toBuffer();
    
    const mediumMetadata = await sharp(mediumBuffer).metadata();
    progressCallback(70, 'Generating thumbnail...');
    
    // Thumbnail: 300x300 cropped
    const thumbnailBuffer = await imageProcessor
      .clone()
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

// Regenerate images with flip applied (for existing media)
const regenerateImagesWithFlip = async (media, flipHorizontal, flipVertical) => {
  try {
    // Use the large image as source (highest quality)
    const sourceBuffer = media.large.data;
    
    let imageProcessor = sharp(sourceBuffer);
    
    // Apply flips
    if (flipHorizontal) {
      imageProcessor = imageProcessor.flop();
    }
    if (flipVertical) {
      imageProcessor = imageProcessor.flip();
    }
    
    // Regenerate all sizes
    const metadata = await imageProcessor.metadata();
    const originalWidth = metadata.width;
    const originalHeight = metadata.height;
    
    // Large: max 1920px
    const largeSize = Math.max(originalWidth, originalHeight) > 1920 ? 1920 : null;
    let largeProcessor = imageProcessor.clone();
    if (largeSize) {
      largeProcessor = largeProcessor.resize(largeSize, largeSize, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    const largeBuffer = await largeProcessor
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer();
    
    const largeMetadata = await sharp(largeBuffer).metadata();
    
    // Medium: max 800px
    const mediumSize = Math.max(originalWidth, originalHeight) > 800 ? 800 : null;
    let mediumProcessor = imageProcessor.clone();
    if (mediumSize) {
      mediumProcessor = mediumProcessor.resize(mediumSize, mediumSize, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    const mediumBuffer = await mediumProcessor
      .jpeg({ quality: 80, mozjpeg: true })
      .toBuffer();
    
    const mediumMetadata = await sharp(mediumBuffer).metadata();
    
    // Thumbnail: 300x300
    const thumbnailBuffer = await imageProcessor
      .clone()
      .resize(300, 300, {
        fit: 'cover'
      })
      .jpeg({ quality: 75, mozjpeg: true })
      .toBuffer();
    
    const thumbnailMetadata = await sharp(thumbnailBuffer).metadata();
    
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
    console.error('Image regeneration error:', error);
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
  uploadMultiple,
  regenerateImagesWithFlip
};

