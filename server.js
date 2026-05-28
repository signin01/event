const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// MongoDB Atlas connection (updated for Mongoose v8+)
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('✅ Connected to MongoDB Atlas successfully!');
    console.log('📊 Database: event_feedback_db');
})
.catch(err => {
    console.error('❌ MongoDB Atlas connection error:', err.message);
    console.log('💡 Please check:');
    console.log('   1. Your internet connection');
    console.log('   2. MongoDB Atlas credentials in .env file');
    console.log('   3. Network access in MongoDB Atlas (add your IP)');
});

// Welcome route
app.get('/api/welcome', (req, res) => {
    res.json({ 
        success: true,
        message: 'Welcome to Event Feedback Management System API!',
        database: 'MongoDB Atlas',
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/api/feedback', feedbackRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 API Endpoints:`);
    console.log(`   - GET  /api/welcome - Welcome message`);
    console.log(`   - GET  /api/feedback - Get all feedback`);
    console.log(`   - POST /api/feedback - Submit new feedback`);
    console.log(`   - GET  /api/feedback/stats/summary - Get statistics`);
    console.log(`🌐 Access the application: http://localhost:${PORT}`);
});
