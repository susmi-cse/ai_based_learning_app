import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const DocumentLibrary = () => {
    const [documents, setDocuments] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchDocuments();
    }, [token]);

    const fetchDocuments = async () => {
        try {
            const { data } = await axios.get('https://ai-based-learning-app.onrender.com/api/documents', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDocuments(data);
        } catch (err) {
            setError('Failed to fetch documents.');
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            setError('Only PDF files are allowed.');
            return;
        }

        const formData = new FormData();
        formData.append('document', file);
        formData.append('title', file.name.replace('.pdf', ''));

        setIsUploading(true);
        setError(null);

        try {
            await axios.post('https://ai-based-learning-app.onrender.com/api/documents/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            await fetchDocuments();
            setIsUploading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed');
            setIsUploading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Documents</h2>
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">{error}</div>}

            <div className="mb-8 p-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center transition-colors hover:bg-gray-100">
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                    <svg className="w-12 h-12 text-blue-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm font-medium text-gray-600 mb-1">Click to upload or drag and drop</span>
                    <span className="text-xs text-gray-400">PDF up to 10MB</span>
                    <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                    />
                </label>
                {isUploading && <p className="mt-4 text-sm text-blue-600 animate-pulse">Uploading and analyzing document...</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map(doc => (
                    <div key={doc._id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4x..." clipRule="evenodd" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 truncate mb-1">{doc.title}</h3>
                        <p className="text-sm text-gray-500 mb-4">{(doc.size / 1024 / 1024).toFixed(2)} MB • {new Date(doc.createdAt).toLocaleDateString()}</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate(`/documents/${doc._id}`)}
                                className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                            >
                                View
                            </button>
                            <button className="flex-1 border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                                Study
                            </button>
                        </div>
                    </div>
                ))}
                {documents.length === 0 && !isUploading && (
                    <div className="col-span-full py-12 text-center text-gray-500 bg-white border border-gray-200 rounded-xl">
                        You haven't uploaded any documents yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentLibrary;
