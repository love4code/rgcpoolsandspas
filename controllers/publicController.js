const mongoose = require('mongoose');
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
    let portfolioItems = await Portfolio.find({ active: true, featured: true })
      .populate('featuredImage')
      .sort({ createdAt: -1 })
      .limit(4);
    
    // Ensure all portfolio items have slugs
    for (let item of portfolioItems) {
      if (!item.slug && item.title) {
        item.slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        try {
          await item.save();
          console.log('Generated slug for portfolio item:', item.title, '->', item.slug);
        } catch (error) {
          console.error('Error saving portfolio item slug:', error);
        }
      }
    }
    
    // Filter out items without slugs
    portfolioItems = portfolioItems.filter(item => item.slug);
    console.log('Home page - portfolio items with slugs:', portfolioItems.map(i => ({ title: i.title, slug: i.slug })));
    
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
    let products = await Product.find({ active: true })
      .populate('featuredImage')
      .sort({ createdAt: -1 });

    // Ensure all products have slugs
    for (let product of products) {
      if (!product.slug && product.name) {
        product.slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        try {
          await product.save();
          console.log('Generated slug for product:', product.name, '->', product.slug);
        } catch (error) {
          console.error('Error saving product slug:', error);
        }
      }
    }
    
    // Filter out products without slugs
    products = products.filter(product => product.slug);

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
    console.log('=== PRODUCT DETAIL REQUEST ===');
    console.log('URL:', req.url);
    console.log('Params:', req.params);
    console.log('Slug param:', req.params.slug);
    
    let settings;
    try {
      settings = await Settings.getSettings();
    } catch (settingsError) {
      console.error('Error getting settings:', settingsError);
      settings = {}; // Use empty object as fallback
    }
    
    // Check for invalid slug
    if (!req.params.slug || req.params.slug === 'undefined' || req.params.slug.trim() === '') {
      console.log('❌ Invalid slug provided for product');
      return res.status(404).render('error', { message: 'Invalid product URL' });
    }
    
    // Clean the slug - decode URL encoding if present
    let cleanSlug = decodeURIComponent(req.params.slug).trim();
    
    console.log('🔍 Looking for product with slug:', cleanSlug);
    
    // Try to find by slug (exact match)
    let product = await Product.findOne({ slug: cleanSlug, active: true })
      .populate('images')
      .populate('featuredImage');

    // If not found, try case-insensitive search
    if (!product) {
      console.log('⚠️  Product not found with exact slug, trying case-insensitive:', cleanSlug);
      product = await Product.findOne({ 
        slug: { $regex: new RegExp(`^${cleanSlug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }, 
        active: true 
      })
        .populate('images')
        .populate('featuredImage');
    }

    // If still not found, try finding by ID (in case someone passes an ID instead of slug)
    if (!product && mongoose.Types.ObjectId.isValid(cleanSlug)) {
      console.log('⚠️  Trying to find by ID:', cleanSlug);
      product = await Product.findOne({ _id: cleanSlug, active: true })
        .populate('images')
        .populate('featuredImage');
    }

    // If still not found, log all available products for debugging
    if (!product) {
      const allProducts = await Product.find({ active: true }).select('name slug active');
      console.log('❌ Product not found. Available products:', allProducts.map(p => ({ name: p.name, slug: p.slug, active: p.active })));
      console.log('Requested slug:', cleanSlug);
      return res.status(404).render('error', { 
        message: `Product not found. Requested: "${cleanSlug}"` 
      });
    }

    // Filter out any null/undefined images
    if (product.images) {
      product.images = product.images.filter(img => img && img._id);
    }

    // Ensure all product fields are safe for rendering
    if (!product.description) {
      product.description = 'No description available.';
    }
    if (!product.sizes) {
      product.sizes = [];
    }
    if (product.showContactForm === undefined) {
      product.showContactForm = true; // Default to showing contact form
    }

    console.log('✅ Found product:', product.name, 'with slug:', product.slug);
    console.log('Product data check:', {
      hasName: !!product.name,
      hasDescription: !!product.description,
      hasFeaturedImage: !!product.featuredImage,
      imagesCount: product.images ? product.images.length : 0,
      sizesCount: product.sizes ? product.sizes.length : 0,
      showContactForm: product.showContactForm
    });
    
    // Ensure settings is always an object
    const safeSettings = settings || {};
    
    try {
      res.render('public/products/detail', {
        settings: safeSettings,
        product
      });
    } catch (renderError) {
      console.error('❌ Render error:', renderError);
      console.error('Render error stack:', renderError.stack);
      console.error('Product data:', {
        name: product.name,
        description: product.description,
        hasFeaturedImage: !!product.featuredImage,
        imagesCount: product.images ? product.images.length : 0,
        sizesCount: product.sizes ? product.sizes.length : 0
      });
      throw renderError; // Re-throw to be caught by outer catch
    }
  } catch (error) {
    console.error('❌ Product detail error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).render('error', { message: 'Error loading product: ' + (error.message || 'Unknown error') });
  }
};

const getPortfolio = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    let portfolioItems = await Portfolio.find({ active: true })
      .populate('featuredImage')
      .sort({ createdAt: -1 });

    // Ensure all portfolio items have slugs
    for (let item of portfolioItems) {
      if (!item.slug && item.title) {
        item.slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        try {
          await item.save();
        } catch (error) {
          console.error('Error saving portfolio item slug:', error);
        }
      }
    }
    
    // Filter out items without slugs
    portfolioItems = portfolioItems.filter(item => item.slug);

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
    
    console.log('Portfolio detail request - slug:', req.params.slug, 'URL:', req.url);
    
    if (!req.params.slug || req.params.slug === 'undefined' || req.params.slug.trim() === '') {
      console.log('Invalid slug provided');
      return res.status(404).render('error', { message: 'Invalid portfolio item URL' });
    }
    
    // Clean the slug (remove any extra characters)
    const cleanSlug = req.params.slug.trim();
    
    // Try to find by slug
    let item = await Portfolio.findOne({ slug: cleanSlug, active: true })
      .populate('images')
      .populate('featuredImage');

    // If not found, try case-insensitive search
    if (!item) {
      console.log('Item not found with exact slug:', cleanSlug);
      item = await Portfolio.findOne({ 
        slug: { $regex: new RegExp(`^${cleanSlug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }, 
        active: true 
      })
        .populate('images')
        .populate('featuredImage');
    }

    // If still not found, log all available items for debugging
    if (!item) {
      const allItems = await Portfolio.find({ active: true }).select('title slug active');
      console.log('Available portfolio items:', allItems.map(i => ({ title: i.title, slug: i.slug, active: i.active })));
      console.log('Requested slug:', cleanSlug);
      return res.status(404).render('error', { 
        message: `Portfolio item not found. Requested: "${cleanSlug}"` 
      });
    }

    console.log('Found portfolio item:', item.title, 'with slug:', item.slug);
    res.render('public/portfolio/detail', {
      settings,
      item
    });
  } catch (error) {
    console.error('Portfolio detail error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).render('error', { message: 'Error loading portfolio item: ' + error.message });
  }
};

const getCalendar = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    const events = await Event.find({ active: true })
      .sort({ startDate: 1 });

    // Format events for FullCalendar
    const calendarEvents = events.map(event => {
      const eventData = {
        id: event._id.toString(),
        title: event.title,
        allDay: event.allDay || false,
        description: event.description || '',
        location: event.location || '',
        url: `/events/${event._id}`
      };

      // Format dates properly for FullCalendar
      if (event.allDay) {
        // For all-day events, use date-only format (YYYY-MM-DD)
        eventData.start = event.startDate.toISOString().split('T')[0];
        if (event.endDate) {
          // Add one day to end date for all-day events (exclusive end)
          const endDate = new Date(event.endDate);
          endDate.setDate(endDate.getDate() + 1);
          eventData.end = endDate.toISOString().split('T')[0];
        }
      } else {
        // For timed events, use full ISO format
        eventData.start = event.startDate.toISOString();
        if (event.endDate) {
          eventData.end = event.endDate.toISOString();
        } else {
          // If no end date, set end to start + 1 hour
          const endDate = new Date(event.startDate);
          endDate.setHours(endDate.getHours() + 1);
          eventData.end = endDate.toISOString();
        }
      }

      return eventData;
    });

    res.render('public/calendar', {
      settings,
      events: calendarEvents,
      eventsList: events // Pass original events for list display
    });
  } catch (error) {
    console.error('Calendar error:', error);
    res.status(500).render('error', { message: 'Error loading calendar' });
  }
};

const getEventDetail = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    const event = await Event.findById(req.params.id);

    if (!event || !event.active) {
      return res.status(404).render('error', { message: 'Event not found' });
    }

    res.render('public/events/detail', {
      settings,
      event
    });
  } catch (error) {
    console.error('Event detail error:', error);
    res.status(500).render('error', { message: 'Error loading event' });
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
  getEventDetail,
  submitInquiry
};

