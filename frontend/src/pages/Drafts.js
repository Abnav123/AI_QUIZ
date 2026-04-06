import React, { useState, useEffect } from 'react';
import api from '../api';
import { Pencil, Rocket, Loader2, FileText, BookOpen, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Drafts = () => {
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDrafts();
    }, []);

    const fetchDrafts = async () => {
        try {
            const res = await api.get('/draft/all');
            setDrafts(res.data);
        } catch (err) {
            console.error('Error fetching drafts');
        }
        setLoading(false);
    };

    const handlePublish = async (id) => {
        if (window.confirm('Ready to publish this quiz?')) {
            try {
                await api.post(`/quiz/publish/${id}`);
                alert('🎉 Quiz Published!');
                fetchDrafts();
            } catch (err) {
                alert('Error publishing quiz');
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this draft?')) {
            try {
                await api.delete(`/draft/${id}`);
                alert('✓ Draft deleted');
                fetchDrafts();
            } catch (err) {
                alert('Error deleting draft');
            }
        }
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
            <div className="mb-8">
                <h1 className="text-4xl font-black text-gray-800 mb-2">📋 Your Drafts</h1>
                <p className="text-gray-600 text-lg">{drafts.length} draft{drafts.length !== 1 ? 's' : ''} ready to edit or publish</p>
            </div>

            {drafts.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
                    <FileText size={64} className="mx-auto text-gray-400 mb-4"/>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No drafts yet</h2>
                    <p className="text-gray-600 mb-6">Create your first quiz to get started</p>
                    <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                        Create Quiz
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {drafts.map(draft => (
                        <div key={draft._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                            {/* Header */}
                            <div className={`bg-gradient-to-br ${typeColors[draft.type] || 'from-gray-400 to-gray-600'} p-4 text-white`}>
                                <div className="flex items-start justify-between mb-3">
                                    <span className="text-xs font-bold bg-white bg-opacity-30 px-3 py-1 rounded-full uppercase tracking-wide">
                                        {draft.type}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold line-clamp-2">{draft.title}</h3>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <p className="text-sm text-gray-700 mb-4">
                                    <span className="font-semibold text-gray-800">Subject:</span> {draft.subject}
                                </p>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                                    <div className="text-center">
                                        <p className="text-3xl font-bold text-blue-600">{draft.questions.length}</p>
                                        <p className="text-xs text-gray-600 font-semibold">Questions</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-3xl font-bold text-green-600">📝</p>
                                        <p className="text-xs text-gray-600 font-semibold">Editable</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => navigate(`/draft/${draft._id}`)} 
                                        className="flex-1 flex items-center justify-center gap-2 bg-blue-100 text-blue-700 py-2 rounded-lg font-semibold hover:bg-blue-200 transition duration-300"
                                    >
                                        <Pencil size={18}/>
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handlePublish(draft._id)} 
                                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition duration-300"
                                    >
                                        <Rocket size={18}/>
                                        Publish
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(draft._id)} 
                                        className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-700 py-2 rounded-lg font-semibold hover:bg-red-200 transition duration-300"
                                    >
                                        <Trash2 size={18}/>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Drafts;
