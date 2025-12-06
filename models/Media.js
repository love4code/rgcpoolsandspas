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
  alt: String,
  caption: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Media', mediaSchema);

