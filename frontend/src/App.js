import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { BookOpen, PenTool, FileText, Zap } from 'lucide-react';
import CreateQuiz from './pages/CreateQuiz';
import Drafts from './pages/Drafts';
import PublishedQuizzes from './pages/PublishedQuizzes';
import EditDraft from './pages/EditDraft';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
          <nav className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-6 py-5">
                  <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                              <Zap size={28} className="text-yellow-300"/>
                          </div>
                          <div>
                              <h1 className="text-3xl font-black tracking-tight">AI Quiz Creator</h1>
                              <p className="text-blue-100 text-sm">Powered by GPT-4o</p>
                          </div>
                      </div>
                      <div className="flex gap-8">
                          <Link to="/" className="flex items-center gap-2 hover:text-blue-100 transition-all duration-300 group">
                              <PenTool size={20} className="group-hover:scale-110 transition-transform"/>
                              <span className="font-semibold">Create</span>
                          </Link>
                          <Link to="/drafts" className="flex items-center gap-2 hover:text-blue-100 transition-all duration-300 group">
                              <FileText size={20} className="group-hover:scale-110 transition-transform"/>
                              <span className="font-semibold">Drafts</span>
                          </Link>
                          <Link to="/published" className="flex items-center gap-2 hover:text-blue-100 transition-all duration-300 group">
                              <BookOpen size={20} className="group-hover:scale-110 transition-transform"/>
                              <span className="font-semibold">Published</span>
                          </Link>
                      </div>
                  </div>
              </div>
          </nav>
          
          <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
              <Routes>
                  <Route path="/" element={<CreateQuiz />} />
                  <Route path="/drafts" element={<Drafts />} />
                  <Route path="/published" element={<PublishedQuizzes />} />
                  <Route path="/draft/:id" element={<EditDraft />} />
              </Routes>
          </main>
          
          <footer className="py-6 text-center text-gray-600 bg-white bg-opacity-60 border-t border-gray-200">
              <p className="font-medium">&copy; 2026 AI Quiz Creator - Elevating Education with AI</p>
          </footer>
      </div>
    </Router>
  );
}

export default App;

