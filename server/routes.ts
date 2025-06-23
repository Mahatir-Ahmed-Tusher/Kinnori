import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupClientOnlyAPI } from "./api-routes";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup client-only API endpoints
  setupClientOnlyAPI(app);

  // Create HTTP server (don't listen here, let index.ts handle it)
  const server = createServer(app);
  return server;
}