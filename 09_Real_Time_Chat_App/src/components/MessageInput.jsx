import React from 'react';
import './MessageInput.css';
import { IoSend } from "react-icons/io5"; // Reverted to IoSend icon

function MessageInput({ messageText, setMessageText, handleSendMessage, isLoggedIn }) {
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="message-input-area">
      <input
        type="text"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        placeholder="Type your message..."
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent newline on enter
            handleSendMessage();
          }
        }}
      />
      <button onClick={handleSendMessage} className="send-button" title="Send message">
        <IoSend />
      </button>
    </div>
  );
}

export default MessageInput;