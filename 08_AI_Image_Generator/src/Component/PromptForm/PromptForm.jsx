import React from 'react';
import './PromptForm.css';
import { useImageGenerator } from '../../Context/Context'; // Updated path

const PromptForm = () => {
  const { prompt, setPrompt, handleGenerateImage, loading } = useImageGenerator();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleGenerateImage(prompt);
  };

  const promptSuggestions = [
    "A futuristic city skyline at sunset, neon lights reflecting on wet streets.",
    "A serene forest with a hidden waterfall, sunlight filtering through the canopy.",
    "An astronaut playing guitar on the moon, Earth in the background.",
    "A steampunk cat wearing goggles and a top hat.",
    "A surreal dreamscape with floating islands and giant flowers."
  ];

  const handleSuggestionClick = (suggestion) => {
    setPrompt(suggestion);
  };

  return (
    <div className="prompt-section">
      <form onSubmit={handleSubmit} className="prompt-form">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your creative prompt here... e.g., 'A cat riding a unicorn in space'"
          rows="3"
          disabled={loading}
        />
        <button type="submit" disabled={loading || !prompt.trim()}>
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
      </form>
      <div className="prompt-suggestions">
        <h3>Need inspiration? Try one of these:</h3>
        <ul>
          {promptSuggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PromptForm;