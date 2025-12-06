const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  large: {
    data: Buffer,
    width: Number,
    height: Number
  },
  medium: {
    data: Buffer,
    width: Number,
    height: Number
  },
  thumbnail: {
    data: Buffer,
    width: Number,
    height: Number
  },
  title: String,
  alt: String,
  caption: String,
  flipHorizontal: {
    type: Boolean,
    default: false
  },
  flipVertical: {
    type: Boolean,
    default: false
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, {
  // Ensure Buffer fields are always included
  selectPopulatedPaths: true
});

module.exports = mongoose.model('Media', mediaSchema);

