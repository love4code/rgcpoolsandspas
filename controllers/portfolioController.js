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
    res.render('admin/portfolio/form', { item });
  } catch (error) {
    console.error('Portfolio form error:', error);
    req.flash('error', 'Error loading portfolio form');
    res.redirect('/admin/portfolio');
  }
};

const createPortfolio = async (req, res) => {
  try {
    const portfolioData = {
      title: req.body.title,
      description: req.body.description,
      images: req.body.images ? (Array.isArray(req.body.images) ? req.body.images : [req.body.images]) : [],
      featuredImage: req.body.featuredImage || null,
      seoTitle: req.body.seoTitle,
      seoDescription: req.body.seoDescription,
      featured: req.body.featured === 'on'
    };

    const item = new Portfolio(portfolioData);
    await item.save();

    req.flash('success', 'Portfolio item created successfully');
    res.redirect('/admin/portfolio');
  } catch (error) {
    console.error('Create portfolio error:', error);
    req.flash('error', 'Error creating portfolio item: ' + error.message);
    res.redirect('/admin/portfolio/new');
  }
};

const updatePortfolio = async (req, res) => {
  try {
    const portfolioData = {
      title: req.body.title,
      description: req.body.description,
      images: req.body.images ? (Array.isArray(req.body.images) ? req.body.images : [req.body.images]) : [],
      featuredImage: req.body.featuredImage || null,
      seoTitle: req.body.seoTitle,
      seoDescription: req.body.seoDescription,
      featured: req.body.featured === 'on',
      active: req.body.active === 'on'
    };

    await Portfolio.findByIdAndUpdate(req.params.id, portfolioData);

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

