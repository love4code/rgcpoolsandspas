const Media = require('../models/Media');
const { upload, uploadSingle, uploadMultiple, regenerateImagesWithFlip } = require('../middleware/upload');

const getMediaLibrary = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const media = await Media.find()
      .sort({ uploadedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Media.countDocuments();
    const totalPages = Math.ceil(total / limit);

    res.render('admin/media/index', {
      media,
      currentPage: page,
      totalPages,
      total
    });
  } catch (error) {
    console.error('Media library error:', error);
    req.flash('error', 'Error loading media library');
    res.redirect('/admin/dashboard');
  }
};

const uploadMedia = async (req, res) => {
  try {
    // Check if files were uploaded
    if (req.files && req.files.length > 0) {
      // Handle multiple files
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      const uploadedMedia = [];
      const { processImage } = require('../middleware/upload');

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

      return res.json({
        success: true,
        count: uploadedMedia.length,
        media: uploadedMedia
      });
    } else if (req.file) {
      // Handle single file
      const { processImage } = require('../middleware/upload');

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

      return res.json({
        success: true,
        media: {
          id: media._id,
          originalName: media.originalName,
          mimeType: media.mimeType,
          size: media.size
        }
      });
    } else {
      return res.status(400).json({ error: 'No files uploaded' });
    }
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: error.message || 'Upload failed' });
  }
};

const getMediaImage = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).send('Media not found');
    }

    const size = req.params.size || 'medium';
    let imageData, contentType;

    // Get the appropriate size image data
    if (size === 'large' && media.large && media.large.data) {
      imageData = media.large.data;
      contentType = 'image/jpeg';
    } else if (size === 'thumbnail' && media.thumbnail && media.thumbnail.data) {
      imageData = media.thumbnail.data;
      contentType = 'image/jpeg';
    } else if (media.medium && media.medium.data) {
      imageData = media.medium.data;
      contentType = 'image/jpeg';
    } else {
      return res.status(404).send('Image not found');
    }

    // Images are already processed with flips applied during upload/regeneration
    // So we can serve them directly
    res.contentType(contentType);
    res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.send(imageData);
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).send('Error loading image');
  }
};

const deleteMedia = async (req, res) => {
  try {
    await Media.findByIdAndDelete(req.params.id);
    req.flash('success', 'Media deleted successfully');
    res.json({ success: true });
  } catch (error) {
    console.error('Delete media error:', error);
    req.flash('error', 'Error deleting media');
    res.status(500).json({ error: error.message });
  }
};

const getMediaModal = async (req, res) => {
  try {
    const media = await Media.find()
      .sort({ uploadedAt: -1 })
      .limit(50);

    res.render('admin/media/modal', { media });
  } catch (error) {
    console.error('Media modal error:', error);
    res.status(500).send('Error loading media');
  }
};

const updateMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    // Update title and alt text
    if (req.body.title !== undefined) {
      media.title = req.body.title || '';
    }
    if (req.body.alt !== undefined) {
      media.alt = req.body.alt || '';
    }

    await media.save();

    res.json({
      success: true,
      media: {
        id: media._id,
        title: media.title,
        alt: media.alt
      }
    });
  } catch (error) {
    console.error('Update media error:', error);
    res.status(500).json({ error: error.message });
  }
};

const flipMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    const flipHorizontal = req.body.flipHorizontal === 'true' || req.body.flipHorizontal === true;
    const flipVertical = req.body.flipVertical === 'true' || req.body.flipVertical === true;

    // Toggle flip states
    if (req.body.direction === 'horizontal') {
      media.flipHorizontal = !media.flipHorizontal;
    } else if (req.body.direction === 'vertical') {
      media.flipVertical = !media.flipVertical;
    } else {
      // Use provided values
      if (req.body.flipHorizontal !== undefined) {
        media.flipHorizontal = flipHorizontal;
      }
      if (req.body.flipVertical !== undefined) {
        media.flipVertical = flipVertical;
      }
    }

    // Regenerate images with new flip settings
    const processedImages = await regenerateImagesWithFlip(
      media,
      media.flipHorizontal,
      media.flipVertical
    );

    // Update image data
    media.large = processedImages.large;
    media.medium = processedImages.medium;
    media.thumbnail = processedImages.thumbnail;

    await media.save();

    res.json({
      success: true,
      media: {
        id: media._id,
        flipHorizontal: media.flipHorizontal,
        flipVertical: media.flipVertical
      }
    });
  } catch (error) {
    console.error('Flip media error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getMediaLibrary,
  uploadMedia,
  getMediaImage,
  deleteMedia,
  getMediaModal,
  updateMedia,
  flipMedia
};

