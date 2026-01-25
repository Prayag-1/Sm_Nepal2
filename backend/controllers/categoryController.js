import asyncHandler from '../middleware/asyncHandler.js';
import Category from '../models/categoryModel.js';
import Product from '../models/productModel.js';
import mongoose from 'mongoose';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 }).lean();
  res.json(categories);
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, parentCategory } = req.body;
  const trimmedName = name?.trim();

  if (!trimmedName) {
    res.status(400);
    throw new Error('Name is required');
  }

  const existing = await Category.findOne({
    name: { $regex: `^${trimmedName}$`, $options: 'i' },
  });
  if (existing) {
    res.status(400);
    throw new Error('Category name must be unique');
  }

  if (parentCategory) {
    if (!mongoose.Types.ObjectId.isValid(parentCategory)) {
      res.status(400);
      throw new Error('Parent category not found');
    }
    const parentExists = await Category.findById(parentCategory);
    if (!parentExists) {
      res.status(400);
      throw new Error('Parent category not found');
    }
  }

  try {
    const category = await Category.create({
      name: trimmedName,
      parentCategory: parentCategory || null,
    });
    res.status(201).json(category);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400);
      throw new Error('Category name must be unique');
    }
    if (err.name === 'ValidationError') {
      res.status(400);
      throw new Error(err.message);
    }
    throw err;
  }
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const { name, parentCategory } = req.body;

  if (name) {
    const trimmedName = name.trim();
    const existing = await Category.findOne({
      name: { $regex: `^${trimmedName}$`, $options: 'i' },
      _id: { $ne: category._id },
    });
    if (existing) {
      res.status(400);
      throw new Error('Category name must be unique');
    }
    category.name = trimmedName;
  }

  if (typeof parentCategory !== 'undefined') {
    if (parentCategory) {
      if (!mongoose.Types.ObjectId.isValid(parentCategory)) {
        res.status(400);
        throw new Error('Parent category not found');
      }
      const parentExists = await Category.findById(parentCategory);
      if (!parentExists) {
        res.status(400);
        throw new Error('Parent category not found');
      }
      if (parentExists._id.equals(category._id)) {
        res.status(400);
        throw new Error('Category cannot be its own parent');
      }
      category.parentCategory = parentCategory;
    } else {
      category.parentCategory = null;
    }
  }

  // image support removed for stability

  try {
    const updated = await category.save();
    res.json(updated);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400);
      throw new Error('Category name must be unique');
    }
    if (err.name === 'ValidationError') {
      res.status(400);
      throw new Error(err.message);
    }
    throw err;
  }
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const hasChildren = await Category.exists({ parentCategory: category._id });
  if (hasChildren) {
    res.status(400);
    throw new Error('Cannot delete a category with subcategories');
  }

  const inUse = await Product.exists({
    $or: [{ category: category._id }, { subcategory: category._id }],
  });
  if (inUse) {
    res.status(400);
    throw new Error('Cannot delete a category in use by products');
  }

  await Category.deleteOne({ _id: category._id });
  res.json({ message: 'Category removed' });
});

export { getCategories, createCategory, updateCategory, deleteCategory };
