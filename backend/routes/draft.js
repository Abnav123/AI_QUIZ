const express = require('express');
const router = express.Router();
const DraftQuiz = require('../models/DraftQuiz');

// POST /api/draft/save → save draft
router.post('/save', async (req, res) => {
    try {
        const { title, subject, type, questions } = req.body;
        
        // Validate questions have answers
        const validatedQuestions = questions.map(q => {
            // Ensure short answer has answer
            if (type === 'short answer' && (!q.correctAnswer || q.correctAnswer.trim() === '')) {
                q.correctAnswer = 'Please provide answer';
                console.warn(`Warning: Empty answer for short answer question: "${q.question}"`);
            }
            // Ensure multiple response has answers
            if (type === 'multiple response' && (!q.correctAnswers || q.correctAnswers.length === 0)) {
                q.correctAnswers = q.options ? [q.options[0]] : [];
                console.warn(`Warning: No correct answers selected for: "${q.question}"`);
            }
            // Ensure MCQ/TF has answer
            if ((type === 'MCQ' || type === 'true/false') && (!q.correctAnswer || q.correctAnswer.trim() === '')) {
                q.correctAnswer = q.options ? q.options[0] : 'Answer';
                console.warn(`Warning: Empty answer for ${type} question: "${q.question}"`);
            }
            return q;
        });
        
        const newDraft = new DraftQuiz({ 
            title, 
            subject, 
            type, 
            questions: validatedQuestions 
        });
        await newDraft.save();
        res.status(201).json(newDraft);
    } catch (error) {
        console.error('Draft save error:', error);
        res.status(500).json({ error: 'Failed to save draft' });
    }
});

// GET /api/draft/all → fetch drafts
router.get('/all', async (req, res) => {
    try {
        const drafts = await DraftQuiz.find().sort({ createdAt: -1 });
        res.json(drafts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch drafts' });
    }
});

// GET /api/draft/:id → fetch single draft
router.get('/:id', async (req, res) => {
    try {
        const draft = await DraftQuiz.findById(req.params.id);
        if (!draft) return res.status(404).json({ error: 'Draft not found' });
        res.json(draft);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch draft' });
    }
});

// PUT /api/draft/:id → update draft
router.put('/:id', async (req, res) => {
    try {
        const updated = await DraftQuiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update draft' });
    }
});

// DELETE /api/draft/:id → delete draft
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await DraftQuiz.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Draft not found' });
        res.json({ message: 'Draft deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete draft' });
    }
});

module.exports = router;
