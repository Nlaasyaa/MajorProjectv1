// index.js

require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app'); // Import the configured Express app from app.js

// Configuration variables are pulled directly from process.env via dotenv
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  // These options are often required to suppress warnings
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
    console.log('✅ Connected to MongoDB');
    
    // Start the Express server after a successful database connection
    app.listen(PORT, () => {
        console.log(`🚀 Backend server started on port ${PORT}`);
        console.log(`Open in browser: http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('❌ MongoDB connection error:', err);
});
