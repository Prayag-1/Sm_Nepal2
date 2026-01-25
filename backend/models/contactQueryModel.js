import mongoose from 'mongoose';

const contactQuerySchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ContactQuery = mongoose.model('ContactQuery', contactQuerySchema);

export default ContactQuery;
