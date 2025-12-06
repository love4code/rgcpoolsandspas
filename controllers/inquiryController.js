const Inquiry = require('../models/Inquiry');

const getInquiries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const inquiries = await Inquiry.find()
      .populate('productId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Inquiry.countDocuments();
    const totalPages = Math.ceil(total / limit);

    res.render('admin/inquiries/index', {
      inquiries,
      currentPage: page,
      totalPages,
      total,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Get inquiries error:', error);
    req.flash('error', 'Error loading inquiries');
    res.redirect('/admin/dashboard');
  }
};

const markInquiryRead = async (req, res) => {
  try {
    await Inquiry.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  } catch (error) {
    console.error('Mark inquiry read error:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteInquiry = async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    req.flash('success', 'Inquiry deleted successfully');
    res.json({ success: true });
  } catch (error) {
    console.error('Delete inquiry error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getInquiries,
  markInquiryRead,
  deleteInquiry
};

