import mongoose from 'mongoose';

const settingsSchema = mongoose.Schema(
  {
    siteName: { type: String, default: 'Surgical Mart Nepal' },
    tagline: { type: String, default: 'Trusted medical supplies' },
    footerText: { type: String, default: 'Surgical Mart Nepal by Prayag Nepal' },
    contactPhone: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    address: { type: String, default: '' },
    seoTitle: { type: String, default: 'Surgical Mart Nepal' },
    seoDescription: { type: String, default: 'Medical and surgical supplies for clinics, hospitals, and caregivers across Nepal.' },
    socialFacebook: { type: String, default: '' },
    socialInstagram: { type: String, default: '' },
    socialWhatsApp: { type: String, default: '' },
    attributes: { type: Map, of: String, default: {} },
    homepageNote: { type: String, default: '' },
  },
  { timestamps: true }
);

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
