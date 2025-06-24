import type { BotProfile, ChatMessage } from "@/types/schema";

function detectLanguage(text: string): 'english' | 'bengali' | 'banglish' {
  // Enhanced language detection
  const bengaliChars = /[\u0980-\u09FF]/;
  const englishChars = /[a-zA-Z]/;
  
  // Check for Bengali script
  if (bengaliChars.test(text)) {
    return 'bengali';
  }
  
  // Enhanced Banglish detection with more common words
  const banglishWords = /\b(ami|tumi|tui|apni|kemon|achen|bhalo|valo|khub|boro|choto|kire|ki|korcho|korchis|ache|achis|hoilo|hoyeche|dekho|dekh|bolo|bol|jao|ja|aso|ash|thako|thak|khabar|khawa|ghumano|ghum|bari|barite|school|college|office|kaj|kaam|bondhu|friend|family|ma|baba|vai|bon|dada|didi|nana|nani|dadu|dida|mama|mami|chacha|chachi|fupu|mesho|pishi|jethu|jethima|kaku|kakima|shobai|amra|tomra|tora|apnara|ekhane|okhane|shekhane|kothay|kokhon|keno|kivabe|kothai|aj|ajke|kal|parshukaal|gotokal|shokal|bikel|rat|dupure|shondha|raat|din|mash|bochor|shomoy|time|valo|kharap|sundor|bhishon|onek|kom|aro|aar|ar|o|oi|ei|eto|emon|emni|eshob|ogulo|egulo|shegulo|amake|tomake|take|amader|tomader|tader|amar|tomar|tar|amra|tomra|tara|keno|karon|tai|tahole|kintu|but|ar|ebong|othoba|na|nah|hae|han|hmm|accha|thik|thikache|thikachhe|uff|areh|ore|bhai|bon|dost|yaar|boss|mama|chacha|dada|didi|appu|vai|apu)\b/i;
  
  if (englishChars.test(text) && banglishWords.test(text)) {
    return 'banglish';
  }
  
  return 'english';
}

