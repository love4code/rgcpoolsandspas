const Admin = require('../models/Admin');

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.adminId) {
    return next();
  }
  res.redirect('/admin/login');
};

const requireAuth = async (req, res, next) => {
  try {
    // Check if this is an API request (JSON response expected)
    const isApiRequest = req.headers['x-requested-with'] === 'XMLHttpRequest' || 
                        req.headers['content-type']?.includes('application/json') ||
                        req.path.includes('/upload') ||
                        req.method !== 'GET';

    // Check if session exists and has adminId
    if (req.session && req.session.adminId) {
      try {
        const admin = await Admin.findById(req.session.adminId);
        if (admin) {
          req.admin = admin;
          return next();
        } else {
          console.warn('Admin not found for session adminId:', req.session.adminId);
          req.session.destroy(() => {
            if (isApiRequest) {
              return res.status(401).json({ error: 'Authentication required' });
            }
            res.redirect('/admin/login');
          });
          return;
        }
      } catch (dbError) {
        console.error('Database error in auth middleware:', dbError.message);
        if (isApiRequest) {
          return res.status(500).json({ error: 'Database error' });
        }
      }
    } else {
      if (process.env.DYNO) {
        console.log('No session or adminId - Session ID:', req.sessionID, 'Session exists:', !!req.session);
      }
    }
    
    if (isApiRequest) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    res.redirect('/admin/login');
  } catch (error) {
    console.error('Auth middleware error:', error);
    const isApiRequest = req.headers['x-requested-with'] === 'XMLHttpRequest' || 
                        req.headers['content-type']?.includes('application/json') ||
                        req.path.includes('/upload') ||
                        req.method !== 'GET';
    if (isApiRequest) {
      return res.status(500).json({ error: 'Authentication error' });
    }
    res.redirect('/admin/login');
  }
};

module.exports = {
  isAuthenticated,
  requireAuth
};

