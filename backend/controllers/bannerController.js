import asyncHandler from '../middleware/asyncHandler.js';
import Banner from '../models/bannerModel.js';

// Public: get banners
const getBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find({}).sort({ order: 1, createdAt: -1 });
  res.json(banners);
});

// Admin: create banner
const createBanner = asyncHandler(async (req, res) => {
  const { image, link, order = 0 } = req.body;
  const banner = await Banner.create({ image, link, order });
  res.status(201).json(banner);
});

// Admin: delete banner
const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) {
    res.status(404);
    throw new Error('Banner not found');
  }
  await banner.deleteOne();
  res.json({ message: 'Banner removed' });
});

// Admin: update order or fields
const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) {
    res.status(404);
    throw new Error('Banner not found');
  }
  const { image, link, order } = req.body;
  if (image) banner.image = image;
  if (link) banner.link = link;
  if (order !== undefined) banner.order = order;
  const updated = await banner.save();
  res.json(updated);
});

export { getBanners, createBanner, deleteBanner, updateBanner };
