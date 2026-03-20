import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { Send, FileText, Lightbulb, Loader2 } from 'lucide-react';

const DocumentViewer = () => {
    const { id } = useParams();
    const [fileUrl, setFileUrl] = useState('');
    const [error, setError] = useState(null);
    const { token } = useAuthStore();
    const navigate = useNavigate();

    // AI Chat State
    const [messages, setMessages] = useState([{ role: 'ai', content: 'Hello! I am your AI assistant. Ask me anything about this document, or use the buttons below to generate a summary or explain concepts.' }]);
    const [inputQuery, setInputQuery] = useState('');
    const [isLoadingAI, setIsLoadingAI] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        const fetchDocumentUrl = async () => {
            try {
                const { data } = await axios.get(`https://ai-based-learning-app-1.onrender.com/api/documents/${id}/url`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFileUrl(data.url);
            } catch (err) {
                setError('Could not load document.');
            }
        };
        fetchDocumentUrl();
    }, [id, token]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!inputQuery.trim()) return;

        const userMessage = inputQuery.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInputQuery('');
        setIsLoadingAI(true);

        try {
            const { data } = await axios.post('https://ai-based-learning-app-1.onrender.com/api/ai/chat', {
                documentId: id,
                prompt: userMessage
            }, { headers: { Authorization: `Bearer ${token}` } });

            setMessages(prev => [...prev, { role: 'ai', content: data.answer }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error processing your request.' }]);
        } finally {
            setIsLoadingAI(false);
        }
    };

    const handleSummarize = async () => {
        setMessages(prev => [...prev, { role: 'user', content: 'Please summarize this document.' }]);
        setIsLoadingAI(true);
        try {
            const { data } = await axios.post('https://ai-based-learning-app-1.onrender.com/api/ai/summarize', {
                documentId: id
            }, { headers: { Authorization: `Bearer ${token}` } });

            setMessages(prev => [...prev, { role: 'ai', content: data.summary }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error generating the summary.' }]);
        } finally {
            setIsLoadingAI(false);
        }
    };

    const handleExplain = async () => {
        const concept = prompt("What concept would you like me to explain?");
        if (!concept) return;

        setMessages(prev => [...prev, { role: 'user', content: `Explain the concept: "${concept}"` }]);
        setIsLoadingAI(true);
        try {
            const { data } = await axios.post('https://ai-based-learning-app-1.onrender.com/api/ai/explain', {
                documentId: id,
                concept
            }, { headers: { Authorization: `Bearer ${token}` } });

            setMessages(prev => [...prev, { role: 'ai', content: data.explanation }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error explaining the concept.' }]);
        } finally {
            setIsLoadingAI(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] gap-4 -mt-4">
            {/* PDF Viewer Area */}
            <div className="w-1/2 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-medium text-gray-800 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" /> Document Viewer
                    </h3>
                    <button onClick={() => navigate('/documents')} className="text-sm text-blue-600 hover:text-blue-800">
                        Back to Library
                    </button>
                </div>
                <div className="flex-1 bg-gray-100 relative">
                    {error ? (
                        <div className="absolute inset-0 flex items-center justify-center text-red-500">{error}</div>
                    ) : fileUrl ? (
                        <iframe
                            src={`${fileUrl}#toolbar=0`}
                            className="w-full h-full border-0"
                            title="PDF Viewer"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">Loading document...</div>
                    )}
                </div>
            </div>

            {/* AI Tools Area */}
            <div className="w-1/2 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-medium text-gray-800 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        AI Assistant
                    </h3>
                    <div className="flex gap-2">
                        <button onClick={handleSummarize} disabled={isLoadingAI} className="text-xs bg-white border border-gray-200 px-2 py-1 flex items-center gap-1 rounded hover:bg-gray-50 disabled:opacity-50">
                            <FileText className="w-3 h-3" /> Summarize
                        </button>
                        <button onClick={handleExplain} disabled={isLoadingAI} className="text-xs bg-white border border-gray-200 px-2 py-1 flex items-center gap-1 rounded hover:bg-gray-50 disabled:opacity-50">
                            <Lightbulb className="w-3 h-3" /> Explain Concept
                        </button>
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-4">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm whitespace-pre-wrap'
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isLoadingAI && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-2">
                                <Loader2 className="w-4 h-4 text-blue-500 animate-spin" /> Thinking...
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <div className="p-4 bg-white border-t border-gray-200">
                    <form onSubmit={handleChatSubmit} className="flex gap-2 relative">
                        <input
                            type="text"
                            value={inputQuery}
                            onChange={(e) => setInputQuery(e.target.value)}
                            placeholder="Ask a question about this document..."
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-full pl-5 pr-12 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            disabled={isLoadingAI}
                        />
                        <button
                            type="submit"
                            disabled={!inputQuery.trim() || isLoadingAI}
                            className="absolute right-2 top-1.5 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DocumentViewer;
