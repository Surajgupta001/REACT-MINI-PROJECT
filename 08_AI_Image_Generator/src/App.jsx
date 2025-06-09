import React from 'react';
import './App.css';
import Header from './Component/Header/Header';
import PromptForm from './Component/PromptForm/PromptForm';
import ImageDisplay from './Component/ImageDisplay/ImageDisplay';
import Loader from './Component/Loader/Loader';
import HistoryGallery from './Component/HistoryGallery/HistoryGallery';
import { useImageGenerator } from './Context/Context';

function App() {
  const {
    imageUrl,
    loading,
    error,
    history,
    darkMode,
  } = useImageGenerator();


  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <Header />
      <main>
        <PromptForm />
        {error && <p className="error-message">{error}</p>}
        {loading && <Loader />}
        {imageUrl && !loading && (
          <ImageDisplay />
        )}
        {history.length > 0 && (
          <HistoryGallery />
        )}
      </main>
    </div>
  );
}

export default App;
