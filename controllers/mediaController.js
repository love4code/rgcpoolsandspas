const Media = require('../models/Media');
const { upload, uploadSingle, uploadMultiple } = require('../middleware/upload');

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
    if (req.files && req.files.length > 0) {
      await uploadMultiple(req, res);
    } else if (req.file) {
      await uploadSingle(req, res);
    } else {
      res.status(400).json({ error: 'No files uploaded' });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
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

    res.contentType(contentType);
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

module.exports = {
  getMediaLibrary,
  uploadMedia,
  getMediaImage,
  deleteMedia,
  getMediaModal
};

