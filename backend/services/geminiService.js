const { GoogleGenerativeAI } = require('@google/generative-ai');

// Function to initialize the AI model
const getModel = () => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Use gemini-1.5-flash as the default for fast text tasks
    return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};

const generateChatResponse = async (context, prompt) => {
    const model = getModel();
    const fullPrompt = `Below is the text extracted from a document. Use this context to answer the user's question. If the answer is not in the context, say so.\n\nContext:\n${context.substring(0, 30000)}\n\nUser Question:\n${prompt}`;

    const result = await model.generateContent(fullPrompt);
    return result.response.text();
};

const summarizeDocument = async (context) => {
    const model = getModel();
    const fullPrompt = `Please provide a detailed, well-structured summary of the following document. Highlight the main topics, key arguments, and conclusions.\n\nDocument Text:\n${context.substring(0, 30000)}`;

    const result = await model.generateContent(fullPrompt);
    return result.response.text();
};

const explainConcept = async (context, concept) => {
    const model = getModel();
    const fullPrompt = `Based on the following document context, please explain the concept of "${concept}" in detail. Make it easy to understand.\n\nContext:\n${context.substring(0, 30000)}`;

    const result = await model.generateContent(fullPrompt);
    return result.response.text();
};

const generateFlashcards = async (context, count = 10) => {
    const model = getModel();
    // Use JSON schema enforcement or ask for specific JSON structure
    const fullPrompt = `Extract key concepts from the following document text and generate exactly ${count} flashcards. 
Return the result strictly as a valid JSON array of objects. Each object must have a "frontText" and "backText" string property. Do not include markdown formatting like \`\`\`json in your response. just the array.

Document Text:\n${context.substring(0, 30000)}`;

    const result = await model.generateContent(fullPrompt);
    const textResponse = result.response.text().trim();
    // Attempt to parse the JSON. In production, we'd use Structured Outputs if available, or robust Regex parsing.
    let jsonMatch = textResponse.match(/\[.*\]/s);
    if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(textResponse); // Fallback
};

const generateQuiz = async (context, numQuestions = 5) => {
    const model = getModel();
    const fullPrompt = `Based on the following document text, generate a multiple-choice quiz with exactly ${numQuestions} questions.
Return the result strictly as a valid JSON array of objects. 
Each object must have:
- "questionText" (string)
- "options" (array of exactly 4 strings)
- "correctAnswer" (string, must exactly match one of the options)
- "explanation" (string, explaining why the answer is correct based on the text)

Do not include markdown formatting like \`\`\`json. Just the JSON array.

Document Text:\n${context.substring(0, 30000)}`;

    const result = await model.generateContent(fullPrompt);
    const textResponse = result.response.text().trim();
    let jsonMatch = textResponse.match(/\[.*\]/s);
    if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(textResponse);
};

module.exports = {
    generateChatResponse,
    summarizeDocument,
    explainConcept,
    generateFlashcards,
    generateQuiz
};
