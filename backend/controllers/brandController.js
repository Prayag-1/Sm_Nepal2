import asyncHandler from '../middleware/asyncHandler.js';
import Brand from '../models/brandModel.js';
import Product from '../models/productModel.js';
import mongoose from 'mongoose';

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
const getBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find().sort({ name: 1 }).lean();
  res.json(brands);
});

// @desc    Create brand
// @route   POST /api/brands
// @access  Private/Admin
const createBrand = asyncHandler(async (req, res) => {
  const { name, description, image, seoTitle, seoDescription, seoKeywords } = req.body;
  const trimmedName = name?.trim();

  if (!trimmedName) {
    res.status(400);
    throw new Error('Name is required');
  }

  const existing = await Brand.findOne({
    name: { $regex: `^${trimmedName}$`, $options: 'i' },
  });
  if (existing) {
    res.status(400);
    throw new Error('Brand name must be unique');
  }

  try {
    const brand = await Brand.create({
      name: trimmedName,
      description,
      image: image || '',
      seoTitle: seoTitle?.toString().trim() || '',
      seoDescription: seoDescription?.toString().trim() || '',
      seoKeywords: Array.isArray(seoKeywords)
        ? seoKeywords.filter(Boolean).map((k) => k.toString().trim())
        : typeof seoKeywords === 'string' && seoKeywords.trim()
          ? seoKeywords
              .split(',')
              .map((k) => k.trim())
              .filter(Boolean)
          : [],
    });
    res.status(201).json(brand);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400);
      throw new Error('Brand name must be unique');
    }
    if (err.name === 'ValidationError') {
      res.status(400);
      throw new Error(err.message);
    }
    throw err;
  }
});

// @desc    Update brand
// @route   PUT /api/brands/:id
// @access  Private/Admin
const updateBrand = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(404);
    throw new Error('Brand not found');
  }
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    res.status(404);
    throw new Error('Brand not found');
  }

  const { name, description, image, seoTitle, seoDescription, seoKeywords } = req.body;

  if (name) {
    const trimmedName = name.trim();
    const existing = await Brand.findOne({
      name: { $regex: `^${trimmedName}$`, $options: 'i' },
      _id: { $ne: brand._id },
    });
    if (existing) {
      res.status(400);
      throw new Error('Brand name must be unique');
    }
    brand.name = trimmedName;
  }

  if (typeof description !== 'undefined') {
    brand.description = description;
  }

  if (typeof image !== 'undefined') {
    brand.image = image || '';
  }

  if (typeof seoTitle !== 'undefined') {
    brand.seoTitle = seoTitle.toString().trim();
  }

  if (typeof seoDescription !== 'undefined') {
    brand.seoDescription = seoDescription.toString().trim();
  }

  if (typeof seoKeywords !== 'undefined') {
    brand.seoKeywords = Array.isArray(seoKeywords)
      ? seoKeywords.filter(Boolean).map((k) => k.toString().trim())
      : typeof seoKeywords === 'string' && seoKeywords.trim()
        ? seoKeywords
            .split(',')
            .map((k) => k.trim())
            .filter(Boolean)
        : [];
  }

  try {
    const updated = await brand.save();
    res.json(updated);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400);
      throw new Error('Brand name must be unique');
    }
    if (err.name === 'ValidationError') {
      res.status(400);
      throw new Error(err.message);
    }
    throw err;
  }
});

// @desc    Delete brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
const deleteBrand = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid brand id');
  }

  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    res.status(404);
    throw new Error('Brand not found');
  }

  const inUse = await Product.exists({ brand: brand._id });
  if (inUse) {
    res.status(400);
    throw new Error('Cannot delete a brand in use by products');
  }

  await Brand.deleteOne({ _id: brand._id });
  res.json({ message: 'Brand removed' });
});

export { getBrands, createBrand, updateBrand, deleteBrand };
