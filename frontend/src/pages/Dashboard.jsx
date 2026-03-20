import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import axios from 'axios';
import { Loader2, FileText, BookOpen, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user, token } = useAuthStore();
    const [statsData, setStatsData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get('https://ai-based-learning-app-1.onrender.com/api/dashboard/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStatsData(data);
            } catch (err) {
                setError('Failed to load dashboard data.');
            } finally {
                setIsLoading(false);
            }
        };
        if (token) fetchStats();
    }, [token]);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <>
            <header className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]}!</h1>
            </header>

            {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6" />
                        </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Total Documents</h3>
                    <p className="text-3xl font-bold text-gray-900">{statsData?.stats?.totalDocuments || 0}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-6 h-6" />
                        </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Generated Flashcards</h3>
                    <p className="text-3xl font-bold text-gray-900">{statsData?.stats?.totalFlashcards || 0}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                            <HelpCircle className="w-6 h-6" />
                        </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Quizzes Taken</h3>
                    <p className="text-3xl font-bold text-gray-900">{statsData?.stats?.totalQuizzes || 0}</p>
                </div>
            </div>

            {/* Interaction Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Link to="/documents" className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                    <h3 className="text-2xl font-bold mb-2">Upload a Document</h3>
                    <p className="text-blue-100 opacity-90 mb-6">Drop your PDFs here to let AI analyze your study materials.</p>
                    <span className="bg-white/20 px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm">Go to Library →</span>
                </Link>
                <Link to="/study" className="bg-gradient-to-br from-indigo-600 to-purple-800 rounded-2xl p-8 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                    <h3 className="text-2xl font-bold mb-2">Study Tools</h3>
                    <p className="text-indigo-100 opacity-90 mb-6">Generate flashcards and quizzes instantly from your documents.</p>
                    <span className="bg-white/20 px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm">View Tools →</span>
                </Link>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                    <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
                </div>
                <div className="divide-y divide-gray-100">
                    {statsData?.recentActivity?.length > 0 ? (
                        statsData.recentActivity.map((activity, idx) => (
                            <div key={idx} className="p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                                <div className={`p-2 rounded-full ${activity.type.includes('Document') ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                    {activity.type.includes('Document') ? <FileText className="w-5 h-5" /> : <HelpCircle className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                                    <p className="text-sm text-gray-500">{activity.title} • {new Date(activity.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-6 text-center text-gray-500 py-12">
                            No recent activity to show. Upload a document to get started.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Dashboard;
