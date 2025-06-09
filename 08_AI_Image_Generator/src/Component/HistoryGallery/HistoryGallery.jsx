import React from 'react';
import './HistoryGallery.css';
import { useImageGenerator } from '../../Context/Context'; // Updated path

const HistoryGallery = () => {
  const { history, handleHistoryImageClick } = useImageGenerator();

  if (!history || history.length === 0) {
    return null;
  }

  return (
    <div className="history-gallery-section">
      <h2>Recently Generated Images</h2>
      <div className="history-grid">
        {history.map((item, index) => (
          <div
            key={item.timestamp ? new Date(item.timestamp).toISOString() + '-' + index : index} // Ensure unique key
            className="history-item"
            onClick={() => handleHistoryImageClick(item)}
          >
            <img src={item.url} alt={item.prompt || 'Previously generated image'} />
            <div className="history-item-overlay">
              <p className="history-item-prompt">{item.prompt.length > 50 ? item.prompt.substring(0, 50) + "..." : item.prompt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryGallery;