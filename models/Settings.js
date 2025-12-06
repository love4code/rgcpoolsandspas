const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  companyName: {
    type: String,
    default: 'RGC Pool and Spa'
  },
  companyEmail: {
    type: String,
    default: 'markagrover85@gmail.com'
  },
  companyPhone: String,
  companyAddress: String,
  heroImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media'
  },
  theme: {
    type: String,
    enum: ['blue-ocean', 'aqua-blue', 'deep-blue', 'tropical-blue'],
    default: 'blue-ocean'
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    youtube: String
  },
  footerText: String,
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);

