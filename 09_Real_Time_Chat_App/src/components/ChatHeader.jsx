import React from 'react';
import Login from './Login';
import './ChatHeader.css';

function ChatHeader({
  userInfo,
  selectedUser,
  handleUserChange,
  handleLogin,
  handleLogout,
  isLoggedIn,
  zimInstance
}) {
  return (
    <div className="chat-header">
      <h2>ZEGOCLOUD Chat</h2>
      <div className="header-actions">
        {isLoggedIn && userInfo ? (
          <div className="user-info">
            Logged in as: <strong>{userInfo.userName}</strong>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        ) : (
          <Login
            selectedUser={selectedUser}
            handleUserChange={handleUserChange}
            handleLogin={handleLogin}
            isLoggedIn={isLoggedIn}
            zimInstance={zimInstance}
          />
        )}
      </div>
    </div>
  );
}

export default ChatHeader;