import React, { useContext } from 'react';
import { AppContext } from '../../context/Context';
import { FiSun, FiMoon, FiTrash2 } from 'react-icons/fi'; // Import icons for theme toggle and delete
import './Sidebar.css';

const Sidebar = () => {
  const {
    setIsSidebarOpen,
    chats,
    activeChatId,
    newChat,
    selectChat,
    deleteChat, // Added deleteChat from context
    renameChat
    // theme,      // Removed as toggle button is moved
    // toggleTheme // Removed as toggle button is moved
  } = useContext(AppContext);

  const handleNewChat = () => {
    newChat();
    // Optionally close sidebar on mobile after creating new chat
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Smart AI Bot Chat</h2>
        <button
          className="sidebar-close-button"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          ✕
        </button>
      </div>
      <button className="new-chat-button" onClick={handleNewChat}>
        + New Chat
      </button>
      <div className="sidebar-history">
        <h3 className="history-title">Chat History</h3>
        {chats.length === 0 && <p className="empty-history">No chats yet.</p>}
        <ul className="chat-list">
          {chats.map((chat) => (
            <li
              key={chat.id}
              className={`chat-list-item ${chat.id === activeChatId ? 'active' : ''}`}
              onClick={() => selectChat(chat.id)}
              title={chat.name}
            >
              <span className="chat-name">{chat.name}</span>
              <div className="chat-actions">
                <button
                  className="rename-chat-button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent chat selection when clicking rename
                    const newName = window.prompt("Enter new chat name:", chat.name);
                    if (newName && newName.trim() !== "") {
                      renameChat(chat.id, newName.trim());
                    }
                  }}
                  aria-label={`Rename chat ${chat.name}`}
                  title="Rename chat"
                >
                  ✏️
                </button>
                <button
                  className="delete-chat-button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent chat selection
                    if (window.confirm(`Are you sure you want to delete "${chat.name}"?`)) {
                      deleteChat(chat.id);
                    }
                  }}
                  aria-label={`Delete chat ${chat.name}`}
                  title="Delete chat"
                >
                  <FiTrash2 />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="sidebar-footer">
        {/* User Profile Section and Theme Toggle Button removed as they will be moved to ChatHeader */}
      </div>
    </div>
  );
};

export default Sidebar;