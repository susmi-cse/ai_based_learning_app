import React, { useState } from 'react';
import { Star } from 'lucide-react';

const Flashcard = ({ flashcard, onToggleFavorite }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="group h-64 w-full perspective-1000 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`relative h-full w-full rounded-xl shadow-md transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>

                {/* Front side */}
                <div className="absolute inset-0 h-full w-full rounded-xl bg-white p-6 backface-hidden border border-blue-100 flex flex-col justify-center items-center text-center shadow-sm hover:shadow-md transition-shadow">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(flashcard._id);
                        }}
                        className="absolute top-4 right-4 text-gray-300 hover:text-yellow-400 transition-colors"
                    >
                        <Star className={`w-6 h-6 ${flashcard.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                    </button>
                    <span className="text-sm font-medium text-blue-500 mb-2 uppercase tracking-wide">Concept</span>
                    <p className="text-xl font-semibold text-gray-800 break-words">{flashcard.frontText}</p>
                    <p className="absolute bottom-4 text-xs text-gray-400">Click to reveal</p>
                </div>

                {/* Back side */}
                <div className="absolute inset-0 h-full w-full rounded-xl bg-blue-600 p-6 backface-hidden rotate-y-180 flex flex-col justify-center items-center text-center shadow-lg text-white">
                    <span className="text-sm font-medium text-blue-200 mb-2 uppercase tracking-wide">Explanation</span>
                    <p className="text-lg font-medium break-words overflow-y-auto max-h-[150px] scrollbar-thin scrollbar-thumb-blue-400">{flashcard.backText}</p>
                    <p className="absolute bottom-4 text-xs text-blue-200">Click to flip back</p>
                </div>

            </div>
        </div>
    );
};

export default Flashcard;
