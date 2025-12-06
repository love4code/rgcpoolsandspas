const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const adminController = require('../controllers/adminController');
const mediaController = require('../controllers/mediaController');
const productController = require('../controllers/productController');
const portfolioController = require('../controllers/portfolioController');
const serviceController = require('../controllers/serviceController');
const eventController = require('../controllers/eventController');
const settingsController = require('../controllers/settingsController');
const inquiryController = require('../controllers/inquiryController');

// Debug route for session testing (remove in production)
router.get('/test-session', (req, res) => {
  res.json({
    sessionExists: !!req.session,
    sessionId: req.sessionID,
    adminId: req.session.adminId || null,
    isHeroku: !!process.env.DYNO,
    cookie: req.headers.cookie
  });
});

// Debug route - test if sessions work
router.get('/test-session', (req, res) => {
  res.json({
    sessionExists: !!req.session,
    sessionId: req.sessionID,
    adminId: req.session.adminId || null,
    isHeroku: !!process.env.DYNO,
    cookieHeader: req.headers.cookie || 'no cookies',
    userAgent: req.headers['user-agent']
  });
});

// Auth routes
router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin);
router.get('/logout', adminController.logout);

// Dashboard
router.get('/dashboard', requireAuth, adminController.getDashboard);

// Media routes
router.get('/media', requireAuth, mediaController.getMediaLibrary);
router.post('/media/upload', requireAuth, upload.array('images', 10), mediaController.uploadMedia);
router.get('/media/image/:id/:size?', mediaController.getMediaImage);
router.delete('/media/:id', requireAuth, mediaController.deleteMedia);
router.get('/media/modal', requireAuth, mediaController.getMediaModal);

// Product routes
router.get('/products', requireAuth, productController.getProducts);
router.get('/products/new', requireAuth, productController.getProductForm);
router.get('/products/:id/edit', requireAuth, productController.getProductForm);
router.post('/products', requireAuth, productController.createProduct);
router.post('/products/:id', requireAuth, productController.updateProduct);
router.delete('/products/:id', requireAuth, productController.deleteProduct);

// Portfolio routes
router.get('/portfolio', requireAuth, portfolioController.getPortfolio);
router.get('/portfolio/new', requireAuth, portfolioController.getPortfolioForm);
router.get('/portfolio/:id/edit', requireAuth, portfolioController.getPortfolioForm);
router.post('/portfolio', requireAuth, portfolioController.createPortfolio);
router.post('/portfolio/:id', requireAuth, portfolioController.updatePortfolio);
router.delete('/portfolio/:id', requireAuth, portfolioController.deletePortfolio);

// Service routes
router.get('/services', requireAuth, serviceController.getServices);
router.get('/services/new', requireAuth, serviceController.getServiceForm);
router.get('/services/:id/edit', requireAuth, serviceController.getServiceForm);
router.post('/services', requireAuth, serviceController.createService);
router.post('/services/:id', requireAuth, serviceController.updateService);
router.delete('/services/:id', requireAuth, serviceController.deleteService);

// Event routes
router.get('/events', requireAuth, eventController.getEvents);
router.get('/events/new', requireAuth, eventController.getEventForm);
router.get('/events/:id/edit', requireAuth, eventController.getEventForm);
router.post('/events', requireAuth, eventController.createEvent);
router.post('/events/:id', requireAuth, eventController.updateEvent);
router.delete('/events/:id', requireAuth, eventController.deleteEvent);

// Settings routes
router.get('/settings', requireAuth, settingsController.getSettings);
router.post('/settings', requireAuth, settingsController.updateSettings);

// Inquiry routes
router.get('/inquiries', requireAuth, inquiryController.getInquiries);
router.post('/inquiries/:id/read', requireAuth, inquiryController.markInquiryRead);
router.delete('/inquiries/:id', requireAuth, inquiryController.deleteInquiry);

module.exports = router;

