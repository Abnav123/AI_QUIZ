import React, { useState, useEffect } from 'react';
import api from '../api';
import { Save, Loader2, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const EditDraft = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [draft, setDraft] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchDraft = async () => {
            try {
                const res = await api.get(`/draft/${id}`);
                setDraft(res.data);
            } catch (err) {
                alert('Error fetching draft');
                navigate('/drafts');
            }
            setLoading(false);
        };
        fetchDraft();
    }, [id, navigate]);

    const handleUpdate = async () => {
        setSaving(true);
        try {
            await api.put(`/draft/${id}`, draft);
            alert('✅ Draft updated successfully!');
            navigate('/drafts');
        } catch (err) {
            alert('Error updating draft');
        }
        setSaving(false);
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...draft.questions];
        newQuestions[index][field] = value;
        setDraft({ ...draft, questions: newQuestions });
    };

    const updateOption = (qIndex, oIndex, value) => {
        const newQuestions = [...draft.questions];
        newQuestions[qIndex].options[oIndex] = value;
        setDraft({ ...draft, questions: newQuestions });
    };

    if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

    const typeColors = {
        'MCQ': 'from-blue-400 to-blue-600',
        'short answer': 'from-purple-400 to-purple-600',
        'true/false': 'from-amber-400 to-amber-600',
        'multiple response': 'from-green-400 to-green-600'
    };

    return (
        <div className="w-full">
            <button 
                onClick={() => navigate('/drafts')} 
                className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-800 font-semibold transition-colors"
            >
                <ArrowLeft size={20}/> Back to Drafts
            </button>

            <div className={`bg-gradient-to-r ${typeColors[draft.type] || 'from-gray-400 to-gray-600'} text-white rounded-2xl p-6 mb-8`}>
                <h1 className="text-4xl font-black mb-2">✏️ Edit Quiz Draft</h1>
                <p className="text-white text-opacity-90">{draft.title} • {draft.type}</p>
            </div>

            <div className="space-y-6 mb-8">
                {/* Basic Info */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h2 className="text-xl font-bold mb-4">Quiz Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                            <input 
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition" 
                                value={draft.title} 
                                onChange={e=>setDraft({...draft, title: e.target.value})} 
                                placeholder="Quiz Title"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                            <input 
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition" 
                                value={draft.subject} 
                                onChange={e=>setDraft({...draft, subject: e.target.value})} 
                                placeholder="Subject"
                            />
                        </div>
                    </div>
                </div>

                {/* Questions */}
                {draft.questions && draft.questions.map((q, qIndex) => (
                    <div key={qIndex} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="flex gap-4 mb-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                {qIndex + 1}
                            </div>
                            <textarea 
                                className="flex-1 text-lg font-semibold p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition resize-none" 
                                rows="2"
                                value={q.question} 
                                onChange={e=>updateQuestion(qIndex, 'question', e.target.value)}
                            />
                        </div>

                        {draft.type === 'MCQ' ? (
                            <div className="ml-14 space-y-3">
                                {(q.options || []).map((opt, oIndex) => (
                                    <div key={oIndex} className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-gray-500 w-8">({String.fromCharCode(65 + oIndex)})</span>
                                        <input 
                                            className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition" 
                                            value={opt} 
                                            onChange={e=>updateOption(qIndex, oIndex, e.target.value)}
                                        />
                                    </div>
                                ))}
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                                    <label className="text-sm font-semibold text-gray-700 block mb-2">✓ Correct Answer</label>
                                    <select 
                                        className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:outline-none bg-white" 
                                        value={q.correctAnswer || ''} 
                                        onChange={e=>updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                                    >
                                        <option value="">Select answer</option>
                                        {(q.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                            </div>
                        ) : draft.type === 'true/false' ? (
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
                                        onChange={e=>updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                                    >
                                        <option value="">Select answer</option>
                                        <option value="True">✓ True</option>
                                        <option value="False">✗ False</option>
                                    </select>
                                </div>
                            </div>
                        ) : draft.type === 'multiple response' ? (
                            <div className="ml-14 space-y-4">
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    {(q.options || []).map((opt, oIndex) => (
                                        <input 
                                            key={oIndex} 
                                            className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition" 
                                            value={opt} 
                                            onChange={e=>updateOption(qIndex, oIndex, e.target.value)}
                                        />
                                    ))}
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                                    <label className="text-sm font-semibold text-gray-700 block mb-3">✓ Select all correct answers:</label>
                                    <div className="space-y-2">
                                        {(q.options || []).map((opt, oIndex) => {
                                            const correctAnswers = q.correctAnswers || q.answers || [];
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
                                    placeholder="Expected answer..."
                                    value={q.correctAnswer} 
                                    onChange={e=>updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button 
                onClick={handleUpdate} 
                disabled={saving}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {saving ? (
                    <>
                        <Loader2 className="animate-spin" size={24}/>
                        Saving...
                    </>
                ) : (
                    <>
                        <Save size={24}/>
                        Save Changes
                    </>
                )}
            </button>
        </div>
    );
};

export default EditDraft;
