const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');
const SkinResult = require('../models/SkinResult');
const User = require('../models/User');

const AI_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:5000/predict';

exports.uploadAndPredict = async (req, res) => {
  try {
    if(!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const filePath = path.join(__dirname,'..', req.file.path); // e.g., uploads/xxxxx.jpg

    // Forward to AI service
    const form = new FormData();
    form.append('image', fs.createReadStream(req.file.path));

    const aiRes = await axios.post(AI_URL, form, { headers: form.getHeaders(), timeout: 120000 });
    const data = aiRes.data;

    // Save result to DB
    const skinResult = new SkinResult({
      user: req.userId,
      imageUrl: `/uploads/${path.basename(req.file.path)}`,
      label: data.label,
      probability: data.probability,
      symptoms: data.symptoms || '',
      treatments: data.treatments || '',
      duration: data.duration || ''
    });
    await skinResult.save();

    res.json({ result: skinResult });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Prediction failed' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const results = await SkinResult.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
