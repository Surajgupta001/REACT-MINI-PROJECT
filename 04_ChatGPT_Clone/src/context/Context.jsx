import React, { createContext, useState, useEffect } from 'react'; // Added useEffect

import { runChat } from '../gemini'; // Import runChat from gemini.js

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

  const toggleTheme = () => { // Re-add toggleTheme function
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => { // Re-add useEffect for theme application
    document.documentElement.setAttribute('data-theme', theme);
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
      // Pass both text and the actual File object to runChat
      const botResponseText = await runChat(messageText, currentFileObject ? currentFileObject.file : null);
      
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
      } else {
        // Handle empty or null bot response if necessary
        const botMessage = { text: botResponseText || "", sender: 'bot' }; // Ensure text is at least an empty string
        addMessageToActiveChat(botMessage);
      }

    }
    catch (error) {
      console.error("Error sending message via Context:", error);
      setTypingBotMessage(null); // Clear typing message on error
      const errorMessageText = error.message.includes("API key") ? error.message : "Sorry, I couldn't get a response. Please try again.";
      const errorMessage = { text: errorMessageText, sender: 'bot', error: true };
      addMessageToActiveChat(errorMessage);
    }
    finally {
      setIsLoading(false);
    }
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