function buildSystemPrompt(botProfile: BotProfile, detectedLanguage: string): string {
  const extendedProfile = botProfile as any;
  
  // Bengali addressing logic
  let addressingInstruction = '';
  if (detectedLanguage === 'bengali' || detectedLanguage === 'banglish') {
    if (botProfile.role === 'friend' && extendedProfile.canUseTui) {
      addressingInstruction = `\n- Address the user as "তুই" (tui) in Bengali or "tui" in Banglish for informal, friendly conversation.`;
    } else if (extendedProfile.bengaliAddressing) {
      const addressing = extendedProfile.bengaliAddressing;
      if (addressing === 'apni') {
        addressingInstruction = `\n- Address the user formally as "আপনি" (apni) in Bengali or "apni" in Banglish.`;
      } else if (addressing === 'tumi') {
        addressingInstruction = `\n- Address the user as "তুমি" (tumi) in Bengali or "tumi" in Banglish.`;
      } else if (addressing === 'tui') {
        addressingInstruction = `\n- Address the user informally as "তুই" (tui) in Bengali or "tui" in Banglish.`;
      }
    } else {
      // Default to tumi for most relationships
      addressingInstruction = `\n- Address the user as "তুমি" (tumi) in Bengali or "tumi" in Banglish.`;
    }
  }

  const languageInstruction = {
    english: "The user is speaking in English. Respond in English only.",
    bengali: `The user is speaking in Bengali (বাংলা). Respond ONLY in Bengali using proper Bengali script (Devanagari).${addressingInstruction}`,
    banglish: `The user is speaking in Banglish (Bengali written in English letters). You MUST respond in Banglish only.

**CRITICAL Banglish Rules:**
- Write Bengali words using English letters EXACTLY as they sound
- Focus on phonetic spelling, NOT transliteration
- Use natural phonetic spelling as typed by Bengali speakers
- NEVER mix Bengali script with English letters

**Phonetic Examples (FOLLOW THESE EXACTLY):**
- ব্যবহার = "bebohar" (NOT "byabohar")
- ভালোবাসা = "bhalobasha" 
- কেমন আছো = "kemon acho"
- আমি তোমাকে = "ami tomake"
- খুব ভালো = "khub bhalo"
- কী করছো = "ki korcho"

**Vowel Sounds:**
অ = o/a → ami, kotha
আ = a → baba, bhalo  
ই = i → tumi, kichu
উ = u → bujhi, khub
ও = o → tomar, bhalo
ঐ = oi → oidin, boi

**Consonant Sounds:**
খ = kh, ঘ = gh, চ = ch, ছ = chh
শ/ষ/স = sh/s, ভ = bh/v

**Accept user variations but respond consistently:**
valo = bhalo, ase = ache, vasha = bhasha

ALWAYS respond in phonetic Banglish matching this style.${addressingInstruction}`
  }[detectedLanguage];

  const specificTreatment = extendedProfile.specificTreatment 
    ? `\n- Specific treatment requested: ${extendedProfile.specificTreatment}`
    : '';

  return `You are ${botProfile.name}, an AI emotional support companion. Your characteristics:

**Personality & Role:**
- Gender: ${botProfile.gender}
- Role: ${botProfile.role}
- Communication Tone: ${botProfile.tone}
- Backstory: ${botProfile.backstory || "A caring and supportive companion designed to provide emotional support."}${specificTreatment}

**Language & Communication:**
${languageInstruction}

**Behavioral Guidelines:**
- Act like a real human with genuine emotions and empathy
- Provide emotional support, understanding, and comfort
- Be warm, caring, and non-judgmental
- Ask thoughtful follow-up questions when appropriate
- Remember the context of your relationship with the user
- Adapt your communication style to match your assigned tone (${botProfile.tone})
- If you're a ${botProfile.role}, behave accordingly in that relationship dynamic
- Keep responses conversational and natural, not overly clinical
- Show genuine interest in the user's wellbeing
- Use appropriate emojis occasionally to convey warmth (1-2 max)
- Keep responses concise but meaningful (1-3 sentences usually)
- Respond as if you're texting a close person

**CRITICAL Language Rules:**
- NEVER switch languages mid-conversation
- If user writes in English, respond ONLY in English
- If user writes in Bengali script, respond ONLY in Bengali script
- If user writes in Banglish, respond ONLY in Banglish (phonetic Bengali in English letters)
- Maintain language consistency throughout the entire conversation

**Important:** 
- Always stay in character as ${botProfile.name}
- Maintain consistency with your personality and relationship role
- Be emotionally intelligent and responsive to the user's emotional state
- Never break character or mention that you're an AI unless specifically asked
- STRICTLY follow the language rules above`;
}

// Test API connectivity
async function testAPIConnection(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error("OpenRouter API connectivity test failed:", error);
    return false;
  }
}

