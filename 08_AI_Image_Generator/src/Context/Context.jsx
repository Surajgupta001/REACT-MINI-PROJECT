import React, { createContext, useState, useEffect, useContext } from 'react';
import { generateImageFromApi } from '../gemini';

const ImageGeneratorContext = createContext();

export const useImageGenerator = () => {
  return useContext(ImageGeneratorContext);
};

export const ImageGeneratorProvider = ({ children }) => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    const storedDarkMode = localStorage.getItem('aiImageGeneratorDarkMode');
    return storedDarkMode ? JSON.parse(storedDarkMode) : false;
  });

  // Load history from local storage on mount
  useEffect(() => {
    const storedHistory = localStorage.getItem('aiImageGeneratorHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  // Save history to local storage when it changes
  useEffect(() => {
    localStorage.setItem('aiImageGeneratorHistory', JSON.stringify(history));
  }, [history]);

  // Save and apply dark mode preference
  useEffect(() => {
    localStorage.setItem('aiImageGeneratorDarkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const handleGenerateImage = async (currentPrompt) => {
    if (!currentPrompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    setError('');
    setLoading(true);
    setImageUrl(''); // Clear previous image

    try {
      const imageUrlFromApi = await generateImageFromApi(currentPrompt);
      setImageUrl(imageUrlFromApi);
      setHistory(prevHistory => [{ prompt: currentPrompt, url: imageUrlFromApi, timestamp: new Date() }, ...prevHistory].slice(0, 10)); // Keep last 10
    } catch (err) {
      console.error("Error generating image in Context:", err);
      setError(`Failed to generate image: ${err.message}. Please check your API key, network, and ensure the prompt is valid.`);
      setImageUrl('');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAnother = () => {
    setPrompt('');
    setImageUrl('');
    setError('');
  };

  const handleDownloadImage = () => {
    if (!imageUrl) return;
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `ai-generated-${prompt.replace(/\s+/g, '_') || 'image'}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
      })
      .catch(() => { // Removed unused _e
        // Fallback for direct link
        const a = document.createElement('a');
        a.href = imageUrl;
        a.download = `ai-generated-${prompt.replace(/\s+/g, '_') || 'image'}.png`;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
  };

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const handleHistoryImageClick = (item) => {
    setPrompt(item.prompt);
    setImageUrl(item.url);
    setError('');
  };

  const value = {
    prompt,
    setPrompt,
    imageUrl,
    loading,
    error,
    history,
    darkMode,
    handleGenerateImage,
    handleGenerateAnother,
    handleDownloadImage,
    toggleDarkMode,
    handleHistoryImageClick,
  };

  return (
    <ImageGeneratorContext.Provider value={value}>
      {children}
    </ImageGeneratorContext.Provider>
  );
};