import asyncHandler from '../middleware/asyncHandler.js';
import mongoose from 'mongoose';
import Product from '../models/productModel.js';
import Brand from '../models/brandModel.js';
import Category from '../models/categoryModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(process.env.PAGINATION_LIMIT) || 8;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const filters = { ...keyword };

  if (req.query.category) {
    if (!mongoose.Types.ObjectId.isValid(req.query.category)) {
      res.status(400);
      throw new Error('Invalid category id');
    }
    filters.category = req.query.category;
  }

  if (req.query.subcategory) {
    if (!mongoose.Types.ObjectId.isValid(req.query.subcategory)) {
      res.status(400);
      throw new Error('Invalid subcategory id');
    }
    filters.subcategory = req.query.subcategory;
  }

  if (req.query.brand) {
    if (!mongoose.Types.ObjectId.isValid(req.query.brand)) {
      res.status(400);
      throw new Error('Invalid brand id');
    }
    filters.brand = req.query.brand;
  }

  const count = await Product.countDocuments({ ...filters });
  const products = await Product.find({ ...filters })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate('brand', 'name')
    .populate('category', 'name')
    .populate('subcategory', 'name');

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  // NOTE: checking for valid ObjectId to prevent CastError moved to separate
  // middleware. See README for more info.

  const product = await Product.findById(req.params.id)
    .populate('brand', 'name')
    .populate('category', 'name')
    .populate('subcategory', 'name');
  if (product) {
    return res.json(product);
  } else {
    // NOTE: this will run if a valid ObjectId but no product was found
    // i.e. product may be null
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const brand = await Brand.findOne();
  const category = await Category.findOne({ parentCategory: null });

  if (!brand || !category) {
    res.status(400);
    throw new Error('Please add at least one brand and category before creating products.');
  }

  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: brand._id,
    category: category._id,
    subcategory: null,
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    subcategory,
    countInStock,
    isFeatured,
    seoTitle,
    seoDescription,
    seoKeywords,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    if (!brand || !category) {
      res.status(400);
      throw new Error('Brand and category are required');
    }

    const [brandExists, categoryExists, subcategoryExists] = await Promise.all([
      Brand.findById(brand),
      Category.findById(category),
      subcategory ? Category.findById(subcategory) : null,
    ]);

    if (!brandExists) {
      res.status(400);
      throw new Error('Brand not found');
    }

    if (!categoryExists) {
      res.status(400);
      throw new Error('Category not found');
    }

    if (subcategory && !subcategoryExists) {
      res.status(400);
      throw new Error('Subcategory not found');
    }

    if (subcategoryExists && categoryExists) {
      if (
        !subcategoryExists.parentCategory ||
        subcategoryExists.parentCategory.toString() !== categoryExists._id.toString()
      ) {
        res.status(400);
        throw new Error('Subcategory must belong to the selected category');
      }
    }

    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.subcategory = subcategory || null;
    product.countInStock = countInStock;
    product.seoTitle =
      typeof seoTitle !== 'undefined' ? seoTitle.toString().trim() : product.seoTitle || '';
    product.seoDescription =
      typeof seoDescription !== 'undefined'
        ? seoDescription.toString().trim()
        : product.seoDescription || '';
    product.seoKeywords = Array.isArray(seoKeywords)
      ? seoKeywords.filter(Boolean).map((k) => k.toString().trim())
      : typeof seoKeywords === 'string' && seoKeywords.trim()
        ? seoKeywords
            .split(',')
            .map((k) => k.trim())
            .filter(Boolean)
        : product.seoKeywords || [];
    if (typeof isFeatured !== 'undefined') {
      product.isFeatured = isFeatured;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true })
    .sort({ updatedAt: -1 })
    .limit(8)
    .populate('brand', 'name')
    .populate('category', 'name');
  res.json(products);
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getFeaturedProducts,
};
