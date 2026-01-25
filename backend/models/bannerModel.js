import mongoose from 'mongoose';

const bannerSchema = mongoose.Schema(
  {
    image: { type: String, required: true },
    link: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;
