import asyncHandler from '../middleware/asyncHandler.js';
import Tutorial from '../models/tutorialModel.js';

const detectPlatform = (url = '') => {
  const lowered = url.toLowerCase();
  if (lowered.includes('youtube.com') || lowered.includes('youtu.be')) return 'youtube';
  if (lowered.includes('facebook.com')) return 'facebook';
  return 'unknown';
};

// @desc    Get active tutorials ordered
// @route   GET /api/tutorials
// @access  Public
const getTutorials = asyncHandler(async (req, res) => {
  const tutorials = await Tutorial.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).lean();
  res.json(tutorials);
});

// @desc    Create tutorial
// @route   POST /api/tutorials
// @access  Private/Admin
const createTutorial = asyncHandler(async (req, res) => {
  const { title, description, videoUrl, order, isActive, thumbnail } = req.body;
  const trimmedTitle = title?.trim();
  const trimmedUrl = videoUrl?.trim();

  if (!trimmedTitle || !trimmedUrl) {
    res.status(400);
    throw new Error('Title and video URL are required');
  }

  const tutorial = await Tutorial.create({
    title: trimmedTitle,
    description: description?.trim() || '',
    videoUrl: trimmedUrl,
    platform: detectPlatform(trimmedUrl),
    order: typeof order !== 'undefined' ? order : 0,
    isActive: typeof isActive === 'boolean' ? isActive : true,
    thumbnail: thumbnail?.trim() || '',
  });

  res.status(201).json(tutorial);
});

// @desc    Update tutorial
// @route   PUT /api/tutorials/:id
// @access  Private/Admin
const updateTutorial = asyncHandler(async (req, res) => {
  const tutorial = await Tutorial.findById(req.params.id);
  if (!tutorial) {
    res.status(404);
    throw new Error('Tutorial not found');
  }

  const { title, description, videoUrl, order, isActive, thumbnail } = req.body;

  if (typeof title !== 'undefined') tutorial.title = title.trim();
  if (typeof description !== 'undefined') tutorial.description = description.trim();
  if (typeof videoUrl !== 'undefined') {
    tutorial.videoUrl = videoUrl.trim();
    tutorial.platform = detectPlatform(videoUrl);
  }
  if (typeof order !== 'undefined') tutorial.order = order;
  if (typeof isActive !== 'undefined') tutorial.isActive = isActive;
  if (typeof thumbnail !== 'undefined') tutorial.thumbnail = thumbnail.trim();

  const updated = await tutorial.save();
  res.json(updated);
});

// @desc    Delete tutorial
// @route   DELETE /api/tutorials/:id
// @access  Private/Admin
const deleteTutorial = asyncHandler(async (req, res) => {
  const tutorial = await Tutorial.findById(req.params.id);
  if (!tutorial) {
    res.status(404);
    throw new Error('Tutorial not found');
  }
  await Tutorial.deleteOne({ _id: tutorial._id });
  res.json({ message: 'Tutorial removed' });
});

export { getTutorials, createTutorial, updateTutorial, deleteTutorial };
