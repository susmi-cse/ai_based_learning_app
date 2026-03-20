import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import Flashcard from '../components/Flashcard';
import { Loader2, Sparkles } from 'lucide-react';

const FlashcardsPage = () => {
    const [documents, setDocuments] = useState([]);
    const [selectedDocId, setSelectedDocId] = useState('');
    const [numCards, setNumCards] = useState(10);
    const [flashcards, setFlashcards] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useAuthStore();

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const { data } = await axios.get('https://ai-based-learning-app.onrender.com/api/documents', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDocuments(data);
                if (data.length > 0) setSelectedDocId(data[0]._id);
            } catch (err) {
                setError('Failed to fetch documents.');
            }
        };
        fetchDocuments();
    }, [token]);

    const handleGenerate = async () => {
        if (!selectedDocId) return;
        setIsGenerating(true);
        setError(null);
        try {
            const { data } = await axios.post('https://ai-based-learning-app.onrender.com/api/ai/flashcards', {
                documentId: selectedDocId,
                count: parseInt(numCards)
            }, { headers: { Authorization: `Bearer ${token}` } });

            setFlashcards(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate flashcards.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleToggleFavorite = (id) => {
        // In a full app, this would hit the backend to save the favorite state.
        // For now, we'll optimistically update the UI.
        setFlashcards(prev => prev.map(card =>
            card._id === id ? { ...card, isFavorite: !card.isFavorite } : card
        ));
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Flashcards</h1>
                    <p className="text-gray-600">Generate intelligent flashcards from your documents.</p>
                </div>
            </div>

            {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Document</label>
                        <select
                            value={selectedDocId}
                            onChange={(e) => setSelectedDocId(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            disabled={isGenerating || documents.length === 0}
                        >
                            {documents.length === 0 && <option value="">No documents available</option>}
                            {documents.map(doc => (
                                <option key={doc._id} value={doc._id}>{doc.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-32">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Count</label>
                        <input
                            type="number"
                            min="5"
                            max="20"
                            value={numCards}
                            onChange={(e) => setNumCards(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            disabled={isGenerating || documents.length === 0}
                        />
                    </div>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || documents.length === 0}
                    className="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                >
                    {isGenerating ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</>
                    ) : (
                        <><Sparkles className="w-5 h-5" /> Generate</>
                    )}
                </button>
            </div>

            {flashcards.length > 0 && (
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Generated Cards ({flashcards.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {flashcards.map((card) => (
                            <Flashcard key={card._id} flashcard={card} onToggleFavorite={handleToggleFavorite} />
                        ))}
                    </div>
                </div>
            )}

            {flashcards.length === 0 && !isGenerating && (
                <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No flashcards yet</h3>
                    <p className="text-gray-500">Select a document and generate some flashcards to start studying.</p>
                </div>
            )}
        </div>
    );
};

export default FlashcardsPage;
