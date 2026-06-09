const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// GET all feedback
router.get('/', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.json({ 
            success: true, 
            count: feedbacks.length,
            data: feedbacks 
        });
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching feedback', 
            error: error.message 
        });
    }
});

// POST new feedback
router.post('/', async (req, res) => {
    try {
        const { fullName, email, eventName, rating, feedback } = req.body;
        
        console.log('Received feedback:', { fullName, email, eventName, rating, feedback });
        
        // Validation
        const errors = [];
        if (!fullName) errors.push('Full name is required');
        if (!email) errors.push('Email is required');
        if (!eventName) errors.push('Event name is required');
        if (!rating) errors.push('Rating is required');
        if (!feedback) errors.push('Feedback message is required');
        
        if (errors.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Validation failed',
                errors: errors
            });
        }
        
        // Validate rating range
        const ratingNum = parseInt(rating);
        if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }
        
        const newFeedback = new Feedback({
            fullName,
            email,
            eventName,
            rating: ratingNum,
            feedback
        });
        
        const savedFeedback = await newFeedback.save();
        
        res.status(201).json({ 
            success: true, 
            message: 'Feedback submitted successfully! Thank you for sharing your experience.',
            data: savedFeedback 
        });
    } catch (error) {
        console.error('Error saving feedback:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error saving feedback', 
            error: error.message 
        });
    }
});

// GET feedback by event
router.get('/event/:eventName', async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ 
            eventName: req.params.eventName 
        }).sort({ createdAt: -1 });
        
        res.json({ 
            success: true, 
            count: feedbacks.length,
            data: feedbacks 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET feedback statistics
router.get('/stats/summary', async (req, res) => {
    try {
        const totalFeedback = await Feedback.countDocuments();
        const averageRating = await Feedback.aggregate([
            { $group: { _id: null, avgRating: { $avg: "$rating" } } }
        ]);
        
        const eventsStats = await Feedback.aggregate([
            { $group: { 
                _id: "$eventName", 
                count: { $sum: 1 },
                avgRating: { $avg: "$rating" }
            }}
        ]);
        
        res.json({
            success: true,
            data: {
                totalFeedback,
                averageRating: averageRating[0]?.avgRating || 0,
                eventsStats
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;