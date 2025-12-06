const Admin = require('../models/Admin');
const Product = require('../models/Product');
const Portfolio = require('../models/Portfolio');
const Service = require('../models/Service');
const Event = require('../models/Event');
const Inquiry = require('../models/Inquiry');
const Media = require('../models/Media');
const Settings = require('../models/Settings');

// Authentication
const getLogin = (req, res) => {
  if (req.session && req.session.adminId) {
    return res.redirect('/admin/dashboard');
  }
  res.render('admin/login', { error: req.flash('error') });
};

const postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin) {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/admin/login');
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/admin/login');
    }

    req.session.adminId = admin._id;
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    req.flash('error', 'Login failed');
    res.redirect('/admin/login');
  }
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
};

const getDashboard = async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    const portfolioCount = await Portfolio.countDocuments();
    const serviceCount = await Service.countDocuments();
    const eventCount = await Event.countDocuments();
    const inquiryCount = await Inquiry.countDocuments({ read: false });
    const mediaCount = await Media.countDocuments();
    const recentInquiries = await Inquiry.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('productId');

    res.render('admin/dashboard', {
      productCount,
      portfolioCount,
      serviceCount,
      eventCount,
      inquiryCount,
      mediaCount,
      recentInquiries
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).render('admin/error', { message: 'Error loading dashboard' });
  }
};

module.exports = {
  getLogin,
  postLogin,
  logout,
  getDashboard
};

