# Kinnori - AI Emotional Support Companion

## Overview

Kinnori is a full-stack web application that provides personalized AI emotional support companions. The application allows users to create customized AI chatbots with unique personalities, roles, and communication styles. It supports multilingual conversations (English, Bengali, and Banglish) and offers multiple visual themes for a personalized chat experience.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server components:

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Language Support**: Custom i18n implementation with context-based language switching
- **UI Components**: Comprehensive component library based on Radix UI primitives

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth integration with OpenID Connect
- **AI Integration**: OpenAI GPT-4o for conversation generation
- **Session Management**: PostgreSQL-backed sessions with express-session

## Key Components

### Database Schema
The application uses three main database tables:
- **sessions**: Handles user session storage (required for Replit Auth)
- **users**: Stores user profile information from authentication
- **botProfiles**: Contains customizable AI companion configurations including personality traits, roles, and themes

### Authentication System
- Implements Replit Auth using OpenID Connect strategy
- Passport.js integration for session management
- PostgreSQL session storage for persistence
- Automatic user profile creation and updates

### AI Conversation Engine
- OpenAI GPT-4o integration for natural language processing
- Language detection system (English, Bengali, Banglish)
- Context-aware prompt engineering based on bot personality
- Streaming response capability for real-time conversations

### Frontend Features
- Responsive design with mobile-first approach
- Real-time chat interface with message history
- Bot customization modal with form validation
- Theme switching system (Wallflower, ComicPal, NeutralNight)
- Language toggle between English and Bengali
- Settings management with user preferences

## Data Flow

1. **User Authentication**: Users authenticate via Replit Auth, creating or updating user records
2. **Bot Management**: Users create and customize AI companions through the dashboard
3. **Chat Interactions**: Messages are sent to the backend, processed by OpenAI, and returned as AI responses
4. **Data Persistence**: All conversations, user data, and bot configurations are stored in PostgreSQL
5. **Real-time Updates**: React Query handles state synchronization and cache invalidation

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection pooling
- **drizzle-orm**: Type-safe database ORM
- **openai**: Official OpenAI API client
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

### Frontend Dependencies
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight routing
- **framer-motion**: Animation library
- **react-hook-form**: Form management with validation

## Deployment Strategy

The application is configured for deployment on Replit's infrastructure:

### Build Process
- **Development**: Uses tsx for TypeScript execution and Vite dev server
- **Production**: Builds client assets with Vite and server with esbuild
- **Database**: Automatic PostgreSQL provisioning via Replit modules

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- OpenAI API key configuration
- Session secret for authentication security
- Replit-specific OIDC configuration

### Deployment Settings
- Autoscale deployment target
- Port 5000 internal, Port 80 external
- Concurrent development workflow with hot reloading
- Static asset serving from built client directory

## Changelog

```
Changelog:
- June 23, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```