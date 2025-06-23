import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bot profiles table
export const botProfiles = pgTable("bot_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull(),
  name: varchar("name").notNull(),
  gender: varchar("gender").notNull(),
  role: varchar("role").notNull(),
  tone: varchar("tone").notNull(),
  backstory: text("backstory"),
  avatarUrl: varchar("avatar_url"),
  theme: varchar("theme").notNull().default("wallflower"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chat messages table
export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull(),
  botProfileId: uuid("bot_profile_id").notNull(),
  message: text("message").notNull(),
  sender: varchar("sender").notNull(), // "user" or "bot"
  timestamp: timestamp("timestamp").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  botProfiles: many(botProfiles),
  chatMessages: many(chatMessages),
}));

export const botProfilesRelations = relations(botProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [botProfiles.userId],
    references: [users.id],
  }),
  chatMessages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id],
  }),
  botProfile: one(botProfiles, {
    fields: [chatMessages.botProfileId],
    references: [botProfiles.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users);
export const insertBotProfileSchema = createInsertSchema(botProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBotProfile = z.infer<typeof insertBotProfileSchema>;
export type BotProfile = typeof botProfiles.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
