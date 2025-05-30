import React, { useContext } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import ChatWindow from './components/ChatWindow/ChatWindow';
import { AppContext } from './context/Context'; // Import AppContext
import './App.css';

function App() {
  const { isSidebarOpen } = useContext(AppContext); // Get sidebar state

  return (
    <div className="app-container">
      {isSidebarOpen && <Sidebar />} {/* Conditionally render Sidebar */}
      <ChatWindow />
    </div>
  );
}

export default App;
