const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { uploadAndPredict, getHistory } = require('../controllers/skinController');
const authMiddleware = require('../utils/authMiddleware');

router.post('/predict', authMiddleware, upload.single('image'), uploadAndPredict);
router.get('/history', authMiddleware, getHistory);

module.exports = router;
