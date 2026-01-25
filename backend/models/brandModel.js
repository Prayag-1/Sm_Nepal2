import mongoose from 'mongoose';

const brandSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
    image: { type: String, default: '' },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
    seoKeywords: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const Brand = mongoose.model('Brand', brandSchema);

export default Brand;
