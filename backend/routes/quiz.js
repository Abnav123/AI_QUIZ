const express = require('express');
const router = express.Router();
const DraftQuiz = require('../models/DraftQuiz');
const PublishedQuiz = require('../models/PublishedQuiz');
const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://models.inference.ai.azure.com"
});

// 1. AI Quiz Generation
router.post('/generate', async (req, res) => {
    const { subject, keywords, numberOfQuestions, type } = req.body;

    let prompt = '';
    
    if (type === 'MCQ') {
        prompt = `Generate exactly ${numberOfQuestions} Multiple Choice Questions on ${subject} focusing on: ${keywords}.
        
RESPONSE FORMAT - Return ONLY a valid JSON array:
[
    {
        "question": "clear question text",
        "options": ["wrong option 1", "correct answer here", "wrong option 2", "wrong option 3"],
        "answer": "correct answer here"
    }
]

RULES:
- The "answer" field MUST be EXACTLY ONE of the options
- Each question must have exactly 4 options
- Mix the position of the correct answer (don't always put it in same position)
- RETURN ONLY JSON, NO OTHER TEXT`;
    } 
    else if (type === 'short answer') {
        prompt = `Generate exactly ${numberOfQuestions} Short Answer Questions on ${subject} focusing on: ${keywords}.

RESPONSE FORMAT - Return ONLY a valid JSON array:
[
    {
        "question": "specific question that expects a short text answer",
        "answer": "the expected answer (1-5 words)"
    }
]

RULES:
- The "answer" field must be the expected answer (concise, 1-5 words typically)
- Examples: "Paris", "Photosynthesis", "H2O", "English Channel"
- Each question must have ONE clear expected answer
- RETURN ONLY JSON, NO OTHER TEXT`;
    }
    else if (type === 'true/false') {
        prompt = `Generate exactly ${numberOfQuestions} True/False Questions on ${subject} focusing on: ${keywords}.

RESPONSE FORMAT - Return ONLY a valid JSON array:
[
    {
        "question": "statement that is either true or false",
        "options": ["True", "False"],
        "answer": "True"
    }
]

RULES:
- The "answer" field must be EXACTLY "True" or "False"
- Options must be EXACTLY ["True", "False"]
- Make questions clear and unambiguous
- RETURN ONLY JSON, NO OTHER TEXT`;
    }
    else if (type === 'multiple response') {
        prompt = `Generate exactly ${numberOfQuestions} Multiple Response Questions on ${subject} focusing on: ${keywords}.

RESPONSE FORMAT - Return ONLY a valid JSON array:
[
    {
        "question": "question asking to select multiple correct options",
        "options": ["correct option 1", "wrong option", "correct option 2", "wrong option"],
        "answers": ["correct option 1", "correct option 2"]
    }
]

RULES:
- The "answers" field must be an ARRAY of 2-3 correct options FROM the options list
- Each question must have exactly 4 options total
- At least 2 options must be marked as correct in the "answers" array
- The "answers" array must contain strings that EXACTLY match the options
- RETURN ONLY JSON, NO OTHER TEXT`;
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o", // Using GPT-4o via GitHub Models (Free for students)
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        });

        let quizData = JSON.parse(response.choices[0].message.content.trim());
        
        // Validate and fix empty answers
        quizData = quizData.map(q => {
            // Ensure answers are not empty
            if (type === 'short answer' && (!q.answer || q.answer.trim() === '')) {
                q.answer = 'Answer not provided by AI';
            }
            if (type === 'multiple response' && (!q.answers || q.answers.length === 0)) {
                q.answers = q.options ? [q.options[0], q.options[1]] : ['Option 1', 'Option 2'];
            }
            if ((type === 'MCQ' || type === 'true/false') && (!q.answer || q.answer.trim() === '')) {
                q.answer = q.options ? q.options[0] : 'Answer not provided';
            }
            return q;
        });
        
        res.json(quizData);
    } catch (error) {
        console.error('Error generating quiz:', error);
        res.status(500).json({ error: 'Failed to generate quiz' });
    }
});

// 3. Publish Quiz
router.post('/publish/:draftId', async (req, res) => {
    try {
        const draft = await DraftQuiz.findById(req.params.draftId);
        if (!draft) return res.status(404).json({ error: 'Draft not found' });

        const published = new PublishedQuiz({
            title: draft.title,
            subject: draft.subject,
            type: draft.type,
            questions: draft.questions,
            publishedAt: new Date()
        });

        await published.save();
        res.status(201).json(published);
    } catch (error) {
        res.status(500).json({ error: 'Failed to publish quiz' });
    }
});

// 4. Fetch Published Quizzes
router.get('/all', async (req, res) => {
    try {
        const quizzes = await PublishedQuiz.find().sort({ publishedAt: -1 });
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch quizzes' });
    }
});

// 5. Group Quizzes by Subject
router.get('/subjects', async (req, res) => {
    try {
        const quizzes = await PublishedQuiz.find();
        const grouped = quizzes.reduce((acc, quiz) => {
            if (!acc[quiz.subject]) acc[quiz.subject] = [];
            acc[quiz.subject].push(quiz);
            return acc;
        }, {});
        res.json(grouped);
    } catch (error) {
        res.status(500).json({ error: 'Failed to group quizzes' });
    }
});

// 6. Delete Published Quiz
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await PublishedQuiz.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Quiz not found' });
        res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete quiz' });
    }
});

module.exports = router;
