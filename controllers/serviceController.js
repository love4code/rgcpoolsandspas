const Service = require('../models/Service');

const getServices = async (req, res) => {
  try {
    const services = await Service.find()
      .sort({ displayOrder: 1, createdAt: -1 });

    res.render('admin/services/index', {
      services,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Get services error:', error);
    req.flash('error', 'Error loading services');
    res.redirect('/admin/dashboard');
  }
};

const getServiceForm = async (req, res) => {
  try {
    let service = null;
    if (req.params.id) {
      service = await Service.findById(req.params.id);
    }
    res.render('admin/services/form', { service });
  } catch (error) {
    console.error('Service form error:', error);
    req.flash('error', 'Error loading service form');
    res.redirect('/admin/services');
  }
};

const createService = async (req, res) => {
  try {
    const serviceData = {
      name: req.body.name,
      description: req.body.description,
      icon: req.body.icon,
      displayOrder: parseInt(req.body.displayOrder) || 0,
      featured: req.body.featured === 'on'
    };

    const service = new Service(serviceData);
    await service.save();

    req.flash('success', 'Service created successfully');
    res.redirect('/admin/services');
  } catch (error) {
    console.error('Create service error:', error);
    req.flash('error', 'Error creating service: ' + error.message);
    res.redirect('/admin/services/new');
  }
};

const updateService = async (req, res) => {
  try {
    const serviceData = {
      name: req.body.name,
      description: req.body.description,
      icon: req.body.icon,
      displayOrder: parseInt(req.body.displayOrder) || 0,
      featured: req.body.featured === 'on',
      active: req.body.active === 'on'
    };

    await Service.findByIdAndUpdate(req.params.id, serviceData);

    req.flash('success', 'Service updated successfully');
    res.redirect('/admin/services');
  } catch (error) {
    console.error('Update service error:', error);
    req.flash('error', 'Error updating service: ' + error.message);
    res.redirect(`/admin/services/${req.params.id}/edit`);
  }
};

const deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    req.flash('success', 'Service deleted successfully');
    res.json({ success: true });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getServices,
  getServiceForm,
  createService,
  updateService,
  deleteService
};

