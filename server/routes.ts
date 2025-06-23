import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupGoogleAuth, isAuthenticated } from "./googleAuth";
import { insertBotProfileSchema, insertChatMessageSchema } from "@shared/schema";
import { generateAIResponse } from "./gemini";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupGoogleAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Bot profile routes
  app.get('/api/bot-profiles', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profiles = await storage.getBotProfilesByUserId(userId);
      res.json(profiles);
    } catch (error) {
      console.error("Error fetching bot profiles:", error);
      res.status(500).json({ message: "Failed to fetch bot profiles" });
    }
  });

  app.post('/api/bot-profiles', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileData = insertBotProfileSchema.parse({
        ...req.body,
        userId,
      });
      
      const profile = await storage.createBotProfile(profileData);
      res.json(profile);
    } catch (error) {
      console.error("Error creating bot profile:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create bot profile" });
      }
    }
  });

  app.put('/api/bot-profiles/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      // Verify the profile belongs to the user
      const existingProfile = await storage.getBotProfile(id);
      if (!existingProfile || existingProfile.userId !== userId) {
        return res.status(404).json({ message: "Bot profile not found" });
      }
      
      const updates = insertBotProfileSchema.partial().parse(req.body);
      const profile = await storage.updateBotProfile(id, updates);
      res.json(profile);
    } catch (error) {
      console.error("Error updating bot profile:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update bot profile" });
      }
    }
  });

  app.delete('/api/bot-profiles/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      // Verify the profile belongs to the user
      const existingProfile = await storage.getBotProfile(id);
      if (!existingProfile || existingProfile.userId !== userId) {
        return res.status(404).json({ message: "Bot profile not found" });
      }
      
      await storage.deleteBotProfile(id);
      res.json({ message: "Bot profile deleted successfully" });
    } catch (error) {
      console.error("Error deleting bot profile:", error);
      res.status(500).json({ message: "Failed to delete bot profile" });
    }
  });

  // Chat message routes
  app.get('/api/chat-messages/:botProfileId', isAuthenticated, async (req: any, res) => {
    try {
      const { botProfileId } = req.params;
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 50;
      
      // Verify the bot profile belongs to the user
      const botProfile = await storage.getBotProfile(botProfileId);
      if (!botProfile || botProfile.userId !== userId) {
        return res.status(404).json({ message: "Bot profile not found" });
      }
      
      const messages = await storage.getChatMessages(userId, botProfileId, limit);
      res.json(messages.reverse()); // Return in chronological order
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post('/api/chat-messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messageData = insertChatMessageSchema.parse({
        ...req.body,
        userId,
      });
      
      // Verify the bot profile belongs to the user
      const botProfile = await storage.getBotProfile(messageData.botProfileId);
      if (!botProfile || botProfile.userId !== userId) {
        return res.status(404).json({ message: "Bot profile not found" });
      }
      
      // Save user message
      const userMessage = await storage.createChatMessage(messageData);
      
      // Get recent chat history for context
      const recentMessages = await storage.getChatMessages(userId, messageData.botProfileId, 10);
      
      // Generate AI response
      const aiResponse = await generateAIResponse(
        messageData.message,
        botProfile,
        recentMessages.reverse()
      );
      
      // Save AI response
      const botMessage = await storage.createChatMessage({
        userId,
        botProfileId: messageData.botProfileId,
        message: aiResponse,
        sender: "bot",
      });
      
      res.json({ userMessage, botMessage });
    } catch (error) {
      console.error("Error creating chat message:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid message data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to send message" });
      }
    }
  });

  app.delete('/api/chat-messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { botProfileId } = req.query;
      
      if (botProfileId) {
        // Verify the bot profile belongs to the user
        const botProfile = await storage.getBotProfile(botProfileId as string);
        if (!botProfile || botProfile.userId !== userId) {
          return res.status(404).json({ message: "Bot profile not found" });
        }
      }
      
      await storage.deleteChatMessages(userId, botProfileId as string);
      res.json({ message: "Chat messages deleted successfully" });
    } catch (error) {
      console.error("Error deleting chat messages:", error);
      res.status(500).json({ message: "Failed to delete chat messages" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
