import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import users from './data/users.js';
import products from './data/products.js';
import categories from './data/categories.js';
import brands from './data/brands.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import Category from './models/categoryModel.js';
import Brand from './models/brandModel.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();
    await Brand.deleteMany();

    const createdUsers = await User.insertMany(users);

    const adminUser = createdUsers[0]._id;

    // Seed brands
    const createdBrands = await Brand.insertMany(brands);
    const brandMap = createdBrands.reduce((acc, brand) => {
      acc[brand.name] = brand._id;
      return acc;
    }, {});

    // Seed categories (parents first)
    const parentCategoriesData = categories.filter((cat) => !cat.parentName);
    const createdParentCategories = await Category.insertMany(parentCategoriesData);
    const categoryMap = createdParentCategories.reduce((acc, cat) => {
      acc[cat.name] = cat._id;
      return acc;
    }, {});

    const subcategoriesData = categories.filter((cat) => cat.parentName);
    for (const subcat of subcategoriesData) {
      const parentId = categoryMap[subcat.parentName];
      if (parentId) {
        const created = await Category.create({
          name: subcat.name,
          parentCategory: parentId,
        });
        categoryMap[subcat.name] = created._id;
      }
    }

    const sampleProducts = products.map((product) => {
      const {
        brandName,
        categoryName,
        subcategoryName,
        ...rest
      } = product;

      const categoryId = categoryMap[categoryName];
      const subcategoryId = subcategoryName ? categoryMap[subcategoryName] : null;
      const brandId = brandMap[brandName];

      return {
        ...rest,
        brand: brandId,
        category: categoryId,
        subcategory: subcategoryId || null,
        user: adminUser,
      };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
