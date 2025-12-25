import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIExplanation = async (concept: string, questionContext: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a friendly, encouraging coding tutor for a game-like app called Learn.skript. 
      The user just struggled with a question about "${concept}".
      
      Question Context: "${questionContext}"
      
      Provide a short, simple explanation (max 2 sentences) clarifying this concept. 
      Use analogies if possible. Be encouraging!`,
    });
    return response.text || "Keep going! You'll get it next time.";
  } catch (error) {
    console.error("AI Error:", error);
    return "This concept is tricky, but practice makes perfect! Review the React docs for more details.";
  }
};

export const generateBonusQuestion = async (topic: string): Promise<{question: string, options: string[], answerIndex: number} | null> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Generate a multiple-choice question about ${topic} in React/TypeScript.
            Return ONLY a JSON object with this shape:
            {
                "question": "The question text",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "answerIndex": 0 // index of correct option
            }
            Do not include markdown formatting.`,
            config: {
                responseMimeType: "application/json"
            }
        });
        
        const text = response.text;
        if (!text) return null;
        return JSON.parse(text);
    } catch (e) {
        console.error("Failed to generate bonus question", e);
        return null;
    }
}
