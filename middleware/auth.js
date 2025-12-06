const Admin = require('../models/Admin');

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.adminId) {
    return next();
  }
  res.redirect('/admin/login');
};

const requireAuth = async (req, res, next) => {
  try {
    // Check if session exists and has adminId
    if (req.session && req.session.adminId) {
      try {
        const admin = await Admin.findById(req.session.adminId);
        if (admin) {
          req.admin = admin;
          return next();
        } else {
          console.warn('Admin not found for session adminId:', req.session.adminId);
          req.session.destroy();
        }
      } catch (dbError) {
        console.error('Database error in auth middleware:', dbError.message);
      }
    } else {
      console.log('No session or adminId in session');
    }
    res.redirect('/admin/login');
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.redirect('/admin/login');
  }
};

module.exports = {
  isAuthenticated,
  requireAuth
};

