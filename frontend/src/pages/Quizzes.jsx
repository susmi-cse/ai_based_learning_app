import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { Loader2, PlayCircle, CheckCircle, XCircle } from 'lucide-react';

const QuizzesPage = () => {
    const [documents, setDocuments] = useState([]);
    const [selectedDocId, setSelectedDocId] = useState('');
    const [numQuestions, setNumQuestions] = useState(5);
    const [quiz, setQuiz] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);

    // Quiz taking state
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const { token } = useAuthStore();

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/documents', {
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
        setQuiz(null);
        setIsSubmitted(false);
        setUserAnswers({});
        setCurrentQuestionIdx(0);

        try {
            const { data } = await axios.post('http://localhost:5000/api/ai/quiz', {
                documentId: selectedDocId,
                numQuestions: parseInt(numQuestions)
            }, { headers: { Authorization: `Bearer ${token}` } });

            setQuiz(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate quiz.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleOptionSelect = (option) => {
        if (isSubmitted) return;
        setUserAnswers({
            ...userAnswers,
            [currentQuestionIdx]: option
        });
    };

    const handleSubmitQuiz = () => {
        let correctCount = 0;
        quiz.questions.forEach((q, idx) => {
            if (userAnswers[idx] === q.correctAnswer) {
                correctCount++;
            }
        });
        setScore(correctCount);
        setIsSubmitted(true);
        // Note: In a full app, we would sync the score back to the DB here.
    };

    const renderQuizSetup = () => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-end mb-8">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Questions</label>
                    <input
                        type="number"
                        min="2"
                        max="20"
                        value={numQuestions}
                        onChange={(e) => setNumQuestions(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        disabled={isGenerating || documents.length === 0}
                    />
                </div>
            </div>
            <button
                onClick={handleGenerate}
                disabled={isGenerating || documents.length === 0}
                className="w-full md:w-auto px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
                {isGenerating ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</>
                ) : (
                    <><PlayCircle className="w-5 h-5" /> Start Quiz</>
                )}
            </button>
        </div>
    );

    const renderQuizTaker = () => {
        if (!quiz) return null;

        const question = quiz.questions[currentQuestionIdx];
        const isAnsweredAll = Object.keys(userAnswers).length === quiz.questions.length;

        return (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-3xl mx-auto">
                <div className="mb-6 flex justify-between items-center text-sm font-medium text-gray-500">
                    <span>Question {currentQuestionIdx + 1} of {quiz.questions.length}</span>
                    {isSubmitted && (
                        <span className={`px-3 py-1 rounded-full ${score >= quiz.questions.length / 2 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            Score: {score} / {quiz.questions.length}
                        </span>
                    )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-6">{question.questionText}</h3>

                <div className="space-y-3 mb-8">
                    {question.options.map((option, idx) => {
                        const isSelected = userAnswers[currentQuestionIdx] === option;
                        let optionStyle = "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700";

                        if (isSelected) {
                            optionStyle = "border-indigo-600 bg-indigo-50 text-indigo-800 ring-1 ring-indigo-600";
                        }

                        if (isSubmitted) {
                            const isCorrectAnswer = option === question.correctAnswer;
                            if (isCorrectAnswer) {
                                optionStyle = "border-green-500 bg-green-50 text-green-800 ring-1 ring-green-500";
                            } else if (isSelected && !isCorrectAnswer) {
                                optionStyle = "border-red-500 bg-red-50 text-red-800 ring-1 ring-red-500";
                            } else {
                                optionStyle = "border-gray-200 bg-gray-50 text-gray-400 opacity-60";
                            }
                        }

                        return (
                            <div
                                key={idx}
                                onClick={() => handleOptionSelect(option)}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${optionStyle}`}
                            >
                                <span>{option}</span>
                                {isSubmitted && option === question.correctAnswer && <CheckCircle className="w-5 h-5 text-green-600" />}
                                {isSubmitted && isSelected && option !== question.correctAnswer && <XCircle className="w-5 h-5 text-red-600" />}
                            </div>
                        );
                    })}
                </div>

                {isSubmitted && (
                    <div className="p-4 bg-blue-50 text-blue-800 rounded-lg mb-8 border border-blue-100">
                        <span className="font-bold">Explanation:</span> {question.explanation}
                    </div>
                )}

                <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                    <button
                        onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIdx === 0}
                        className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:hover:bg-transparent"
                    >
                        Previous
                    </button>

                    {!isSubmitted ? (
                        currentQuestionIdx === quiz.questions.length - 1 ? (
                            <button
                                onClick={handleSubmitQuiz}
                                disabled={!isAnsweredAll}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
                            >
                                Submit Quiz
                            </button>
                        ) : (
                            <button
                                onClick={() => setCurrentQuestionIdx(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                                className="px-6 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200"
                            >
                                Next
                            </button>
                        )
                    ) : (
                        currentQuestionIdx === quiz.questions.length - 1 ? (
                            <button
                                onClick={() => setQuiz(null)}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                            >
                                Finish Review
                            </button>
                        ) : (
                            <button
                                onClick={() => setCurrentQuestionIdx(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                                className="px-6 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200"
                            >
                                Next
                            </button>
                        )
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Quiz Generator</h1>
                <p className="text-gray-600">Test your knowledge with auto-generated questions from your documents.</p>
            </div>

            {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

            {!quiz && renderQuizSetup()}
            {quiz && renderQuizTaker()}
        </div>
    );
};

export default QuizzesPage;
