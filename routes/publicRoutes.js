const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get('/', publicController.getHome);
router.get('/about', publicController.getAbout);
router.get('/contact', publicController.getContact);
router.get('/products', publicController.getProducts);
router.get('/products/:slug', publicController.getProductDetail);
router.get('/portfolio', publicController.getPortfolio);
router.get('/portfolio/:slug', publicController.getPortfolioDetail);
router.get('/calendar', publicController.getCalendar);
router.post('/inquiry', publicController.submitInquiry);

module.exports = router;

