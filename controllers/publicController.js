const Product = require('../models/Product');
const Portfolio = require('../models/Portfolio');
const Service = require('../models/Service');
const Event = require('../models/Event');
const Settings = require('../models/Settings');
const Inquiry = require('../models/Inquiry');
const { sendInquiryEmail } = require('../utils/email');
const Media = require('../models/Media');

const getHome = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    const services = await Service.find({ active: true, featured: true })
      .sort({ displayOrder: 1 })
      .limit(3);
    const portfolioItems = await Portfolio.find({ active: true, featured: true })
      .populate('featuredImage')
      .sort({ createdAt: -1 })
      .limit(4);
    
    let heroImage = null;
    if (settings.heroImage) {
      heroImage = await Media.findById(settings.heroImage);
    }

    res.render('public/home', {
      settings,
      services,
      portfolioItems,
      heroImage
    });
  } catch (error) {
    console.error('Home page error:', error);
    res.status(500).render('error', { message: 'Error loading home page' });
  }
};

const getAbout = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.render('public/about', { settings });
  } catch (error) {
    console.error('About page error:', error);
    res.status(500).render('error', { message: 'Error loading about page' });
  }
};

const getContact = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.render('public/contact', { settings });
  } catch (error) {
    console.error('Contact page error:', error);
    res.status(500).render('error', { message: 'Error loading contact page' });
  }
};

const getProducts = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    const products = await Product.find({ active: true })
      .populate('featuredImage')
      .sort({ createdAt: -1 });

    res.render('public/products/index', {
      settings,
      products
    });
  } catch (error) {
    console.error('Products page error:', error);
    res.status(500).render('error', { message: 'Error loading products' });
  }
};

const getProductDetail = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    const product = await Product.findOne({ slug: req.params.slug, active: true })
      .populate('images')
      .populate('featuredImage');

    if (!product) {
      return res.status(404).render('error', { message: 'Product not found' });
    }

    res.render('public/products/detail', {
      settings,
      product
    });
  } catch (error) {
    console.error('Product detail error:', error);
    res.status(500).render('error', { message: 'Error loading product' });
  }
};

const getPortfolio = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    const portfolioItems = await Portfolio.find({ active: true })
      .populate('featuredImage')
      .sort({ createdAt: -1 });

    res.render('public/portfolio/index', {
      settings,
      portfolioItems
    });
  } catch (error) {
    console.error('Portfolio page error:', error);
    res.status(500).render('error', { message: 'Error loading portfolio' });
  }
};

const getPortfolioDetail = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    const item = await Portfolio.findOne({ slug: req.params.slug, active: true })
      .populate('images')
      .populate('featuredImage');

    if (!item) {
      return res.status(404).render('error', { message: 'Portfolio item not found' });
    }

    res.render('public/portfolio/detail', {
      settings,
      item
    });
  } catch (error) {
    console.error('Portfolio detail error:', error);
    res.status(500).render('error', { message: 'Error loading portfolio item' });
  }
};

const getCalendar = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    const events = await Event.find({ active: true })
      .sort({ startDate: 1 });

    res.render('public/calendar', {
      settings,
      events
    });
  } catch (error) {
    console.error('Calendar error:', error);
    res.status(500).render('error', { message: 'Error loading calendar' });
  }
};

const submitInquiry = async (req, res) => {
  try {
    const inquiryData = {
      name: req.body.name,
      town: req.body.town,
      phone: req.body.phone,
      email: req.body.email,
      service: req.body.service,
      message: req.body.message,
      selectedSizes: Array.isArray(req.body.selectedSizes) ? req.body.selectedSizes : (req.body.selectedSizes ? [req.body.selectedSizes] : []),
      source: req.body.source || 'contact',
      productId: req.body.productId || null
    };

    const inquiry = new Inquiry(inquiryData);
    await inquiry.save();

    // Send email
    await sendInquiryEmail(inquiryData);

    req.flash('success', 'Thank you! Your inquiry has been submitted successfully.');
    
    // Redirect based on source
    if (req.body.source === 'product' && req.body.productId) {
      const product = await Product.findById(req.body.productId);
      if (product) {
        return res.redirect(`/products/${product.slug}`);
      }
    }
    
    const redirectUrl = req.body.source === 'home' ? '/' : '/contact';
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Inquiry submission error:', error);
    req.flash('error', 'There was an error submitting your inquiry. Please try again.');
    const redirectUrl = req.body.source === 'home' ? '/' : '/contact';
    res.redirect(redirectUrl);
  }
};

module.exports = {
  getHome,
  getAbout,
  getContact,
  getProducts,
  getProductDetail,
  getPortfolio,
  getPortfolioDetail,
  getCalendar,
  submitInquiry
};

