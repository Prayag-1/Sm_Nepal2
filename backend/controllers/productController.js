import mongoose from 'mongoose';
import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';
import Brand from '../models/brandModel.js';

// @desc    Fetch all products (with filters + pagination)
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.pageNumber) || 1;

  const filters = {};

  if (req.query.keyword) {
    const keyword = req.query.keyword.trim();
    filters.$or = [
      { name: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
    ];
  }

  if (req.query.category) {
    if (!mongoose.Types.ObjectId.isValid(req.query.category)) {
      res.status(400);
      throw new Error('Invalid category');
    }
    filters.category = req.query.category;
  }

  if (req.query.subcategory) {
    if (!mongoose.Types.ObjectId.isValid(req.query.subcategory)) {
      res.status(400);
      throw new Error('Invalid subcategory');
    }
    filters.subcategory = req.query.subcategory;
  }

  if (req.query.brand) {
    if (!mongoose.Types.ObjectId.isValid(req.query.brand)) {
      res.status(400);
      throw new Error('Invalid brand');
    }
    filters.brand = req.query.brand;
  }

  const count = await Product.countDocuments(filters);
  const products = await Product.find(filters)
    .populate('brand', 'name image')
    .populate('category', 'name parentCategory')
    .populate('subcategory', 'name parentCategory')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('brand', 'name image')
    .populate('category', 'name parentCategory')
    .populate('subcategory', 'name parentCategory');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json(product);
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const brand = await Brand.findOne().sort({ createdAt: 1 });
  const category = await Category.findOne({ parentCategory: null }).sort({
    createdAt: 1,
  });

  if (!brand || !category) {
    res.status(400);
    throw new Error('Create a brand and category before adding products');
  }

  const product = new Product({
    name: 'Sample Product',
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
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const {
    name,
    price,
    image,
    brand,
    category,
    subcategory,
    countInStock,
    description,
    isFeatured,
    seoTitle,
    seoDescription,
    seoKeywords,
  } = req.body;

  if (typeof name !== 'undefined') product.name = name;
  if (typeof price !== 'undefined') product.price = price;
  if (typeof image !== 'undefined') product.image = image;
  if (typeof description !== 'undefined') product.description = description;
  if (typeof countInStock !== 'undefined') product.countInStock = countInStock;
  if (typeof isFeatured !== 'undefined') product.isFeatured = isFeatured;
  if (typeof seoTitle !== 'undefined') product.seoTitle = seoTitle.toString().trim();
  if (typeof seoDescription !== 'undefined')
    product.seoDescription = seoDescription.toString().trim();

  if (typeof seoKeywords !== 'undefined') {
    product.seoKeywords = Array.isArray(seoKeywords)
      ? seoKeywords.filter(Boolean).map((k) => k.toString().trim())
      : typeof seoKeywords === 'string' && seoKeywords.trim()
        ? seoKeywords
            .split(',')
            .map((k) => k.trim())
            .filter(Boolean)
        : [];
  }

  if (typeof brand !== 'undefined') {
    if (!mongoose.Types.ObjectId.isValid(brand)) {
      res.status(400);
      throw new Error('Invalid brand');
    }
    product.brand = brand;
  }

  if (typeof category !== 'undefined') {
    if (!mongoose.Types.ObjectId.isValid(category)) {
      res.status(400);
      throw new Error('Invalid category');
    }
    product.category = category;
  }

  if (typeof subcategory !== 'undefined') {
    if (subcategory) {
      if (!mongoose.Types.ObjectId.isValid(subcategory)) {
        res.status(400);
        throw new Error('Invalid subcategory');
      }
      product.subcategory = subcategory;
    } else {
      product.subcategory = null;
    }
  }

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await Product.deleteOne({ _id: product._id });
  res.json({ message: 'Product removed' });
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

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
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .populate('brand', 'name image')
    .sort({ rating: -1 })
    .limit(5);

  res.json(products);
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true })
    .populate('brand', 'name image')
    .populate('category', 'name parentCategory')
    .sort({ updatedAt: -1 });

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