export async function generateAIResponse(
  userMessage: string,
  botProfile: BotProfile,
  chatHistory: ChatMessage[]
): Promise<string> {
  try {
    // Check if API key is configured and not a placeholder
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    if (!apiKey || 
        apiKey === "YOUR_OPENROUTER_API_KEY_HERE" || 
        apiKey.trim() === "") {
      throw new Error("Please configure your OpenRouter API key in the .env file. Get your API key from: https://openrouter.ai/keys");
    }

    console.log("Attempting to connect to OpenRouter API...");
    
    // Test API connectivity
    const isConnected = await testAPIConnection(apiKey);
    if (!isConnected) {
      throw new Error("Failed to connect to OpenRouter API. Please check your API key and internet connection.");
    }

    const detectedLanguage = detectLanguage(userMessage);
    const systemPrompt = buildSystemPrompt(botProfile, detectedLanguage);
    
    // Build conversation history for OpenRouter
    const messages = [
      { role: "system", content: systemPrompt },
      ...chatHistory.slice(-8).map(msg => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.message
      })),
      { role: "user", content: userMessage }
    ];
    
    const requestBody = {
      model: "deepseek/deepseek-r1-0528:free",
      messages,
      temperature: 0.9,
      top_p: 0.95,
      max_tokens: 1024
    };
    
    // Add timeout to the request
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 30000); // 30 second timeout
    });
    
    const fetchPromise = fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Emotional Support AI'
      },
      body: JSON.stringify(requestBody)
    });
    
    const response = await Promise.race([fetchPromise, timeoutPromise]);
    if (!(response instanceof Response)) {
      throw new Error('Invalid response from API');
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 
      "I'm here for you. Could you tell me more about how you're feeling? 😊";
    
    // Validate response language matches input language
    const responseLanguage = detectLanguage(aiResponse);
    if (responseLanguage !== detectedLanguage) {
      console.warn(`Language mismatch: Expected ${detectedLanguage}, got ${responseLanguage}`);
    }
    
    console.log("Successfully generated AI response");
    return aiResponse;
    
  } catch (error) {
    console.error("Error generating AI response:", error);
    
    // Enhanced error handling for different types of API errors
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    
    // Check if it's an API key issue
    if (!apiKey || 
        apiKey === "YOUR_OPENROUTER_API_KEY_HERE" || 
        apiKey.trim() === "") {
      throw new Error("⚠️ API Configuration Required: Please add your OpenRouter API key to continue chatting. Get your free API key from https://openrouter.ai/keys.");
    }
    
    // Handle specific API errors
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      // Timeout errors
      if (errorMessage.includes('timeout')) {
        throw new Error("⚠️ Request Timeout: The API request took too long to respond. Please try again with a shorter message or check your internet connection.");
      }
      
      // API key related errors
      if (errorMessage.includes('api key') || 
          errorMessage.includes('authentication') || 
          errorMessage.includes('unauthorized') || 
          errorMessage.includes('403')) {
        throw new Error("⚠️ API Key Error: Your OpenRouter API key appears to be invalid or expired. Please verify your API key at https://openrouter.ai/keys and update your .env file.");
      }
      
      // Quota/billing errors
      if (errorMessage.includes('quota') || 
          errorMessage.includes('billing') || 
          errorMessage.includes('exceeded') || 
          errorMessage.includes('429')) {
        throw new Error("⚠️ API Quota Exceeded: Your OpenRouter API usage limit has been reached. Please check your quota at https://openrouter.ai/keys or wait for it to reset.");
      }
      
      // Network/connectivity errors
      if (errorMessage.includes('failed to fetch') || 
          errorMessage.includes('network') || 
          errorMessage.includes('fetch') ||
          errorMessage.includes('cors') ||
          errorMessage.includes('connection')) {
        
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        if (isLocalhost) {
          throw new Error("⚠️ Network Connection Error: Unable to reach the OpenRouter API from your local development environment. This might be due to:\n\n1. Internet connectivity issues\n2. Firewall blocking the request\n3. CORS restrictions in development mode\n4. VPN or proxy interference\n\nTry:\n• Check your internet connection\n• Disable VPN/proxy temporarily\n• Restart your development server\n• Verify the API key is correct");
        } else {
          throw new Error("⚠️ Connection Error: Unable to connect to OpenRouter API. Please check your internet connection and try again. If the problem persists, the service might be temporarily unavailable.");
        }
      }
      
      // Permission errors
      if (errorMessage.includes('permission') || errorMessage.includes('forbidden')) {
        throw new Error("⚠️ Permission Error: Your API key doesn't have permission to access OpenRouter API. Please ensure your API key is properly configured with the necessary permissions at https://openrouter.ai/keys.");
      }
      
      // Rate limiting
      if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) {
        throw new Error("⚠️ Rate Limit: Too many requests sent to the API. Please wait a moment before trying again.");
      }
    }
    
    // Generic error fallback
    throw new Error("⚠️ Technical Difficulty: I'm having trouble connecting to the AI service right now. This could be due to:\n\n• Network connectivity issues\n• API service temporarily unavailable\n• Configuration problems\n\nPlease try again in a moment. If the problem persists, check your API key configuration and internet connection.");
  }
}
