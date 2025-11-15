import React, { createContext, useState, useEffect, useRef } from 'react'; // Added useEffect and useRef

import { runChat, runImageGeneration } from '../gemini'; // Import runChat and image generation

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [chats, setChats] = useState([{ id: Date.now(), name: "New Chat 1", messages: [] }]);
  const [activeChatId, setActiveChatId] = useState(chats[0].id);
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // const [isListening, setIsListening] = useState(false); // Removed
  // const [speechRecognitionError, setSpeechRecognitionError] = useState(null); // Removed
  const [theme, setTheme] = useState('dark'); // Re-add theme state
  const [typingBotMessage, setTypingBotMessage] = useState(null); // For typing effect
  const abortRef = useRef(null); // AbortController for in-flight request
  const typingIntervalRef = useRef(null); // Interval handle for typing effect

  // Local storage keys
  const LS_CHATS_KEY = 'chatgpt_clone_chats';
  const LS_ACTIVE_KEY = 'chatgpt_clone_activeChatId';
  const LS_THEME_KEY = 'chatgpt_clone_theme';

  // On mount: hydrate from localStorage if present
  useEffect(() => {
    try {
      const storedChats = JSON.parse(localStorage.getItem(LS_CHATS_KEY) || 'null');
      const storedActive = JSON.parse(localStorage.getItem(LS_ACTIVE_KEY) || 'null');
      const storedTheme = localStorage.getItem(LS_THEME_KEY);

      if (Array.isArray(storedChats) && storedChats.length > 0) {
        setChats(storedChats);
        if (storedActive) setActiveChatId(storedActive);
      }
      if (storedTheme === 'light' || storedTheme === 'dark') {
        setTheme(storedTheme);
      }
    } catch (e) {
      console.warn('Failed to load chats from storage:', e);
    }
  }, []);

  // Helper to sanitize chats for storage (avoid storing blob preview URLs)
  const sanitizeChatsForStorage = (chatsToSave) =>
    chatsToSave.map(chat => ({
      ...chat,
      messages: (chat.messages || []).map(m => ({
        ...m,
        fileInfo: m.fileInfo ? { name: m.fileInfo.name, type: m.fileInfo.type, previewUrl: null } : null,
      }))
    }));

  // Persist chats and active chat id on change
  useEffect(() => {
    try {
      const sanitized = sanitizeChatsForStorage(chats);
      localStorage.setItem(LS_CHATS_KEY, JSON.stringify(sanitized));
      localStorage.setItem(LS_ACTIVE_KEY, JSON.stringify(activeChatId));
    } catch (e) {
      console.warn('Failed to save chats to storage:', e);
    }
  }, [chats, activeChatId]);

  const toggleTheme = () => { // Re-add toggleTheme function
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => { // Re-add useEffect for theme application
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  // Persist theme
  useEffect(() => {
    try {
      localStorage.setItem(LS_THEME_KEY, theme);
    } catch {
      // ignore persistence errors
    }
  }, [theme]);

  const getActiveChatMessages = () => {
    const activeChat = chats.find(chat => chat.id === activeChatId);
    return activeChat ? activeChat.messages : [];
  };

  const addMessageToActiveChat = (message) => {
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === activeChatId ? { ...chat, messages: [...chat.messages, message] } : chat
      )
    );
  }

  const newChat = () => {
    const newChatId = Date.now();
    const newChatName = `New Chat ${chats.length + 1}`;
    setChats(prevChats => [...prevChats, { id: newChatId, name: newChatName, messages: [] }]);
    setActiveChatId(newChatId);
    setInput(''); // Clear input for the new chat
  };

  const selectChat = (chatId) => {
    setActiveChatId(chatId);
    setInput(''); // Clear input when switching chats
  };

  const renameChat = (chatId, newName) => {
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId ? { ...chat, name: newName } : chat
      )
    );
  };

  const deleteChat = (chatIdToDelete) => {
    setChats(prevChats => {
      const updatedChats = prevChats.filter(chat => chat.id !== chatIdToDelete);
      if (activeChatId === chatIdToDelete) {
        if (updatedChats.length > 0) {
          setActiveChatId(updatedChats[0].id);
        } else {
          // If no chats are left, create a new one
          const newChatId = Date.now();
          const newChatName = "New Chat 1";
          setActiveChatId(newChatId);
          return [{ id: newChatId, name: newChatName, messages: [] }];
        }
      }
      return updatedChats;
    });
  };

  // Updated sendMessage to accept an optional file object
  const sendMessage = async (messageText, currentFileObject = null) => {
    // Ensure there's either text or a file to send
    if (!messageText.trim() && !currentFileObject) {
      console.log("Attempted to send empty message (no text or file).");
      return;
    }

    // Build text-only history prior to adding the new user message
    const prior = getActiveChatMessages();
    const mapRole = (sender) => (sender === 'bot' ? 'assistant' : 'user');
    // Keep a compact window of recent exchanges
    const history = (prior || [])
      .map(m => ({ role: mapRole(m.sender), content: typeof m.text === 'string' ? m.text : '' }))
      .filter(h => h.content && h.content.trim().length > 0)
      .slice(-12);

    const userMessagePayload = {
      text: messageText,
      sender: 'user',
      fileInfo: currentFileObject ? {
        name: currentFileObject.name,
        type: currentFileObject.type,
        // Create a URL for preview only if it's an image
        previewUrl: currentFileObject.type.startsWith('image/') ? URL.createObjectURL(currentFileObject.file) : null
      } : null,
    };
    addMessageToActiveChat(userMessagePayload);

    setInput('');
    setSelectedFile(null); // Clear selected file after sending
    setIsLoading(true);

    try {
      // Set up abort controller so we can stop the request
      const controller = new AbortController();
      abortRef.current = controller;

      // Pass both text and the actual File object to runChat
      const botResponseText = await runChat(
        messageText,
        currentFileObject ? currentFileObject.file : null,
        { signal: controller.signal, history }
      );
      
      if (botResponseText && botResponseText.length > 0) {
        // Start typing effect
        // Set the first character immediately
        setTypingBotMessage({ text: botResponseText.charAt(0), sender: 'bot', id: `bot-${Date.now()}` });
        
        let i = 1; // Start from the second character
        const typingInterval = setInterval(() => {
          if (i < botResponseText.length) {
            setTypingBotMessage(prev => ({ ...prev, text: prev.text + botResponseText.charAt(i) }));
            i++;
          } else {
            clearInterval(typingInterval);
            typingIntervalRef.current = null;
            // The final message is already built up by the typing effect.
            // We just need to ensure it's formally added to chats if a distinction is needed,
            // or simply clear the typingBotMessage.
            // For simplicity, let's assume the displayed typingBotMessage is sufficient
            // and the final addMessageToActiveChat will solidify it.
            const finalBotMessage = { text: botResponseText, sender: 'bot', id: `bot-${Date.now()}-final` };
            addMessageToActiveChat(finalBotMessage); // Add the complete message to history
            setTypingBotMessage(null); // Clear the actively typing message
          }
        }, 20); // Typing speed: 20ms per character (faster)
        typingIntervalRef.current = typingInterval;
      } else {
        // Handle empty or null bot response if necessary
        const botMessage = { text: botResponseText || "", sender: 'bot' }; // Ensure text is at least an empty string
        addMessageToActiveChat(botMessage);
      }

    }
    catch (error) {
      console.error("Error sending message via Context:", error);
      setTypingBotMessage(null); // Clear typing message on error
      if (error.name === 'AbortError') {
        // User stopped the generation; don't add an error message
      } else {
        const errorMessageText = error.message.includes("API key") ? error.message : "Sorry, I couldn't get a response. Please try again.";
        const errorMessage = { text: errorMessageText, sender: 'bot', error: true };
        addMessageToActiveChat(errorMessage);
      }
    }
    finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  // Generate image from prompt and add to chat
  const generateImage = async (messageText) => {
    const prompt = (messageText || '').trim();
    if (!prompt) return;

    // Add the user's prompt message to the chat
    addMessageToActiveChat({ text: prompt, sender: 'user' });
    setInput('');
    setIsLoading(true);

    try {
      const controller = new AbortController();
      abortRef.current = controller;
      const objectUrl = await runImageGeneration(prompt, { signal: controller.signal });
      if (objectUrl) {
        const botImageMessage = {
          text: 'Here is your generated image.',
          sender: 'bot',
          fileInfo: { name: 'generated.png', type: 'image/png', previewUrl: objectUrl },
        };
        addMessageToActiveChat(botImageMessage);
      } else {
        addMessageToActiveChat({ text: "Sorry, I couldn't generate the image.", sender: 'bot', error: true });
      }
    } catch (error) {
      console.error('Error generating image:', error);
      const msg = error?.message?.includes('OPENAI_API_KEY')
        ? 'Image generation not configured. Set OPENAI_API_KEY on the server.'
        : "Sorry, I couldn't generate the image.";
      addMessageToActiveChat({ text: msg, sender: 'bot', error: true });
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  const stopGeneration = () => {
    // Abort in-flight fetch
    if (abortRef.current) {
      try {
        abortRef.current.abort();
      } catch {
        // ignore
      }
      abortRef.current = null;
    }
    // Stop typing effect
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    // If there's a partially typed message, commit it to history so it doesn't disappear
    if (typingBotMessage && typeof typingBotMessage.text === 'string' && typingBotMessage.text.trim().length > 0) {
      const finalBotMessage = { text: typingBotMessage.text, sender: 'bot', id: `bot-${Date.now()}-stopped` };
      addMessageToActiveChat(finalBotMessage);
    }
    setTypingBotMessage(null);
    setIsLoading(false);
  };

  return (
    <AppContext.Provider value={{
      chats,
      activeChatId,
      getActiveChatMessages,
      input,
      setInput,
      selectedFile,
      setSelectedFile,
      isLoading,
      sendMessage,
      isSidebarOpen,
      setIsSidebarOpen,
      newChat,
      selectChat,
      renameChat,
      deleteChat, // Add deleteChat to context
  stopGeneration,        // Provide stop control
        generateImage,        // Provide image generation
      // isListening, // Removed
      // setIsListening, // Removed
      // speechRecognitionError, // Removed
      // setSpeechRecognitionError, // Removed
      theme,                // Provide theme
      toggleTheme,           // Provide toggleTheme
      typingBotMessage      // Provide typingBotMessage
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;