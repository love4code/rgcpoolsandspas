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
  // Force output - use console.error for immediate visibility
  console.error('🔴 ==========================================');
  console.error('🔴 LOGIN FUNCTION CALLED');
  console.error('🔴 ==========================================');
  console.log('=== LOGIN POST REQUEST RECEIVED ===');
  console.log('Request body keys:', Object.keys(req.body || {}));
  
  try {
    const { username, password } = req.body;
    
    console.log('=== LOGIN REQUEST ===');
    console.log('Username provided:', username || 'NOT PROVIDED');
    console.log('Password provided:', password ? 'YES (hidden)' : 'NOT PROVIDED');
    
    if (!username || !password) {
      console.log('❌ Missing username or password');
      req.flash('error', 'Please provide both username and password');
      return res.redirect('/admin/login');
    }

    console.log('🔍 Looking for admin with username:', username);
    const admin = await Admin.findOne({ username });

    if (!admin) {
      console.log('❌ Admin not found with username:', username);
      req.flash('error', 'Invalid credentials');
      return res.redirect('/admin/login');
    }

    console.log('✅ Admin found! ID:', admin._id.toString());
    console.log('🔐 Checking password...');
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      console.log('❌ Password does not match');
      req.flash('error', 'Invalid credentials');
      return res.redirect('/admin/login');
    }

    console.log('✅✅✅ PASSWORD MATCHES! ✅✅✅');

    // Set session data
    req.session.adminId = admin._id.toString();
    
    // Log session info for debugging (will show in Heroku logs)
    console.log('=== LOGIN SUCCESS ===');
    console.log('Username:', username);
    console.log('Admin ID:', admin._id.toString());
    console.log('Session ID:', req.sessionID);
    console.log('Is Heroku:', !!process.env.DYNO);
    console.log('Session adminId set to:', req.session.adminId);
    
    // Save session before redirect to ensure it's persisted
    req.session.save((err) => {
      if (err) {
        console.error('❌ Session save error:', err.message);
        console.error('Error stack:', err.stack);
        req.flash('error', 'Login failed - session error: ' + err.message);
        return res.redirect('/admin/login');
      }
      
      console.log('✅ Session saved successfully');
      console.log('Session adminId:', req.session.adminId);
      console.log('Session ID:', req.sessionID);
      console.log('Redirecting to dashboard...');
      
      res.redirect('/admin/dashboard');
    });
  } catch (error) {
    console.error('Login error:', error);
    req.flash('error', 'Login failed: ' + error.message);
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

