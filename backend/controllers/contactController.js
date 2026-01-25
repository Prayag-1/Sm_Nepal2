import asyncHandler from '../middleware/asyncHandler.js';
import ContactQuery from '../models/contactQueryModel.js';
import Settings from '../models/settingsModel.js';

// Public: submit contact query
const submitContact = asyncHandler(async (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !message) {
    res.status(400);
    throw new Error('Name, email, and message are required');
  }
  const saved = await ContactQuery.create({ name, email, phone, message });
  res.status(201).json(saved);
});

// Admin: list queries
const listQueries = asyncHandler(async (req, res) => {
  const queries = await ContactQuery.find({}).sort({ createdAt: -1 });
  res.json(queries);
});

// Admin: mark read
const markQueryRead = asyncHandler(async (req, res) => {
  const query = await ContactQuery.findById(req.params.id);
  if (!query) {
    res.status(404);
    throw new Error('Query not found');
  }
  query.isRead = true;
  const updated = await query.save();
  res.json(updated);
});

// Public: get settings
const getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  res.json(settings);
});

// Admin: update settings
const updateSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }

  Object.keys(req.body).forEach((key) => {
    settings[key] = req.body[key];
  });

  const updated = await settings.save();
  res.json(updated);
});

export {
  submitContact,
  listQueries,
  markQueryRead,
  getSettings,
  updateSettings,
};
