const mongoose = require('mongoose');

const panelSchema = new mongoose.Schema({
  panelName: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  service: { type: String, required: true },
  capacity: { type: String, required: true },
  duration: { type: Number, required: true }, // en jours
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  status: { type: String, default: "active" } // active / expired / deleted
});

module.exports = mongoose.model('Panel', panelSchema);
