import mongoose from 'mongoose';

const tutorialSchema = mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    videoUrl: { type: String, required: true, trim: true },
    platform: { type: String, enum: ['youtube', 'facebook', 'unknown'], default: 'unknown' },
    thumbnail: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Tutorial = mongoose.model('Tutorial', tutorialSchema);

export default Tutorial;
