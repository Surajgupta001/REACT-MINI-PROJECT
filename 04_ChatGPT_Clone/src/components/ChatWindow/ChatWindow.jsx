import React, { useContext, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AppContext } from '../../context/Context';
import { FiPaperclip, FiSend, FiSun, FiMoon, FiSettings, FiMic, FiSquare } from 'react-icons/fi';
import './ChatWindow.css';

const ChatWindow = () => {
  const {
    getActiveChatMessages,
    input,
    setInput,
    selectedFile,
    setSelectedFile,
    isLoading,
    sendMessage,
    stopGeneration,
    isSidebarOpen,
    setIsSidebarOpen,
    activeChatId,
    theme,
    toggleTheme,
    typingBotMessage
  } = useContext(AppContext);

  const [isListening, setIsListening] = React.useState(false);
  const [speechRecognitionError, setSpeechRecognitionError] = React.useState(null);
  const recognitionRef = React.useRef(null);

  // User details hardcoded for now
  const userName = "SURAJ GUPTA";
  const userAvatarInitials = "SG";

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const currentMessages = getActiveChatMessages();

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSpeechRecognitionError("Speech recognition not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true; // Changed to true
    recognitionRef.current.interimResults = false; // We only want final results
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event) => {
      // Iterate through results to find the final one
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript.trim()) {
        setInput(prevInput => prevInput ? prevInput + ' ' + finalTranscript.trim() : finalTranscript.trim());
        recognitionRef.current?.stop(); // Stop recognition after a final result
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === 'no-speech') {
        setSpeechRecognitionError("No speech detected. Please try again.");
      } else if (event.error === 'audio-capture') {
        setSpeechRecognitionError("Audio capture failed. Ensure microphone is enabled.");
      } else if (event.error === 'not-allowed') {
        setSpeechRecognitionError("Microphone access denied. Please allow microphone access in browser settings.");
      } else {
        setSpeechRecognitionError(`Error: ${event.error}`);
      }
      // onend will handle setIsListening(false)
    };

    recognitionRef.current.onend = () => {
      setIsListening(false); // Central place to set listening to false
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort(); // Use abort for cleanup
      }
    };
  }, [setInput]);


  const handleMicClick = () => {
    if (isListening) {
      recognitionRef.current?.stop(); // User explicitly stops
    } else {
      if (recognitionRef.current) {
        try {
          setInput(''); // Clear previous input before starting new dictation
          setSpeechRecognitionError(null); // Clear previous errors
          recognitionRef.current.start();
          setIsListening(true);
        } catch (error) {
          console.error("Error starting speech recognition:", error);
          setSpeechRecognitionError("Could not start voice recording. Please check microphone permissions.");
          setIsListening(false); // Ensure state is reset if start fails
        }
      } else {
        setSpeechRecognitionError("Speech recognition is not initialized.");
      }
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Auto-scroll whenever messages change, chat changes, typing updates, or loading toggles
    scrollToBottom();
  }, [currentMessages, activeChatId, typingBotMessage, isLoading]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile({ file: file, name: file.name, type: file.type });
      e.target.value = null;
    }
  };

  // ReactMarkdown will render bot messages with Markdown including lists and tables
  const renderBotMessageContent = (text) => (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {typeof text === 'string' ? text : String(text ?? '')}
    </ReactMarkdown>
  );

  const handleSend = () => {
    if (input.trim() || selectedFile) {
      sendMessage(input, selectedFile);
    }
  };

  const handleSuggestionClick = (suggestionText) => {
    setInput(suggestionText);
    // Optionally, you could immediately send the message too:
    // sendMessage(suggestionText, null);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`chat-window ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div className="chat-header">
        <div className="chat-header-left">
          <button className="menu-toggle-button" onClick={toggleSidebar} aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}>
            {isSidebarOpen ? '✕' : '☰'}
          </button>
          <h3>Smart AI</h3> {/* Reverted to Smart AI or keep Smart AI Bot as preferred */}
        </div>
        <div className="chat-header-right">
          <button onClick={toggleTheme} className="theme-toggle-button-header" title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === 'dark' ? <FiSun size="1.1em"/> : <FiMoon size="1.1em"/>}
          </button>
          <div className="user-profile-header">
            <span className="user-avatar-header">{userAvatarInitials}</span>
            <span className="user-name-header">{userName}</span>
            {/* Settings icon can be re-added here if desired in future
            <button
              className="settings-button-header"
              aria-label="Settings"
              title="Settings"
              onClick={() => console.log("Header Settings clicked - UI only")}
            >
              <FiSettings size="1.1em"/>
            </button>
            */}
          </div>
        </div>
      </div>

      {currentMessages.length === 0 && !isLoading ? (
        <div className="welcome-container">
          <div className="welcome-logo">🤖</div> {/* Simple bot logo */}
          <h1 className="welcome-title">How can I help you today?</h1>
          <div className="suggestion-cards-container">
            <div className="suggestion-card" onClick={() => handleSuggestionClick("Explain quantum computing in simple terms")}>
              <h4>Explain quantum computing</h4>
              <p>in simple terms</p>
            </div>
            <div className="suggestion-card" onClick={() => handleSuggestionClick("Got any creative ideas for a 10 year old’s birthday?")}>
              <h4>Creative birthday ideas</h4>
              <p>for a 10 year old</p>
            </div>
            <div className="suggestion-card" onClick={() => handleSuggestionClick("Write a thank you note for a gift")}>
              <h4>Write a thank you note</h4>
              <p>for a gift received</p>
            </div>
            <div className="suggestion-card" onClick={() => handleSuggestionClick("What are some healthy dinner recipes?")}>
              <h4>Healthy dinner recipes</h4>
              <p>quick and easy</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="chat-messages">
          {currentMessages.map((msg, index) => (
            <div key={`${activeChatId}-${index}-${msg.sender}`} className={`message ${msg.sender} ${msg.error ? 'error' : ''}`}>
              {msg.fileInfo && (
                <div className="message-file-info">
                  {msg.fileInfo.previewUrl ? (
                    <img src={msg.fileInfo.previewUrl} alt={msg.fileInfo.name} className="message-image-preview" />
                  ) : (
                    <div className="file-icon-container">
                      <span className="file-icon">📄</span>
                      <span className="file-name-display">{msg.fileInfo.name}</span>
                    </div>
                  )}
                </div>
              )}
              {msg.text && (msg.sender === 'bot' ? renderBotMessageContent(msg.text) : <p>{msg.text}</p>)}
            </div>
          ))}
          {isLoading && (
            <div className="message bot typing-indicator">
              <p>Smart Ai is thinking...</p>
            </div>
          )}
          {typingBotMessage && (
            <div key={typingBotMessage.id} className={`message ${typingBotMessage.sender}`}>
              {renderBotMessageContent(typingBotMessage.text)}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className="chat-input-area">
        <button
          onClick={triggerFileInput}
          className="upload-button"
          aria-label="Upload file"
          title="Upload file"
          disabled={isLoading || isListening}
        >
          <FiPaperclip /> {/* Use Paperclip icon */}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,application/pdf,.txt,.md,.py,.js,.html,.css,.json,.csv"
          style={{ display: 'none' }}
          disabled={isLoading || isListening}
        />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !isListening && (input.trim() || selectedFile)) {
              handleSend();
            }
          }}
          placeholder={
            isListening ? "Listening..." :
            selectedFile ? `File: ${selectedFile.name} (add a message...)` :
            "Send a message..."
          }
          disabled={isLoading || isListening}
        />
        {isLoading || typingBotMessage ? (
          <button
            className="send-mic-button has-content"
            onClick={stopGeneration}
            aria-label="Stop response"
            title="Stop response"
          >
            <FiSquare />
          </button>
        ) : isListening ? (
           <button
             className="send-mic-button listening"
             onClick={handleMicClick}
             aria-label="Stop recording"
             title="Stop recording"
           >
             <FiMic className="mic-icon-recording" /> {/* Add class for animation */}
           </button>
        ) : (input.trim() || selectedFile) ? (
          <button
            className="send-mic-button has-content"
            onClick={handleSend}
            aria-label="Send message"
            title="Send message"
            disabled={isLoading || isListening}
          >
            <FiSend />
          </button>
        ) : (
          <button
            className="send-mic-button"
            onClick={handleMicClick}
            aria-label="Start recording"
            title="Start recording"
            disabled={isLoading || !!speechRecognitionError} // Disable if error or loading
          >
            <FiMic />
          </button>
        )}
      </div>
      {speechRecognitionError && <p className="speech-error-message">{speechRecognitionError}</p>}
      {selectedFile && !isLoading && !isListening && (
        <div className="file-preview-area">
          {selectedFile.type.startsWith('image/') ? (
            <img src={URL.createObjectURL(selectedFile.file)} alt="Preview" />
          ) : (
            <div className="file-icon-container-preview">
              <span className="file-icon-preview">📄</span>
              <span className="file-name-preview">{selectedFile.name}</span>
            </div>
          )}
          <button onClick={() => setSelectedFile(null)}>✕</button>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;