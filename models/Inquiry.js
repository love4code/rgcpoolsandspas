const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  town: String,
  phone: String,
  email: {
    type: String,
    required: true
  },
  service: {
    type: String,
    enum: ['New Above Ground Pool', 'Liner Replacement', 'Pool Install', 'Service Call'],
    required: true
  },
  selectedSizes: [String],
  message: String,
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  source: {
    type: String,
    enum: ['home', 'contact', 'product'],
    default: 'contact'
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Inquiry', inquirySchema);

