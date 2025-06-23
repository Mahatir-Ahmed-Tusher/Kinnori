import {
  users,
  botProfiles,
  chatMessages,
  type User,
  type UpsertUser,
  type BotProfile,
  type InsertBotProfile,
  type ChatMessage,
  type InsertChatMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Bot profile operations
  getBotProfilesByUserId(userId: string): Promise<BotProfile[]>;
  getBotProfile(id: string): Promise<BotProfile | undefined>;
  createBotProfile(botProfile: InsertBotProfile): Promise<BotProfile>;
  updateBotProfile(id: string, updates: Partial<InsertBotProfile>): Promise<BotProfile>;
  deleteBotProfile(id: string): Promise<void>;
  
  // Chat message operations
  getChatMessages(userId: string, botProfileId: string, limit?: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  deleteChatMessages(userId: string, botProfileId?: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }
  
  // Bot profile operations
  async getBotProfilesByUserId(userId: string): Promise<BotProfile[]> {
    return await db
      .select()
      .from(botProfiles)
      .where(eq(botProfiles.userId, userId))
      .orderBy(desc(botProfiles.createdAt));
  }

  async getBotProfile(id: string): Promise<BotProfile | undefined> {
    const [profile] = await db
      .select()
      .from(botProfiles)
      .where(eq(botProfiles.id, id));
    return profile;
  }

  async createBotProfile(botProfile: InsertBotProfile): Promise<BotProfile> {
    const [profile] = await db
      .insert(botProfiles)
      .values(botProfile)
      .returning();
    return profile;
  }

  async updateBotProfile(id: string, updates: Partial<InsertBotProfile>): Promise<BotProfile> {
    const [profile] = await db
      .update(botProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(botProfiles.id, id))
      .returning();
    return profile;
  }

  async deleteBotProfile(id: string): Promise<void> {
    await db.delete(botProfiles).where(eq(botProfiles.id, id));
  }
  
  // Chat message operations
  async getChatMessages(userId: string, botProfileId: string, limit = 50): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(
        and(
          eq(chatMessages.userId, userId),
          eq(chatMessages.botProfileId, botProfileId)
        )
      )
      .orderBy(desc(chatMessages.timestamp))
      .limit(limit);
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [chatMessage] = await db
      .insert(chatMessages)
      .values(message)
      .returning();
    return chatMessage;
  }

  async deleteChatMessages(userId: string, botProfileId?: string): Promise<void> {
    if (botProfileId) {
      await db
        .delete(chatMessages)
        .where(
          and(
            eq(chatMessages.userId, userId),
            eq(chatMessages.botProfileId, botProfileId)
          )
        );
    } else {
      await db
        .delete(chatMessages)
        .where(eq(chatMessages.userId, userId));
    }
  }
}

export const storage = new DatabaseStorage();
