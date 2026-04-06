import React, { useState, useEffect } from 'react';
import api from '../api';
import { ChevronDown, ChevronRight, BookOpen, Loader2, Trash2 } from 'lucide-react';

const PublishedQuizzes = () => {
    const [groupedQuizzes, setGroupedQuizzes] = useState({});
    const [expanded, setExpanded] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const res = await api.get('/quiz/subjects');
            setGroupedQuizzes(res.data);
        } catch (err) {
            console.error('Error fetching quizzes');
        }
        setLoading(false);
    };

    const toggleSection = (subject) => {
        setExpanded(prev => ({ ...prev, [subject]: !prev[subject] }));
    };

    const handleDelete = async (quizId) => {
        if (window.confirm('Delete this published quiz? This action cannot be undone.')) {
            try {
                await api.delete(`/quiz/${quizId}`);
                alert('✓ Quiz deleted');
                fetchQuizzes();
            } catch (err) {
                alert('Error deleting quiz');
            }
        }
    };

    if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

    const subjects = Object.keys(groupedQuizzes);
    const totalQuizzes = Object.values(groupedQuizzes).reduce((sum, quizzes) => sum + quizzes.length, 0);

    const typeColors = {
        'MCQ': 'text-blue-600 bg-blue-100',
        'short answer': 'text-purple-600 bg-purple-100',
        'true/false': 'text-amber-600 bg-amber-100',
        'multiple response': 'text-green-600 bg-green-100'
    };

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-4xl font-black text-gray-800 mb-2">🏆 Published Quizzes</h1>
                <p className="text-gray-600 text-lg">{totalQuizzes} published quiz{totalQuizzes !== 1 ? 'zes' : ''} across {subjects.length} subject{subjects.length !== 1 ? 's' : ''}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
                    <p className="text-5xl font-black mb-2">{totalQuizzes}</p>
                    <p className="font-semibold">Total Quizzes</p>
                </div>
                <div className="bg-gradient-to-br from-purple-400 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
                    <p className="text-5xl font-black mb-2">{subjects.length}</p>
                    <p className="font-semibold">Subjects</p>
                </div>
                <div className="bg-gradient-to-br from-green-400 to-green-600 text-white rounded-2xl p-6 shadow-lg">
                    <p className="text-5xl font-black mb-2">📚</p>
                    <p className="font-semibold">Ready to Use</p>
                </div>
            </div>

            {/* Quizzes by Subject */}
            <div className="space-y-4">
                {Object.keys(groupedQuizzes).map(subject => (
                    <div key={subject} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                        <button 
                            onClick={() => toggleSection(subject)}
                            className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <BookOpen className="text-blue-600" size={28}/>
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-xl text-gray-800">{subject}</h3>
                                    <p className="text-sm text-gray-600">{groupedQuizzes[subject].length} quiz{groupedQuizzes[subject].length !== 1 ? 'zes' : ''}</p>
                                </div>
                            </div>
                            {expanded[subject] ? <ChevronDown size={28} className="text-gray-600"/> : <ChevronRight size={28} className="text-gray-600"/>}
                        </button>

                        {expanded[subject] && (
                            <div className="p-6 border-t border-gray-200 space-y-4">
                                {groupedQuizzes[subject].map(quiz => (
                                    <div key={quiz._id} className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-colors">
                                        <div className="flex items-start justify-between mb-3">
                                            <h4 className="font-bold text-lg text-gray-800 flex-1">{quiz.title}</h4>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${typeColors[quiz.type] || 'text-gray-600 bg-gray-100'}`}>
                                                    {quiz.type}
                                                </span>
                                                <button
                                                    onClick={() => handleDelete(quiz._id)}
                                                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition duration-300"
                                                    title="Delete quiz"
                                                >
                                                    <Trash2 size={18}/>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                            <span className="font-semibold">📊 {quiz.questions.length} Questions</span>
                                            <span>📅 {new Date(quiz.publishedAt).toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'short', 
                                                day: 'numeric' 
                                            })}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PublishedQuizzes;
