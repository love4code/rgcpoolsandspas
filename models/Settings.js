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
    enum: ['ocean-blue', 'deep-blue', 'sky-blue', 'navy-blue', 'aqua-blue', 'light-blue', 'royal-blue', 'custom'],
    default: 'ocean-blue'
  },
  customTheme: {
    primaryColor: {
      type: String,
      default: '#0066cc'
    },
    secondaryColor: {
      type: String,
      default: '#00aaff'
    },
    accentColor: {
      type: String,
      default: '#ff6b35'
    },
    textColor: {
      type: String,
      default: '#333333'
    },
    buttonColor: {
      type: String,
      default: '#0066cc'
    },
    buttonTextColor: {
      type: String,
      default: '#ffffff'
    },
    linkColor: {
      type: String,
      default: '#0066cc'
    },
    backgroundColor: {
      type: String,
      default: '#ffffff'
    }
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

