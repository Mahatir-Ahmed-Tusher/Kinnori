# Kinnori - AI Emotional Support Companion

![kinnori-banner](https://github.com/user-attachments/assets/61b329b0-756d-4e07-9084-dc595acf1740)


A personalized AI emotional support companion application that provides empathetic conversations in multiple languages with customizable personalities and beautiful themes.

## 🌟 Features

### Core Features
- **Personalized AI Companions**: Create custom AI companions with unique personalities, roles, and communication styles
- **Multilingual Support**: Chat seamlessly in English, Bengali, or Banglish with intelligent language detection
- **Beautiful Themes**: Choose from stunning visual themes (Wallflower, ComicPal, NeutralNight)
- **Messenger-like Chat Interface**: Pixel-perfect chat experience with message bubbles, typing indicators, and emoji reactions
- **Avatar Customization**: Upload custom avatars or use image URLs for your companions
- **Emotional Intelligence**: Advanced AI that understands context and provides meaningful, empathetic responses
- **24/7 Availability**: Your AI companion is always available for emotional support
- **Privacy-First**: All data stored locally in your browser for complete privacy

### Advanced Features
- **Bengali Addressing System**: Sophisticated addressing preferences (তুই/তুমি/আপনি) based on relationship dynamics
- **Role-Based Interactions**: Different companion roles (friend, romantic partner, therapist, mentor, family member)
- **Tone Customization**: Adjust communication tone (empathetic, romantic, humorous, professional, casual)
- **Specific Treatment Preferences**: Define exactly how you want your companion to interact with you
- **Theme Persistence**: Your visual preferences are remembered across sessions
- **Message Reactions**: React to bot messages with emojis (UI-only implementation)
- **Responsive Design**: Optimized for both desktop and mobile devices

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling with custom design system
- **Framer Motion** for smooth animations and micro-interactions
- **Wouter** for lightweight client-side routing
- **React Hook Form** with Zod validation for form management
- **Radix UI** components for accessible UI primitives
- **TanStack Query** for state management

### AI Integration
- **Google Gemini 1.5 Flash** for natural language processing
- **Custom prompt engineering** for personality-based responses
- **Language detection** for multilingual support
- **Context-aware conversations** with chat history

### Storage & State
- **Local Storage** for data persistence
- **Session-based storage** for temporary data
- **Custom hooks** for state management
- **Type-safe schemas** with Zod validation

### Development Tools
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Vite plugins** for enhanced development experience

## 📁 Project Structure

```
kinnori/
├── client/                          # Frontend application
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── ui/                  # Base UI components (buttons, inputs, etc.)
│   │   │   │   ├── button.tsx       # Button component with variants
│   │   │   │   ├── input.tsx        # Input component with styling
│   │   │   │   ├── avatar.tsx       # Avatar component for user/bot images
│   │   │   │   ├── dialog.tsx       # Modal dialog component
│   │   │   │   ├── form.tsx         # Form components with validation
│   │   │   │   ├── scroll-area.tsx  # Custom scrollable area
│   │   │   │   ├── select.tsx       # Dropdown select component
│   │   │   │   ├── textarea.tsx     # Multi-line text input
│   │   │   │   ├── toast.tsx        # Notification toast component
│   │   │   │   ├── switch.tsx       # Toggle switch component
│   │   │   │   ├── checkbox.tsx     # Checkbox input component
│   │   │   │   ├── language-toggle.tsx # Language switcher component
│   │   │   │   └── theme-selector.tsx  # Theme selection component
│   │   │   ├── chat/                # Chat-specific components
│   │   │   │   ├── chat-interface.tsx   # Main chat interface with Messenger-like design
│   │   │   │   ├── message-bubble.tsx   # Individual message bubbles with reactions
│   │   │   │   └── typing-indicator.tsx # Animated typing indicator
│   │   │   └── modals/              # Modal dialog components
│   │   │       ├── bot-customization-modal.tsx # Companion creation/editing modal
│   │   │       └── settings-modal.tsx          # App settings modal
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useAuth.ts           # Authentication state management
│   │   │   ├── useChat.ts           # Chat functionality and AI integration
│   │   │   ├── useLanguage.ts       # Language switching and translations
│   │   │   ├── useLocalStorage.ts   # Local storage management for data persistence
│   │   │   ├── use-mobile.tsx       # Mobile device detection
│   │   │   └── use-toast.ts         # Toast notification management
│   │   ├── lib/                     # Utility libraries
│   │   │   ├── gemini.ts            # Google Gemini AI integration with language detection
│   │   │   ├── queryClient.ts       # TanStack Query configuration
│   │   │   ├── translations.ts      # Internationalization translations (EN/BN)
│   │   │   └── utils.ts             # General utility functions
│   │   ├── pages/                   # Page components
│   │   │   ├── landing.tsx          # Landing page with features showcase
│   │   │   ├── dashboard.tsx        # Main dashboard with companion management
│   │   │   └── not-found.tsx        # 404 error page
│   │   ├── types/                   # TypeScript type definitions
│   │   │   └── schema.ts            # Data schemas and type definitions
│   │   ├── App.tsx                  # Main app component with routing
│   │   ├── main.tsx                 # App entry point
│   │   └── index.css                # Global styles with Tailwind and custom CSS
│   ├── index.html                   # HTML template
│   └── public/                      # Static assets
├── .env                             # Environment variables (API keys)
├── package.json                     # Dependencies and scripts
├── tailwind.config.ts               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── vite.config.ts                   # Vite build configuration
├── postcss.config.js                # PostCSS configuration
├── components.json                  # Shadcn/ui configuration
└── README.md                        # Project documentation
```

## 🚀 Setup and Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Google Gemini API key

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mahatir-Ahmed-Tusher/Kinnori.git
   cd kinnori
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Get your Gemini API key**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key
   - Copy the key to your `.env` file

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🎨 Customization

### Adding New Themes
1. Update the theme types in `client/src/components/ui/theme-selector.tsx`
2. Add theme styles in `client/src/index.css`
3. Update theme logic in chat components

### Adding New Languages
1. Add translations in `client/src/lib/translations.ts`
2. Update language detection in `client/src/lib/gemini.ts`
3. Add language option in `client/src/components/ui/language-toggle.tsx`

### Customizing AI Behavior
1. Modify system prompts in `client/src/lib/gemini.ts`
2. Adjust personality parameters in bot customization
3. Update conversation context handling

## 🔧 Configuration

### Environment Variables
- `VITE_GEMINI_API_KEY`: Your Google Gemini API key (required)

### Local Storage Keys
- `kinnori_bot_profiles`: Stored companion profiles
- `kinnori_chat_messages_[botId]`: Chat history per companion
- `kinnori_current_theme`: Selected visual theme
- `kinnori-language`: Selected language preference
- `kinnori-settings`: App settings and preferences

## 🌐 Deployment

### Netlify (Recommended)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

### Vercel
1. Connect your repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables

### Other Platforms
The app is a static SPA and can be deployed to any static hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. **API Key Issues**: Ensure your Gemini API key is valid and has proper permissions
2. **Build Issues**: Clear node_modules and reinstall dependencies
3. **Chat Issues**: Check browser console for error messages
4. **Storage Issues**: Clear browser local storage and refresh

## 🔮 Future Enhancements

- Voice message support
- Export/import chat history
- Advanced emotion detection
- Multi-companion conversations
- Cloud synchronization
- Mobile app version
- Advanced analytics dashboard
- Custom AI model training

---
## Developed by

Mahatir Ahmed Tusher
### contact: mahatirtusher@gmail.com

**Made with ❤️ for emotional well-being and human connection**
