// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const skinRoutes = require('./routes/skin');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=> console.log('Connected to MongoDB'))
  .catch(err => console.error('Mongo connect error',err));

app.use('/api/auth', authRoutes);
app.use('/api/skin', skinRoutes);

app.listen(PORT, ()=> console.log(`Backend started on ${PORT}`));
