const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
const quizRoutes = require('./routes/quiz');
const draftRoutes = require('./routes/draft');

app.use('/api/quiz', quizRoutes);
app.use('/api/draft', draftRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
