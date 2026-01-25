import mongoose from 'mongoose';

const categorySchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model('Category', categorySchema);

export default Category;
