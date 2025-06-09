import React, { useState, useMemo, useEffect } from "react";
import UploadArea from "./Components/UploadArea";
import GalleryGrid from "./Components/GalleryGrid";
import ImageModal from "./Components/ImageModal";

const APP_STORAGE_KEY = "reactImageGallery_images";

const App = () => {
  const [images, setImages] = useState(() => {
    const storedImages = localStorage.getItem(APP_STORAGE_KEY);
    return storedImages ? JSON.parse(storedImages) : [];
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  // Theme state and related logic removed

  useEffect(() => {
    // Save to localStorage whenever images change
    // Store the Data URL (id) which is persistent
    const imagesToStore = images.map(({ id, name, size, width, height, type }) => ({
      id, // This will now be the Data URL
      name,
      size,
      width,
      height,
      type,
    }));
    try {
      localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(imagesToStore));
    } catch (error) {
      console.error("Error saving images to localStorage:", error);
      // Potentially inform the user that storage is full
      // For now, we'll just log the error.
      // You could add a state variable to show a message to the user.
      if (error.name === 'QuotaExceededError') {
        alert("Storage limit exceeded. Cannot save more images. Please remove some images to free up space.");
        // Optionally, revert the 'images' state to its previous value before this failed save attempt.
        // This is more complex as it requires knowing the previous state.
        // A simpler approach is to let the UI show the image, but it won't be persisted.
      }
    }
  }, [images]);

  // useEffect for theme management removed
  // const toggleTheme function removed

  const handleUpload = (files) => {
    const imagePromises = Array.from(files).map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            resolve({
              id: e.target.result, // Store Data URL as id
              // file, // No longer storing the File object directly for localStorage persistence
              name: file.name,
              size: file.size,
              width: img.width,
              height: img.height,
              type: file.type,
            });
          };
          // e.target.result already contains the Data URL from readAsDataURL
          img.src = e.target.result;
        };
        reader.readAsDataURL(file); // Reads the file as a Data URL
      });
    });

    Promise.all(imagePromises).then((newImageFiles) => {
      const updatedImages = [...images];
      newImageFiles.forEach(newFile => {
        // Check for duplicates based on name, size, and type before adding
        if (!updatedImages.find(existing =>
            existing.name === newFile.name &&
            existing.size === newFile.size &&
            existing.type === newFile.type)) {
          updatedImages.push(newFile);
        }
      });
      setImages(updatedImages);
    });
  };

  const handleDelete = (id) => {
    // No need to revokeObjectURL if 'id' is a Data URL
    const updatedImages = images.filter((img) => img.id !== id);
    setImages(updatedImages);
    if (selectedImage?.id === id) setSelectedImage(null);
  };

  const filteredImages = useMemo(() => {
    return images.filter((image) =>
      image.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [images, searchTerm]);

  return (
    // Body background is handled by index.css
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 text-gray-200"> {/* Inherits gradient from body, sets base text color */}
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-10 sm:mb-16 relative">
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight
                       text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400
                       py-4 select-none"
          >
            Image Gallery Pro
          </h1>
          <p className="mt-3 text-lg text-gray-400 max-w-2xl mx-auto">
            Upload, view, and manage your images with ease in a stunning dark interface.
          </p>
        </header>
        <main>
          <UploadArea onUpload={handleUpload} />
          <div className="my-8">
            <input
              type="text"
              placeholder="Search by image name..."
              className="w-full px-5 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-md hover:shadow-lg focus:shadow-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <GalleryGrid images={filteredImages} onSelect={setSelectedImage} onDelete={handleDelete} />
          {selectedImage && (
            <ImageModal
              image={selectedImage}
              onClose={() => setSelectedImage(null)}
              onNext={() => {
                const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
                const nextIndex = (currentIndex + 1) % filteredImages.length;
                setSelectedImage(filteredImages[nextIndex]);
              }}
              onPrev={() => {
                const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
                const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
                setSelectedImage(filteredImages[prevIndex]);
              }}
              canNext={filteredImages.length > 1}
              canPrev={filteredImages.length > 1}
            />
          )}
        </main>
        <footer className="text-center mt-12 py-6 border-t border-gray-700">
          <p className="text-gray-500">&copy; {new Date().getFullYear()} Image Gallery Pro. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;