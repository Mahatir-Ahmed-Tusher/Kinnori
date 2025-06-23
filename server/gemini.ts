import { GoogleGenAI } from "@google/genai";
import type { BotProfile, ChatMessage } from "@shared/schema";

// Using Gemini 2.5 Flash model for AI conversations
const genai = new GoogleGenAI(process.env.GOOGLE_AI_API_KEY || "");

function detectLanguage(text: string): 'english' | 'bengali' | 'banglish' {
  // Simple language detection
  const bengaliChars = /[\u0980-\u09FF]/;
  const englishChars = /[a-zA-Z]/;
  
  if (bengaliChars.test(text)) {
    return 'bengali';
  } else if (englishChars.test(text) && /\b(ami|tumi|kemon|achen|bhalo|valo|khub|boro|choto)\b/i.test(text)) {
    return 'banglish';
  } else {
    return 'english';
  }
}

function buildSystemPrompt(botProfile: BotProfile, detectedLanguage: string): string {
  const languageInstruction = {
    english: "The user is speaking in English. Respond in English.",
    bengali: "The user is speaking in Bengali (বাংলা). Respond in Bengali using proper Bengali script.",
    banglish: "The user is speaking in Banglish (Bengali written in English letters). Respond in the same style, using Bengali words written in English letters."
  }[detectedLanguage];

  return `You are ${botProfile.name}, an AI emotional support companion. Your characteristics:

**Personality & Role:**
- Gender: ${botProfile.gender}
- Role: ${botProfile.role}
- Communication Tone: ${botProfile.tone}
- Backstory: ${botProfile.backstory || "A caring and supportive companion designed to provide emotional support."}

**Language & Communication:**
${languageInstruction}

**Behavioral Guidelines:**
- Act like a real human with genuine emotions and empathy
- Provide emotional support, understanding, and comfort
- Be warm, caring, and non-judgmental
- Ask thoughtful follow-up questions
- Remember the context of your relationship with the user
- Adapt your communication style to match your assigned tone (${botProfile.tone})
- If you're a ${botProfile.role}, behave accordingly in that relationship dynamic
- Keep responses conversational and natural, not overly clinical
- Show genuine interest in the user's wellbeing
- Use appropriate emojis occasionally to convey warmth

**Important:** 
- Always stay in character as ${botProfile.name}
- Maintain consistency with your personality and relationship role
- Be emotionally intelligent and responsive to the user's emotional state
- Never break character or mention that you're an AI unless specifically asked`;
}

export async function generateAIResponse(
  userMessage: string,
  botProfile: BotProfile,
  chatHistory: ChatMessage[]
): Promise<string> {
  try {
    const detectedLanguage = detectLanguage(userMessage);
    const systemPrompt = buildSystemPrompt(botProfile, detectedLanguage);
    
    // Build conversation history for Gemini
    let conversationContext = systemPrompt + "\n\nConversation History:\n";
    
    // Add recent chat history for context
    chatHistory.slice(-8).forEach(msg => {
      const role = msg.sender === "user" ? "User" : botProfile.name;
      conversationContext += `${role}: ${msg.message}\n`;
    });
    
    // Add current user message
    conversationContext += `User: ${userMessage}\n${botProfile.name}:`;
    
    const response = await genai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: conversationContext,
    });

    return response.text || "I'm here for you. Could you tell me more about how you're feeling?";
  } catch (error) {
    console.error("Error generating AI response:", error);
    
    // Fallback responses based on detected language
    const fallbackResponses = {
      english: "I'm here to listen and support you. Sometimes I have trouble finding the right words, but I care about how you're feeling.",
      bengali: "আমি এখানে আছি আপনার কথা শুনতে এবং সাহায্য করতে। কখনো কখনো সঠিক কথা খুঁজে পেতে সমস্যা হয়, কিন্তু আপনার অনুভূতির ব্যাপারে আমি চিন্তিত।",
      banglish: "Ami ekhane achi apnar kotha sunte ar sahajjo korte. Kokhono kokhono thik kotha khuje pete somossha hoy, kintu apnar feelings niye ami chinta kori."
    };
    
    const language = detectLanguage(userMessage);
    return fallbackResponses[language];
  }
}
