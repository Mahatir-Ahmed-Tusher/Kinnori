import type { Express } from "express";
import { generateAIResponse } from "./gemini";
import type { BotProfile, ChatMessage } from "@shared/schema";

export function setupClientOnlyAPI(app: Express) {
  // Simple endpoint for Gemini API calls
  app.post('/api/chat/gemini', async (req, res) => {
    try {
      const { userMessage, botProfile, chatHistory } = req.body;
      
      if (!userMessage || !botProfile) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const response = await generateAIResponse(
        userMessage as string,
        botProfile as BotProfile,
        chatHistory as ChatMessage[] || []
      );

      res.json({ response });
    } catch (error) {
      console.error('Error in Gemini API:', error);
      res.status(500).json({ error: 'Failed to generate AI response' });
    }
  });
}