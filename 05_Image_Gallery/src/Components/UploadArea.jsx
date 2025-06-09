import React from "react";

const UploadArea = ({ onUpload }) => {
  return (
    <div className="my-10 p-8 bg-gray-800/70 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700 transition-all hover:shadow-indigo-500/30 hover:border-indigo-600">
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center w-full h-56 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700/50 hover:bg-gray-700/80 transition-colors duration-200 ease-in-out group"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
          <svg
            className="w-12 h-12 mb-4 text-indigo-400 group-hover:text-indigo-300 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            ></path>
          </svg>
          <p className="mb-2 text-md text-gray-300 group-hover:text-gray-200">
            <span className="font-semibold text-indigo-400 group-hover:text-indigo-300">Click to upload</span> or drag and drop
          </p>
          <p className="text-sm text-gray-500 group-hover:text-gray-400">SVG, PNG, JPG, GIF (MAX. 800x400px)</p>
        </div>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => onUpload(e.target.files)}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default UploadArea;