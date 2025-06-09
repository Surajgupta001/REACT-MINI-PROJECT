import React from 'react';
import './ImageDisplay.css';
import { useImageGenerator } from '../../Context/Context'; // Updated path

const ImageDisplay = () => {
  const { imageUrl, prompt, handleGenerateAnother, handleDownloadImage } = useImageGenerator();

  if (!imageUrl) {
    return null;
  }

  return (
    <div className="image-display-section">
      <h2>Generated Image</h2>
      <div className="image-card">
        <img src={imageUrl} alt={prompt || 'Generated AI Image'} />
        {prompt && <p className="image-prompt-caption">Prompt: "{prompt}"</p>}
      </div>
      <div className="image-actions">
        <button onClick={handleGenerateAnother} className="action-button generate-another-button">
          Generate Another
        </button>
        <button onClick={handleDownloadImage} className="action-button download-button">
          Download Image
        </button>
      </div>
    </div>
  );
};

export default ImageDisplay;