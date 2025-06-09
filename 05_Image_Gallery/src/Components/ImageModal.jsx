import React, { useState, useEffect, useRef } from "react";

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const ImageModal = ({ image, onClose, onNext, onPrev, canNext, canPrev }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const slideshowIntervalRef = useRef(null);
  const modalContentRef = useRef(null);

  useEffect(() => {
    if (isPlaying && canNext) {
      slideshowIntervalRef.current = setInterval(() => {
        onNext();
      }, 3000); // Change image every 3 seconds
    } else {
      clearInterval(slideshowIntervalRef.current);
    }
    return () => clearInterval(slideshowIntervalRef.current);
  }, [isPlaying, onNext, canNext]);

  useEffect(() => {
    // Stop slideshow if modal is closed or image changes manually
    setIsPlaying(false);
  }, [image, onClose]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowRight" && canNext) {
        onNext();
      } else if (event.key === "ArrowLeft" && canPrev) {
        onPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, onNext, onPrev, canNext, canPrev]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      modalContentRef.current?.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);


  const toggleSlideshow = () => {
    if (!canNext) return; // Don't start slideshow if only one image
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      className={`fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center z-50 p-4 sm:p-6 lg:p-8 transition-opacity duration-300 ease-in-out ${isFullScreen ? 'bg-black' : ''}`}
      onClick={!isFullScreen ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-modal-title"
    >
      <div
        ref={modalContentRef}
        className={`bg-gray-800/90 backdrop-blur-sm p-5 sm:p-6 rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col text-gray-200 border border-gray-700
                    ${isFullScreen ? '!max-w-full !max-h-full !h-full !w-full !rounded-none !border-none bg-black' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex justify-between items-center mb-4 ${isFullScreen ? 'pt-4 px-4 text-gray-100' : 'text-gray-300'}`}>
          <h2 id="image-modal-title" className={`text-xl sm:text-2xl font-semibold truncate pr-4 ${isFullScreen ? 'text-gray-100' : 'text-gray-200'}`}>
            {image.name}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullScreen}
              className={`p-2 rounded-full transition-colors ${isFullScreen ? 'text-gray-400 hover:text-gray-100 hover:bg-white/20' : 'text-gray-400 hover:text-gray-100 hover:bg-gray-700'}`}
              aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}
            >
              {isFullScreen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m7 2l5-5m0 0h-4m4 0v4m-7 7l-5 5m0 0v-4m0 4h4m7-2l-5 5m0 0v-4m0 4h4" /></svg>
              )}
            </button>
            {!isFullScreen && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-100 transition-colors p-2 rounded-full hover:bg-gray-700"
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Image Display Area */}
        <div className={`flex-grow overflow-hidden flex items-center justify-center rounded-lg p-2 mb-4 relative ${isFullScreen ? 'bg-black' : 'bg-gray-900/50'}`}>
          <img
            src={image.id}
            alt={image.name}
            className={`max-w-full object-contain rounded-md shadow-lg ${isFullScreen ? 'max-h-full' : 'max-h-[calc(95vh-220px)] sm:max-h-[calc(95vh-180px)]'}`}
          />
          {canPrev && (
            <button
              onClick={onPrev}
              className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                          ${isFullScreen ? 'bg-white/10 hover:bg-white/20 text-gray-200 focus:ring-offset-black' : 'bg-gray-800/70 hover:bg-gray-700/90 text-gray-200 focus:ring-offset-gray-800'}`}
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}
          {canNext && (
            <button
              onClick={onNext}
              className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                           ${isFullScreen ? 'bg-white/10 hover:bg-white/20 text-gray-200 focus:ring-offset-black' : 'bg-gray-800/70 hover:bg-gray-700/90 text-gray-200 focus:ring-offset-gray-800'}`}
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          )}
        </div>

        {/* Image Info and Controls */}
        { !isFullScreen && (
          <div className="text-sm text-gray-400 text-center mb-4 space-y-1 sm:flex sm:justify-center sm:space-y-0 sm:space-x-6">
            {image.size > 0 && <span><strong>Size:</strong> {formatBytes(image.size)}</span>}
            {image.width && image.height && (
              <span><strong>Dimensions:</strong> {image.width} x {image.height}</span>
            )}
            {image.type && <span><strong>Type:</strong> {image.type.split('/')[1]?.toUpperCase()}</span>}
          </div>
        )}
        <div className={`mt-auto flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 pt-3 ${isFullScreen ? 'pb-4 px-4 bg-black/90 rounded-t-lg' : ''}`}>
          {canNext && (
            <button
              onClick={toggleSlideshow}
              className={`w-full sm:w-auto font-medium px-5 py-2.5 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2 text-sm
                          ${isPlaying
                            ? `bg-amber-600 hover:bg-amber-500 focus:ring-amber-400 text-white`
                            : `bg-indigo-600 hover:bg-indigo-500 focus:ring-indigo-400 text-white`
                          } ${isFullScreen ? 'focus:ring-offset-black' : 'focus:ring-offset-gray-800'}`}
              aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5.75 4.75a.75.75 0 00-1.5 0v10.5a.75.75 0 001.5 0V4.75zM15.75 4.75a.75.75 0 00-1.5 0v10.5a.75.75 0 001.5 0V4.75z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.118v11.764a1.5 1.5 0 002.3 1.277l9.344-5.882a1.5 1.5 0 000-2.553L6.3 2.84z" />
                </svg>
              )}
              {isPlaying ? "Pause" : "Play"}
            </button>
          )}
          {!isFullScreen && (
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = image.id;
                link.download = image.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white font-medium px-5 py-2.5 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center justify-center gap-2 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download
            </button>
          )}
           {!isFullScreen && (
            <button
              onClick={onClose}
              className="w-full sm:w-auto bg-gray-600 hover:bg-gray-500 text-gray-200 font-medium px-5 py-2.5 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-800 text-sm"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
