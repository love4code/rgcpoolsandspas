const Admin = require('../models/Admin');

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.adminId) {
    return next();
  }
  res.redirect('/admin/login');
};

const requireAuth = async (req, res, next) => {
  try {
    if (req.session && req.session.adminId) {
      const admin = await Admin.findById(req.session.adminId);
      if (admin) {
        req.admin = admin;
        return next();
      }
    }
    res.redirect('/admin/login');
  } catch (error) {
    console.error('Auth error:', error);
    res.redirect('/admin/login');
  }
};

module.exports = {
  isAuthenticated,
  requireAuth
};

