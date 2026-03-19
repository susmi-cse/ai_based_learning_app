import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, HelpCircle } from 'lucide-react';

const StudyTools = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Tools</h1>
            <p className="text-gray-600 mb-8">Transform your documents into interactive learning experiences using AI.</p>

            <div className="grid md:grid-cols-2 gap-6">
                <Link to="/study/flashcards" className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-blue-200 transition-all block text-center">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">AI Flashcards</h2>
                    <p className="text-gray-600 mb-6">Automatically extract key concepts and definitions from your PDFs into interactive 3D flashcards.</p>
                    <span className="inline-block px-5 py-2.5 bg-blue-50 text-blue-700 font-medium rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        Generate Flashcards
                    </span>
                </Link>

                <Link to="/study/quizzes" className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-indigo-200 transition-all block text-center">
                    <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                        <HelpCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Custom Quizzes</h2>
                    <p className="text-gray-600 mb-6">Test your knowledge with multiple-choice quizzes created directly from your study materials.</p>
                    <span className="inline-block px-5 py-2.5 bg-indigo-50 text-indigo-700 font-medium rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        Take a Quiz
                    </span>
                </Link>
            </div>
        </div>
    );
};

export default StudyTools;
