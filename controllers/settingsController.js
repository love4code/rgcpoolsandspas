const Settings = require('../models/Settings');
const Media = require('../models/Media');

const getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    const heroImage = settings.heroImage ? await Media.findById(settings.heroImage) : null;

    res.render('admin/settings/index', {
      settings,
      heroImage,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Get settings error:', error);
    req.flash('error', 'Error loading settings');
    res.redirect('/admin/dashboard');
  }
};

const updateSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();

    settings.companyName = req.body.companyName || settings.companyName;
    settings.companyEmail = req.body.companyEmail || settings.companyEmail;
    settings.companyPhone = req.body.companyPhone || '';
    settings.companyAddress = req.body.companyAddress || '';
    settings.heroImage = req.body.heroImage || null;
    settings.theme = req.body.theme || 'ocean-blue';
    settings.footerText = req.body.footerText || '';

    // Handle custom theme colors
    if (req.body.theme === 'custom') {
      settings.customTheme = {
        primaryColor: req.body.primaryColor || '#0066cc',
        secondaryColor: req.body.secondaryColor || '#00aaff',
        accentColor: req.body.accentColor || '#ff6b35',
        textColor: req.body.textColor || '#333333',
        buttonColor: req.body.buttonColor || '#0066cc',
        buttonTextColor: req.body.buttonTextColor || '#ffffff',
        linkColor: req.body.linkColor || '#0066cc',
        backgroundColor: req.body.backgroundColor || '#ffffff'
      };
    }

    settings.socialMedia = {
      facebook: req.body.facebook || '',
      instagram: req.body.instagram || '',
      twitter: req.body.twitter || '',
      youtube: req.body.youtube || ''
    };

    settings.facebookPageUrl = req.body.facebookPageUrl || '';

    await settings.save();

    req.flash('success', 'Settings updated successfully');
    res.redirect('/admin/settings');
  } catch (error) {
    console.error('Update settings error:', error);
    req.flash('error', 'Error updating settings: ' + error.message);
    res.redirect('/admin/settings');
  }
};

module.exports = {
  getSettings,
  updateSettings
};

