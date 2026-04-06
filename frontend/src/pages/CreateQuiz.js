import React, { useState } from 'react';
import api from '../api';
import { Loader2, Lightbulb, CheckSquare, HelpCircle, Zap, Save, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateQuiz = () => {
    const navigate = useNavigate();
    const [config, setConfig] = useState({ title: '', subject: '', keywords: '', numberOfQuestions: 5, type: 'MCQ' });
    const [loading, setLoading] = useState(false);
    const [quizData, setQuizData] = useState(null);

    const quizTypes = [
        { value: 'MCQ', label: 'Multiple Choice', icon: CheckSquare, color: 'from-blue-400 to-blue-600', desc: 'Single correct answer' },
        { value: 'short answer', label: 'Short Answer', icon: Lightbulb, color: 'from-purple-400 to-purple-600', desc: 'Text-based answers' },
        { value: 'true/false', label: 'True/False', icon: HelpCircle, color: 'from-amber-400 to-amber-600', desc: 'Binary questions' },
        { value: 'multiple response', label: 'Multiple Response', icon: Zap, color: 'from-green-400 to-green-600', desc: 'Multiple correct answers' },
    ];

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!config.title || !config.subject || !config.keywords) {
            alert('Please fill all fields');
            return;
        }
        setLoading(true);
        try {
            const res = await api.post('/quiz/generate', config);
            const questionsData = Array.isArray(res.data) ? res.data : res.data.questions || [];
            
            const normalizedQuestions = questionsData.map(q => {
                // Handle different field names from AI
                let correctAnswer = '';
                let correctAnswers = [];
                
                if (config.type === 'short answer') {
                    correctAnswer = (q.answer || q.correctAnswer || '').trim();
                } 
                else if (config.type === 'multiple response') {
                    correctAnswers = Array.isArray(q.answers) ? q.answers : (Array.isArray(q.correctAnswers) ? q.correctAnswers : []);
                } 
                else {
                    correctAnswer = (q.answer || q.correctAnswer || '').trim();
                }
                
                return {
                    question: q.question || '',
                    options: q.options || [],
                    correctAnswer: correctAnswer,
                    correctAnswers: correctAnswers
                };
            });
            
            setQuizData({ ...config, questions: normalizedQuestions });
        } catch (err) {
            alert('Error generating quiz: ' + (err.response?.data?.error || err.message));
        }
        setLoading(false);
    };

    const handleSaveDraft = async () => {
        try {
            await api.post('/draft/save', quizData);
            alert('✅ Draft saved successfully!');
            navigate('/drafts');
        } catch (err) {
            alert('Error saving draft');
        }
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...quizData.questions];
        newQuestions[index][field] = value;
        setQuizData({ ...quizData, questions: newQuestions });
    };

    const updateOption = (qIndex, oIndex, value) => {
        const newQuestions = [...quizData.questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuizData({ ...quizData, questions: newQuestions });
    };

    return (
        <div className="w-full">
            {!quizData ? (
                <div className="mb-8">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            Create Your AI-Powered Quiz
                        </h1>
                        <p className="text-gray-600 text-lg">Configure your quiz and let AI generate questions instantly</p>
                    </div>

                    <form onSubmit={handleGenerate} className="space-y-8">
                        {/* Basic Info Card */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                            <h2 className="text-xl font-bold mb-6 text-gray-800">📝 Quiz Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Quiz Title</label>
                                    <input 
                                        placeholder="e.g., Biology Basics" 
                                        value={config.title} 
                                        onChange={e=>setConfig({...config, title: e.target.value})} 
                                        required 
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                                    <input 
                                        placeholder="e.g., Biology" 
                                        value={config.subject} 
                                        onChange={e=>setConfig({...config, subject: e.target.value})} 
                                        required 
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Keywords (comma-separated)</label>
                                    <input 
                                        placeholder="e.g., cells, photosynthesis, DNA" 
                                        value={config.keywords} 
                                        onChange={e=>setConfig({...config, keywords: e.target.value})} 
                                        required 
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Questions</label>
                                    <div className="flex items-center gap-3">
                                        <input 
                                            type="number" 
                                            min="1"
                                            max="20"
                                            value={config.numberOfQuestions} 
                                            onChange={e=>setConfig({...config, numberOfQuestions: parseInt(e.target.value)})} 
                                            required 
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                                        />
                                        <span className="text-2xl font-bold text-blue-600">{config.numberOfQuestions}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quiz Type Selection */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                            <h2 className="text-xl font-bold mb-6 text-gray-800">🎯 Select Quiz Type</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {quizTypes.map(type => {
                                    const IconComponent = type.icon;
                                    return (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() => setConfig({...config, type: type.value})}
                                            className={`p-4 rounded-xl transition-all duration-300 ${
                                                config.type === type.value
                                                    ? `bg-gradient-to-br ${type.color} text-white shadow-lg scale-105`
                                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                            }`}
                                        >
                                            <IconComponent size={32} className="mb-2 mx-auto"/>
                                            <p className="font-bold text-center">{type.label}</p>
                                            <p className="text-xs text-center mt-1 opacity-80">{type.desc}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Generate Button */}
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 flex justify-center items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={24}/>
                                    Generating with AI...
                                </>
                            ) : (
                                <>
                                    <Zap size={24}/>
                                    Generate Quiz with AI
                                </>
                            )}
                        </button>
                    </form>
                </div>
            ) : (
                <div>
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-4xl font-black text-gray-800 mb-2">{quizData.title}</h1>
                                <p className="text-gray-600"><span className="font-semibold">Subject:</span> {quizData.subject} • <span className="font-semibold">Type:</span> {quizData.type}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-4xl font-black text-blue-600">{quizData.questions.length}</p>
                                <p className="text-gray-600 font-semibold">Questions</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all" style={{width: '100%'}}></div>
                        </div>
                    </div>

                    <div className="space-y-6 mb-8">
                        {quizData.questions.map((q, qIndex) => (
                            <div key={qIndex} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-shadow">
                                <div className="flex gap-4 mb-4">
                                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                        {qIndex + 1}
                                    </div>
                                    <textarea 
                                        className="flex-1 text-lg font-semibold p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition resize-none"
                                        rows="2"
                                        value={q.question}
                                        onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                                    />
                                </div>

                                {quizData.type === 'MCQ' ? (
                                    <div className="ml-14 space-y-3">
                                        {(q.options || []).map((opt, oIndex) => (
                                            <div key={oIndex} className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-gray-500 w-8">({String.fromCharCode(65 + oIndex)})</span>
                                                <input 
                                                    className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                                                    value={opt}
                                                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                />
                                            </div>
                                        ))}
                                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                                            <label className="text-sm font-semibold text-gray-700 block mb-2">✓ Correct Answer</label>
                                            <select 
                                                className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:outline-none bg-white"
                                                value={q.correctAnswer || ''}
                                                onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                                            >
                                                <option value="">Select answer</option>
                                                {(q.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                ) : quizData.type === 'true/false' ? (
                                    <div className="ml-14 space-y-3">
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <button type="button" className="px-4 py-3 bg-green-50 border-2 border-green-300 rounded-lg font-semibold text-green-700">✓ True</button>
                                            <button type="button" className="px-4 py-3 bg-red-50 border-2 border-red-300 rounded-lg font-semibold text-red-700">✗ False</button>
                                        </div>
                                        <div className="p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                                            <label className="text-sm font-semibold text-gray-700 block mb-2">✓ Correct Answer</label>
                                            <select 
                                                className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:outline-none bg-white"
                                                value={q.correctAnswer || ''}
                                                onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                                            >
                                                <option value="">Select answer</option>
                                                <option value="True">✓ True</option>
                                                <option value="False">✗ False</option>
                                            </select>
                                        </div>
                                    </div>
                                ) : quizData.type === 'multiple response' ? (
                                    <div className="ml-14 space-y-4">
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            {(q.options || []).map((opt, oIndex) => (
                                                <input 
                                                    key={oIndex}
                                                    className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                                                    value={opt}
                                                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                />
                                            ))}
                                        </div>
                                        <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                                            <label className="text-sm font-semibold text-gray-700 block mb-3">✓ Select all correct answers:</label>
                                            <div className="space-y-2">
                                                {(q.options || []).map((opt, oIndex) => {
                                                    const correctAnswers = q.correctAnswers || [];
                                                    return (
                                                        <label key={oIndex} className="flex items-center gap-3 p-2 hover:bg-white rounded transition cursor-pointer">
                                                            <input 
                                                                type="checkbox"
                                                                checked={correctAnswers.includes(opt)}
                                                                onChange={(e) => {
                                                                    let newAnswers = [...correctAnswers];
                                                                    if (e.target.checked) {
                                                                        if (!newAnswers.includes(opt)) newAnswers.push(opt);
                                                                    } else {
                                                                        newAnswers = newAnswers.filter(a => a !== opt);
                                                                    }
                                                                    updateQuestion(qIndex, 'correctAnswers', newAnswers);
                                                                }}
                                                                className="w-5 h-5 accent-green-600"
                                                            />
                                                            <span className="font-medium">{opt}</span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="ml-14">
                                        <textarea 
                                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition" 
                                            rows="3"
                                            placeholder="Enter expected answer..."
                                            value={q.answer || q.correctAnswer}
                                            onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <button 
                        onClick={handleSaveDraft} 
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex justify-center items-center gap-2"
                    >
                        <Save size={24}/>
                        Save as Draft
                        <ChevronRight size={20}/>
                    </button>
                </div>
            )}
        </div>
    );
};

export default CreateQuiz;
