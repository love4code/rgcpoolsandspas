const Product = require('../models/Product');
const Media = require('../models/Media');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('featuredImage')
      .sort({ createdAt: -1 });

    res.render('admin/products/index', {
      products,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Get products error:', error);
    req.flash('error', 'Error loading products');
    res.redirect('/admin/dashboard');
  }
};

const getProductForm = async (req, res) => {
  try {
    let product = null;
    if (req.params.id) {
      product = await Product.findById(req.params.id).populate('images featuredImage');
    }
    res.render('admin/products/form', { product });
  } catch (error) {
    console.error('Product form error:', error);
    req.flash('error', 'Error loading product form');
    res.redirect('/admin/products');
  }
};

const createProduct = async (req, res) => {
  try {
    const sizes = [];
    if (req.body.sizeLabels && req.body.sizeValues) {
      const labels = Array.isArray(req.body.sizeLabels) ? req.body.sizeLabels : [req.body.sizeLabels];
      const values = Array.isArray(req.body.sizeValues) ? req.body.sizeValues : [req.body.sizeValues];
      
      for (let i = 0; i < labels.length; i++) {
        if (labels[i] && values[i]) {
          sizes.push({ label: labels[i], value: values[i] });
        }
      }
    }

    const productData = {
      name: req.body.name,
      description: req.body.description,
      sizes: sizes,
      images: req.body.images ? (Array.isArray(req.body.images) ? req.body.images : [req.body.images]) : [],
      featuredImage: req.body.featuredImage || null,
      seoTitle: req.body.seoTitle,
      seoDescription: req.body.seoDescription,
      showContactForm: req.body.showContactForm === 'on'
    };

    const product = new Product(productData);
    await product.save();

    req.flash('success', 'Product created successfully');
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Create product error:', error);
    req.flash('error', 'Error creating product: ' + error.message);
    res.redirect('/admin/products/new');
  }
};

const updateProduct = async (req, res) => {
  try {
    const sizes = [];
    if (req.body.sizeLabels && req.body.sizeValues) {
      const labels = Array.isArray(req.body.sizeLabels) ? req.body.sizeLabels : [req.body.sizeLabels];
      const values = Array.isArray(req.body.sizeValues) ? req.body.sizeValues : [req.body.sizeValues];
      
      for (let i = 0; i < labels.length; i++) {
        if (labels[i] && values[i]) {
          sizes.push({ label: labels[i], value: values[i] });
        }
      }
    }

    const productData = {
      name: req.body.name,
      description: req.body.description,
      sizes: sizes,
      images: req.body.images ? (Array.isArray(req.body.images) ? req.body.images : [req.body.images]) : [],
      featuredImage: req.body.featuredImage || null,
      seoTitle: req.body.seoTitle,
      seoDescription: req.body.seoDescription,
      showContactForm: req.body.showContactForm === 'on',
      active: req.body.active === 'on'
    };

    await Product.findByIdAndUpdate(req.params.id, productData);

    req.flash('success', 'Product updated successfully');
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Update product error:', error);
    req.flash('error', 'Error updating product: ' + error.message);
    res.redirect(`/admin/products/${req.params.id}/edit`);
  }
};

const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    req.flash('success', 'Product deleted successfully');
    res.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductForm,
  createProduct,
  updateProduct,
  deleteProduct
};

