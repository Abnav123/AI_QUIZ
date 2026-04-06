# 🎓 AI Quiz Creator

> **AI-powered quiz generation and management platform built with MERN stack**

**🌐 Live Site:** https://ai-quiz-frontend-26we.onrender.com/

---

## 📖 Overview

AI Quiz Creator is a full-stack web application that uses AI to automatically generate educational quizzes. Create quizzes in seconds, save drafts, and publish them for students to take.

### ✨ Key Features
- 🤖 **AI-Powered Generation**: Automatically create quizzes using GPT-4o
- 📝 **4 Quiz Types**: MCQ • True/False • Short Answer • Multiple Response
- 💾 **Draft System**: Save quizzes as drafts before publishing
- 📊 **Subject Organization**: Group and filter quizzes by subject
- 🎨 **Modern UI**: Beautiful gradient design with responsive layout

---

## 🛠️ Technology Stack

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Lucide React Icons
- Axios

### Backend
- Node.js + Express
- MongoDB Atlas
- Mongoose ODM
- GitHub Models API (GPT-4o)

---

## 📂 Project Structure

```
AI_QUIZ/
├── backend/
│   ├── models/
│   │   ├── DraftQuiz.js
│   │   └── PublishedQuiz.js
│   ├── routes/
│   │   ├── quiz.js
│   │   └── draft.js
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── CreateQuiz.js
    │   │   ├── Drafts.js
    │   │   ├── EditDraft.js
    │   │   └── PublishedQuizzes.js
    │   ├── App.js
    │   └── index.js
    └── package.json
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account
- GitHub Models API key

### Backend Setup
```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/DB_NAME
OPENAI_API_KEY=ghp_your_api_key
PORT=5000
EOF

npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

---

## 📚 Quiz Types

1. **Multiple Choice (MCQ)** - Single correct answer from 4 options
2. **True/False** - Binary choice questions
3. **Short Answer** - Text input responses
4. **Multiple Response** - Multiple correct answers (checkboxes)

---

## 🔌 API Endpoints

### Quiz Routes
- `POST /api/quiz/generate` - Generate quiz with AI
- `POST /api/quiz/publish/:draftId` - Publish a draft
- `GET /api/quiz/subjects` - Get quizzes grouped by subject
- `DELETE /api/quiz/:quizId` - Delete published quiz

### Draft Routes
- `POST /api/draft/save` - Create new draft
- `GET /api/draft/all` - Get all drafts
- `GET /api/draft/:id` - Get specific draft
- `PUT /api/draft/:id` - Update draft
- `DELETE /api/draft/:id` - Delete draft

---

## 🔄 Workflow

1. Create - Select quiz type and enter details
2. Generate - AI creates questions automatically
3. Edit - Review and modify questions
4. Save - Save as draft
5. Publish - Make quiz available to students
6. View - See all published quizzes organized by subject

---

## 🌐 Live Deployment

- **Frontend:** https://ai-quiz-frontend-26we.onrender.com/
- **Backend:** https://ai-quiz-backend-ovmo.onrender.com/

---

## Version
v1.0.0 - April 2026 | Status: ✅ Production Ready
