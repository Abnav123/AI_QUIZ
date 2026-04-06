const mongoose = require('mongoose');

const PublishedQuizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subject: { type: String, required: true },
    type: { type: String, enum: ['MCQ', 'short answer', 'true/false', 'multiple response'], required: true },
    questions: [{
        question: String,
        options: [String],
        correctAnswers: [String],
        correctAnswer: String
    }],
    publishedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PublishedQuiz', PublishedQuizSchema);
