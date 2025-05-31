import React, { useContext } from 'react';
import { AppContext } from '../../context/Context';
import { FiSun, FiMoon } from 'react-icons/fi'; // Import icons for theme toggle
import './Sidebar.css';

const Sidebar = () => {
  const {
    setIsSidebarOpen,
    chats,
    activeChatId,
    newChat,
    selectChat
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
              <button
                className="rename-chat-button"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent chat selection when clicking rename
                  // Placeholder for actual rename logic initiation
                  console.log(`Rename chat: ${chat.name} (ID: ${chat.id}) - UI only`);
                  // const newName = prompt("Enter new chat name:", chat.name);
                  // if (newName && newName.trim() !== "") {
                  //   renameChat(chat.id, newName.trim());
                  // }
                }}
                aria-label={`Rename chat ${chat.name}`}
                title="Rename chat"
              >
                ✏️
              </button>
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