import React, { useState, useEffect, useRef } from "react";

// Utility function to format bytes
const formatBytes = (bytes, decimals = 2) => {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const ImageCard = ({ image, onSelect, onDelete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const placeholderRef = useRef(null);

  useEffect(() => {
    const node = placeholderRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 } // Load when 10% visible
    );

    if (node) {
      observer.observe(node);
    }

    return () => {
      if (node) {
        observer.unobserve(node);
      }
    };
  }, []);

  const handleImageLoad = () => {
    setHasLoaded(true);
  };

  return (
    <div
      ref={placeholderRef}
      className="group relative aspect-[4/3] bg-gray-800 rounded-xl overflow-hidden shadow-lg
                 transition-all duration-300 ease-in-out hover:shadow-indigo-500/40 hover:-translate-y-1
                 border border-gray-700 hover:border-indigo-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Placeholder while loading */}
      {!hasLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-700 animate-pulse">
          <svg className="w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      {isVisible && (
        <img
          src={image.id}
          alt={image.name}
          onClick={onSelect}
          onLoad={handleImageLoad}
          className={`w-full h-full object-cover cursor-pointer transition-all duration-500 group-hover:scale-105 ${hasLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
      {/* Overlay for image details on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent
                    transition-opacity duration-300 pointer-events-none
                    flex flex-col justify-end
                    ${isHovered && hasLoaded ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="p-4 text-gray-100">
          <h3 className="font-bold text-lg truncate" title={image.name}>{image.name}</h3>
          <div className="text-xs mt-1 opacity-80 space-y-0.5">
            {image.type && <p>Type: {image.type.split('/')[1]?.toUpperCase()}</p>}
            {image.size > 0 && <p>Size: {formatBytes(image.size)}</p>}
            {image.width && image.height && <p>Dimensions: {image.width} x {image.height}</p>}
          </div>
        </div>
      </div>
      
      {/* Name display when not hovered, hidden if details overlay is active */}
      {!isHovered && hasLoaded && (
         <div className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none`}>
          <p className="text-sm font-semibold text-gray-100 truncate">
            {image.name}
          </p>
        </div>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent onSelect when clicking delete
          onDelete();
        }}
        className={`absolute top-3 right-3 bg-red-700/90 hover:bg-red-600
                    text-white rounded-full w-8 h-8 flex items-center justify-center
                    opacity-0 group-hover:opacity-100 transition-all duration-200
                    transform scale-90 group-hover:scale-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-70
                    shadow-lg hover:shadow-xl
                    ${!hasLoaded && 'hidden'}`}
        aria-label="Delete image"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4" // Adjusted size
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default ImageCard;
