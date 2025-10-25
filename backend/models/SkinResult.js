// models/SkinResult.js
const mongoose = require('mongoose');

const skinResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  imageUrl: String, // path to file in uploads or remote URL
  label: String,
  probability: Number,
  symptoms: String,
  treatments: String,
  duration: String
}, { timestamps: true });

module.exports = mongoose.model('SkinResult', skinResultSchema);
