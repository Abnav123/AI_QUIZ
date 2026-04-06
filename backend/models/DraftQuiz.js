const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subject: { type: String, required: true },
    type: { type: String, enum: ['MCQ', 'short answer', 'true/false', 'multiple response'], required: true },
    questions: [{
        question: String,
        options: [String],
        correctAnswers: [String],
        correctAnswer: String
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DraftQuiz', QuizSchema);
