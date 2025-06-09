import React from 'react';
import './App.css';
import Header from './Component/Header/Header';
import PromptForm from './Component/PromptForm/PromptForm';
import ImageDisplay from './Component/ImageDisplay/ImageDisplay';
import Loader from './Component/Loader/Loader';
import HistoryGallery from './Component/HistoryGallery/HistoryGallery';
import { useImageGenerator } from './Context/Context'; // Updated path

function App() {
  const {
    // prompt, // No longer directly used in App, ImageDisplay will get it from context
    // setPrompt, // No longer directly set in App, managed by PromptForm via context
    imageUrl,
    loading,
    error,
    history,
    darkMode,
    // handleGenerateImage, // No longer directly called in App, managed by PromptForm via context
    // handleGenerateAnother, // No longer directly called in App, managed by ImageDisplay via context
    // handleDownloadImage, // No longer directly called in App, managed by ImageDisplay via context
    // toggleDarkMode, // No longer directly called in App, managed by Header via context
    // handleHistoryImageClick // No longer directly called in App, managed by HistoryGallery via context
  } = useImageGenerator();

  // The useEffect for applying dark mode class to body is now in the Context provider

  return (
    // The className for dark mode is now handled by the Context Provider on the body tag directly
    // or you can keep it here if you prefer styling the .App div specifically
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <Header /> {/* Props like darkMode and toggleDarkMode are now accessed via context in Header */}
      <main>
        <PromptForm /> {/* Props are now accessed via context in PromptForm */}
        {error && <p className="error-message">{error}</p>}
        {loading && <Loader />}
        {imageUrl && !loading && (
          <ImageDisplay />  // Props are now accessed via context in ImageDisplay
        )}
        {history.length > 0 && (
          <HistoryGallery /> // Props are now accessed via context in HistoryGallery
        )}
      </main>
    </div>
  );
}

export default App;
