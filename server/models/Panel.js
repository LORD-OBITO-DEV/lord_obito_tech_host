import mongoose from 'mongoose';

const PanelSchema = new mongoose.Schema({
  panelId: String, // id from pterodactyl or provisional id
  type: String, // Node.js / Python / Minecraft
  ram: String,
  cpu: String,
  disk: String,
  durationDays: Number,
  username: String,
  password: String,
  email: String,
  price: Number,
  status: { type: String, default: 'pending' }, // pending, active, expired
  createdAt: { type: Date, default: Date.now },
  expireAt: Date
});

export default mongoose.models.Panel || mongoose.model('Panel', PanelSchema);
