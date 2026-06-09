const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    eventName: {
        type: String,
        required: [true, 'Event name is required'],
        trim: true
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: 1,
        max: 5
    },
    feedback: {
        type: String,
        required: [true, 'Feedback message is required'],
        trim: true,
        minlength: [5, 'Feedback must be at least 5 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

feedbackSchema.index({ eventName: 1, createdAt: -1 });

module.exports = mongoose.model('Feedback', feedbackSchema);