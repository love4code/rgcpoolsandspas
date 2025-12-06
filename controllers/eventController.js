const Event = require('../models/Event');

const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ startDate: 1 });

    res.render('admin/events/index', {
      events,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Get events error:', error);
    req.flash('error', 'Error loading events');
    res.redirect('/admin/dashboard');
  }
};

const getEventForm = async (req, res) => {
  try {
    let event = null;
    if (req.params.id) {
      event = await Event.findById(req.params.id);
      // Format dates for input fields
      if (event.startDate) {
        event.startDateFormatted = new Date(event.startDate).toISOString().slice(0, 16);
      }
      if (event.endDate) {
        event.endDateFormatted = new Date(event.endDate).toISOString().slice(0, 16);
      }
    }
    res.render('admin/events/form', { event });
  } catch (error) {
    console.error('Event form error:', error);
    req.flash('error', 'Error loading event form');
    res.redirect('/admin/events');
  }
};

const createEvent = async (req, res) => {
  try {
    const eventData = {
      title: req.body.title,
      description: req.body.description,
      startDate: new Date(req.body.startDate),
      endDate: req.body.endDate ? new Date(req.body.endDate) : null,
      allDay: req.body.allDay === 'on',
      location: req.body.location
    };

    const event = new Event(eventData);
    await event.save();

    req.flash('success', 'Event created successfully');
    res.redirect('/admin/events');
  } catch (error) {
    console.error('Create event error:', error);
    req.flash('error', 'Error creating event: ' + error.message);
    res.redirect('/admin/events/new');
  }
};

const updateEvent = async (req, res) => {
  try {
    const eventData = {
      title: req.body.title,
      description: req.body.description,
      startDate: new Date(req.body.startDate),
      endDate: req.body.endDate ? new Date(req.body.endDate) : null,
      allDay: req.body.allDay === 'on',
      location: req.body.location,
      active: req.body.active === 'on'
    };

    await Event.findByIdAndUpdate(req.params.id, eventData);

    req.flash('success', 'Event updated successfully');
    res.redirect('/admin/events');
  } catch (error) {
    console.error('Update event error:', error);
    req.flash('error', 'Error updating event: ' + error.message);
    res.redirect(`/admin/events/${req.params.id}/edit`);
  }
};

const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    req.flash('success', 'Event deleted successfully');
    res.json({ success: true });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getEvents,
  getEventForm,
  createEvent,
  updateEvent,
  deleteEvent
};

