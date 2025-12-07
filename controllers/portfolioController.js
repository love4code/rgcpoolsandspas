const Portfolio = require('../models/Portfolio');
const Media = require('../models/Media');

const getPortfolio = async (req, res) => {
  try {
    const items = await Portfolio.find()
      .populate('featuredImage')
      .sort({ createdAt: -1 });

    res.render('admin/portfolio/index', {
      items,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Get portfolio error:', error);
    req.flash('error', 'Error loading portfolio');
    res.redirect('/admin/dashboard');
  }
};

const getPortfolioForm = async (req, res) => {
  try {
    let item = null;
    if (req.params.id) {
      item = await Portfolio.findById(req.params.id).populate('images featuredImage');
    }
    res.render('admin/portfolio/form', {
      item,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Portfolio form error:', error);
    req.flash('error', 'Error loading portfolio form');
    res.redirect('/admin/portfolio');
  }
};

const createPortfolio = async (req, res) => {
  console.error('🔴🔴🔴 CREATE PORTFOLIO FUNCTION CALLED');
  console.error('🔴 Request method:', req.method);
  console.error('🔴 Request URL:', req.url);
  console.error('🔴 Request body:', JSON.stringify(req.body));
  console.error('🔴 Request body keys:', req.body ? Object.keys(req.body) : 'no body');
  
  try {
    // Validate required fields
    if (!req.body.title || !req.body.title.trim()) {
      console.log('❌ Validation failed: Title is required');
      req.flash('error', 'Title is required');
      return res.redirect('/admin/portfolio/new');
    }

    if (!req.body.description || !req.body.description.trim()) {
      console.log('❌ Validation failed: Description is required');
      req.flash('error', 'Description is required');
      return res.redirect('/admin/portfolio/new');
    }

    // Handle images array - filter out empty values
    let images = [];
    if (req.body.images) {
      if (Array.isArray(req.body.images)) {
        images = req.body.images.filter(img => img && img.trim());
      } else if (typeof req.body.images === 'string' && req.body.images.trim()) {
        images = [req.body.images];
      }
    }

    // Handle featuredImage - convert empty string to null
    let featuredImage = req.body.featuredImage;
    if (!featuredImage || (typeof featuredImage === 'string' && featuredImage.trim() === '')) {
      featuredImage = null;
    }

    // Generate slug from title
    let baseSlug = req.body.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let slug = baseSlug;
    
    // Check if slug already exists and append number if needed
    let counter = 1;
    while (await Portfolio.findOne({ slug: slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const portfolioData = {
      title: req.body.title.trim(),
      slug: slug,
      description: req.body.description.trim(),
      images: images,
      featuredImage: featuredImage,
      seoTitle: req.body.seoTitle ? req.body.seoTitle.trim() : '',
      seoDescription: req.body.seoDescription ? req.body.seoDescription.trim() : '',
      featured: req.body.featured === 'on'
    };

    console.error('Creating portfolio with data:', {
      title: portfolioData.title,
      slug: portfolioData.slug,
      descriptionLength: portfolioData.description.length,
      imagesCount: portfolioData.images.length,
      hasFeaturedImage: !!portfolioData.featuredImage
    });

    const item = new Portfolio(portfolioData);
    await item.save();

    console.log('Portfolio created successfully with ID:', item._id);
    req.flash('success', 'Portfolio item created successfully');
    res.redirect('/admin/portfolio');
  } catch (error) {
    console.error('Create portfolio error:', error);
    console.error('Error stack:', error.stack);
    console.error('Request body:', req.body);
    
    let errorMessage = 'Error creating portfolio item: ' + error.message;
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message).join(', ');
      errorMessage = 'Validation error: ' + validationErrors;
    } else if (error.code === 11000) {
      errorMessage = 'A portfolio with this title already exists. Please choose a different title.';
    }
    
    req.flash('error', errorMessage);
    res.redirect('/admin/portfolio/new');
  }
};

const updatePortfolio = async (req, res) => {
  try {
    const item = await Portfolio.findById(req.params.id);
    if (!item) {
      req.flash('error', 'Portfolio item not found');
      return res.redirect('/admin/portfolio');
    }

    // Update fields
    item.title = req.body.title;
    item.description = req.body.description;
    item.images = req.body.images ? (Array.isArray(req.body.images) ? req.body.images : [req.body.images]) : [];
    item.featuredImage = req.body.featuredImage || null;
    item.seoTitle = req.body.seoTitle;
    item.seoDescription = req.body.seoDescription;
    item.featured = req.body.featured === 'on';
    item.active = req.body.active === 'on';

    // Regenerate slug if title changed (pre-save hook will handle this)
    if (item.isModified('title')) {
      item.slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    await item.save();

    req.flash('success', 'Portfolio item updated successfully');
    res.redirect('/admin/portfolio');
  } catch (error) {
    console.error('Update portfolio error:', error);
    req.flash('error', 'Error updating portfolio item: ' + error.message);
    res.redirect(`/admin/portfolio/${req.params.id}/edit`);
  }
};

const deletePortfolio = async (req, res) => {
  try {
    await Portfolio.findByIdAndDelete(req.params.id);
    req.flash('success', 'Portfolio item deleted successfully');
    res.json({ success: true });
  } catch (error) {
    console.error('Delete portfolio error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPortfolio,
  getPortfolioForm,
  createPortfolio,
  updatePortfolio,
  deletePortfolio
};

