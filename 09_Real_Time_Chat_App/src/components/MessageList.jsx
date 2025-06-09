import React from 'react';
import './MessageList.css';
import { FaExclamationCircle } from "react-icons/fa"; // Error icon

function MessageList({ messageList, userInfo, formatTime, messageEndRef }) {
  const getAvatarUrl = (senderUserID) => {
    if (senderUserID === 'suraj') {
      return 'https://picsum.photos/seed/suraj/40/40';
    } else if (senderUserID === 'aman') {
      return 'https://picsum.photos/seed/aman/40/40';
    }
    return '/default-avatar.png';
  };

  const renderMessageContent = (msg) => {
    if (msg.state === 'failed') {
      return (
        <div className="message-error">
          <FaExclamationCircle className="error-icon" />
          <p>Failed to send: {msg.message?.substring(0,50) || 'message'}</p>
          {msg.error && <small>{msg.error}</small>}
        </div>
      );
    }
    // Assuming all messages are now text (type 1) or temporary text placeholders
    if (msg.type === 1 || (msg.state === 'sending' && msg.message)) {
      return <p>{msg.message}</p>;
    }
    return <p>Unsupported message content.</p>; // Fallback for any unexpected types
  };

  return (
    <div className="message-list">
      {messageList.map((msg) => (
        <div
          key={msg.localMessageID || msg.messageID || msg.timestamp}
          className={`message-item-wrapper ${msg.senderUserID === userInfo?.userID ? 'sent-wrapper' : 'received-wrapper'}`}
        >
          <div className={`message-item ${msg.senderUserID === userInfo?.userID ? 'sent' : 'received'} ${msg.state === 'failed' ? 'failed-message-item' : ''}`}>
            {msg.senderUserID !== userInfo?.userID && msg.state !== 'failed' && (
              <span className="message-sender">
                {msg.senderUserID === 'suraj' ? 'Suraj' : msg.senderUserID === 'aman' ? 'Aman' : 'Unknown User'}
              </span>
            )}
            <div className="message-content">
              {renderMessageContent(msg)}
            </div>
            <span className="message-time">{formatTime(msg.timestamp)}</span>
          </div>
          <img src={getAvatarUrl(msg.senderUserID)} alt="avatar" className="avatar" />
        </div>
      ))}
      <div ref={messageEndRef} />
    </div>
  );
}

export default MessageList;