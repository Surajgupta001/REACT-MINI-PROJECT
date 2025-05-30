import React, { useContext, useEffect, useRef } from 'react';
import { AppContext } from '../../context/Context';
import { FiPaperclip, FiSend, FiMic } from 'react-icons/fi'; // Import icons
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
    isSidebarOpen,
    setIsSidebarOpen,
    activeChatId,
    isListening,          // Added from context
    setIsListening,       // Added from context
    speechRecognitionError, // Added from context
    setSpeechRecognitionError // Added from context
  } = useContext(AppContext);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const currentMessages = getActiveChatMessages();
  const recognitionRef = useRef(null); // For SpeechRecognition instance

  // --- Speech Recognition Logic ---
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSpeechRecognitionError("Speech recognition is not supported by your browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false; // Stop after first pause
    recognitionRef.current.interimResults = true; // Get interim results
    recognitionRef.current.lang = 'en-US'; // Set language

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setSpeechRecognitionError(null);
    };

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
        else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      // Update input with interim, then final. Prioritize final.
      setInput(prevInput => (finalTranscript || interimTranscript) ? (prevInput ? prevInput + " " : "") + (finalTranscript || interimTranscript) : prevInput);
      if (finalTranscript) {
        // If you want to auto-send after final transcript:
        // handleSend(); // Be cautious with auto-send, might be unexpected for users
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === 'no-speech') {
        setSpeechRecognitionError("No speech detected. Please try again.");
      }
      else if (event.error === 'audio-capture') {
        setSpeechRecognitionError("Microphone problem. Please ensure it's enabled and working.");
      }
      else if (event.error === 'not-allowed') {
        setSpeechRecognitionError("Permission to use microphone was denied. Please enable it in your browser settings.");
      }
      else {
        setSpeechRecognitionError(`Error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    // Cleanup function to stop recognition if component unmounts while listening
    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount to setup recognition

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setSpeechRecognitionError("Speech recognition not initialized.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        // This can happen if start() is called too soon after a stop, or other issues.
        console.error("Error starting speech recognition:", e);
        setSpeechRecognitionError("Could not start voice recognition. Please try again.");
        setIsListening(false);
      }
    }
  };
  // --- End Speech Recognition Logic ---


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, activeChatId]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile({ file: file, name: file.name, type: file.type });
      e.target.value = null;
    }
  };

  // Helper function to render bot messages with list formatting
  const renderBotMessageContent = (text) => {
    if (!text || typeof text !== 'string') {
      return <p>{text}</p>; // Fallback for non-string or empty text
    }

    const lines = text.split('\n');
    const elements = [];
    let currentListType = null; // 'ul' or 'ol'
    let listItems = [];

    const flushList = () => {
      if (listItems.length > 0) {
        if (currentListType === 'ul') {
          elements.push(<ul key={`ul-${elements.length}`}>{listItems}</ul>);
        } else if (currentListType === 'ol') {
          elements.push(<ol key={`ol-${elements.length}`}>{listItems}</ol>);
        }
        listItems = [];
      }
      currentListType = null;
    };

    lines.forEach((line, index) => {
      const key = `line-${index}`;
      if (line.match(/^(\*|-)\s+/)) { // Unordered list item
        if (currentListType !== 'ul') {
          flushList();
          currentListType = 'ul';
        }
        listItems.push(<li key={key}>{line.substring(2)}</li>);
      } else if (line.match(/^\d+\.\s+/)) { // Ordered list item
        if (currentListType !== 'ol') {
          flushList();
          currentListType = 'ol';
        }
        listItems.push(<li key={key}>{line.substring(line.indexOf('.') + 2)}</li>);
      } else { // Paragraph
        flushList();
        if (line.trim() !== '') { // Avoid empty paragraphs
          elements.push(<p key={key}>{line}</p>);
        }
      }
    });

    flushList(); // Add any remaining list items
    return elements;
  };

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
        <button className="menu-toggle-button" onClick={toggleSidebar} aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}>
          {isSidebarOpen ? '✕' : '☰'}
        </button>
        <h3>Smart AI Bot</h3>
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
              <p>Lyzo is thinking...</p>
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
          disabled={isLoading || isListening} // Disable if listening
        />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !isLoading && !isListening && (input.trim() || selectedFile)) {
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
        <button
          className={`send-mic-button ${isListening ? 'listening' : ''} ${(input.trim() || selectedFile) ? 'has-content' : ''}`}
          onClick={() => {
            if (input.trim() || selectedFile) {
              handleSend();
            } else {
              toggleListening();
            }
          }}
          aria-label={
            (input.trim() || selectedFile) ? "Send message" :
            isListening ? "Stop listening" : "Start voice dictation"
          }
          title={
            (input.trim() || selectedFile) ? "Send message" :
            isListening ? "Stop listening" : "Start voice dictation"
          }
          disabled={isLoading || (isListening && !!speechRecognitionError && !speechRecognitionError.includes("Permission")) || (!input.trim() && !selectedFile && !!speechRecognitionError && !speechRecognitionError.includes("Permission"))}
        >
          {(input.trim() || selectedFile) ? <FiSend /> : <FiMic />} {/* Correctly uses imported icons */}
        </button>
      </div>
      {speechRecognitionError && <p className="speech-error-message">{speechRecognitionError}</p>}
      {selectedFile && !isLoading && (
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