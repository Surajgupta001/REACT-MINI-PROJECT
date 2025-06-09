import React from 'react';
import './Header.css';
import { useImageGenerator } from '../../Context/Context'; // Updated path

const Header = () => {
  const { darkMode, toggleDarkMode } = useImageGenerator();
  return (
    <header className="app-header">
      <h1>AI Image Generator</h1>
      <div className="theme-switcher">
        <button onClick={toggleDarkMode} className="theme-toggle-button">
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
    </header>
  );
};

export default Header;