import { z } from "zod";

// Bot profile schema
export const insertBotProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  gender: z.enum(["female", "male", "non-binary"]),
  role: z.enum(["friend", "romantic-partner", "therapist", "mentor", "family-member", "acquaintance"]),
  tone: z.enum(["empathetic", "romantic", "humorous", "professional", "casual"]),
  backstory: z.string().optional(),
  avatarUrl: z.string().optional(),
  avatarFile: z.string().optional(),
  theme: z.enum(["wallflower", "comic", "neutral"]).default("wallflower"),
  specificTreatment: z.string().optional(),
  bengaliAddressing: z.enum(["tui", "tumi", "apni"]).optional(),
  canUseTui: z.boolean().optional(),
});

// Chat message schema
export const insertChatMessageSchema = z.object({
  botProfileId: z.string(),
  message: z.string().min(1, "Message cannot be empty"),
  sender: z.enum(["user", "bot"]),
});

// Types
export type BotProfile = {
  id: string;
  name: string;
  gender: "female" | "male" | "non-binary";
  role: "friend" | "romantic-partner" | "therapist" | "mentor" | "family-member" | "acquaintance";
  tone: "empathetic" | "romantic" | "humorous" | "professional" | "casual";
  backstory?: string;
  avatarUrl?: string;
  avatarFile?: string;
  theme: "wallflower" | "comic" | "neutral";
  specificTreatment?: string;
  bengaliAddressing?: "tui" | "tumi" | "apni";
  canUseTui?: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ChatMessage = {
  id: string;
  botProfileId: string;
  message: string;
  sender: "user" | "bot";
  timestamp: Date;
};

export type InsertBotProfile = z.infer<typeof insertBotProfileSchema>;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;