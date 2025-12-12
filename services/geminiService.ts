import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ReportData, ChatMessage } from "../types";

// Schema for structured output
const reportSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    personaName: { type: Type.STRING, description: "A creative name for the user's situation" },
    executiveSummary: { type: Type.STRING, description: "2-3 sentences summarizing their situation" },
    opportunityScore: { type: Type.NUMBER, description: "0-100 score" },
    estimatedHoursSaved: { type: Type.NUMBER, description: "Estimated hours saved per week" },
    topPriorities: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Top 3 areas to focus on"
    },
    quickWins: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          tool: { type: Type.STRING },
          description: { type: Type.STRING }
        }
      }
    },
    roadmap: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          taskName: { type: Type.STRING },
          difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Advanced'] },
          timeSavings: { type: Type.STRING },
          tools: { type: Type.STRING },
          blueprint: { type: Type.STRING, description: "A simple 3 step list" },
          approach: { type: Type.STRING, enum: ['DIY', 'Hire Help'] }
        }
      }
    },
    expertHelp: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          area: { type: Type.STRING },
          roi: { type: Type.STRING },
          description: { type: Type.STRING }
        }
      }
    },
    weeklyForecast: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          week: { type: Type.STRING },
          hoursSaved: { type: Type.NUMBER }
        }
      }
    }
  },
  required: ["personaName", "executiveSummary", "opportunityScore", "roadmap", "quickWins", "weeklyForecast"]
};

export const generateReport = async (quizData: any): Promise<ReportData> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key missing");

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Act as a world-class automation consultant.
    Analyze the following user data from a "TimeBack Studio" quiz and generate a personalized automation plan.
    
    User Data:
    ${JSON.stringify(quizData, null, 2)}
    
    The tone should be empathetic, encouraging, and professional.
    For the 'weeklyForecast', generate data points for: "Week 1-2", "Week 3-4", "Month 2", "Month 6".
    Ensure the 'roadmap' items directly address the 'painPoints' identified in the data.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: reportSchema,
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as ReportData;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    // Fallback/Mock data could be returned here in production to prevent crashes
    throw error;
  }
};

export const chatWithAssistant = async (history: ChatMessage[], currentMessage: string, contextData: any): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "I'm having trouble connecting right now.";

  const ai = new GoogleGenAI({ apiKey });

  // Construct context
  const systemInstruction = `
    You are the TimeBack Studio AI Assistant. You are friendly, helpful, and an expert in business automation.
    You have access to the user's quiz results and their generated report.
    
    User Context:
    ${JSON.stringify(contextData, null, 2)}
    
    Answer questions specifically about their automation plan. Keep answers concise (under 100 words) unless asked for detail.
  `;

  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction,
    },
    history: history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    }))
  });

  try {
    const result = await chat.sendMessage({ message: currentMessage });
    return result.text || "I didn't catch that. Could you rephrase?";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Sorry, I'm experiencing a high volume of requests. Please try again in a moment.";
  }
};
