import React from "react";
import ImageCard from "./ImageCard";

const GalleryGrid = ({ images, onSelect, onDelete }) => {
  if (images.length === 0) {
    return (
      <div className="text-center py-16">
        <svg
          className="mx-auto h-16 w-16 text-gray-500" // Adjusted for dark theme
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 7l3-3m0 0l3 3M6 4v10M3.75 10.5a2.25 2.25 0 00-2.25 2.25v5.25c0 1.243.932 2.25 2.086 2.25h14.828c1.154 0 2.086-1.007 2.086-2.25v-5.25a2.25 2.25 0 00-2.25-2.25h-1.5M7.5 12h9M7.5 15h5.25"
          />
        </svg>
        <h3 className="mt-4 text-lg font-semibold text-gray-300">Your Gallery is Empty</h3>
        <p className="mt-2 text-md text-gray-400">
          Start by uploading some beautiful images. <br />Drag & drop or click the area above.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 xl:gap-8 mt-10">
      {images.map((img) => (
        <ImageCard
          key={img.id}
          image={img}
          onSelect={() => onSelect(img)}
          onDelete={() => onDelete(img.id)}
        />
      ))}
    </div>
  );
};

export default GalleryGrid;