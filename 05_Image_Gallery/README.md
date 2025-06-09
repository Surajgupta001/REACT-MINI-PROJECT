# Image Gallery Project

## Description

This project is a modern, responsive image gallery application. It allows users to view a collection of images in a grid layout, click on an image to view it in a larger modal, and potentially upload new images. The application is built using a modern JavaScript tech stack, focusing on a fast development experience and a clean user interface.

## Features

Based on the project structure, the following features are likely implemented or planned:

* **Image Grid Display**: Images are displayed in a responsive grid layout ([`GalleryGrid.jsx`](05_Image_Gallery/src/Components/GalleryGrid.jsx)).
* **Image Card**: Each image in the grid is represented by a card component ([`ImageCard.jsx`](05_Image_Gallery/src/Components/ImageCard.jsx)).
* **Image Modal**: Clicking on an image opens a modal for a larger view ([`ImageModal.jsx`](05_Image_Gallery/src/Components/ImageModal.jsx)).
* **Image Upload**: Functionality to upload new images to the gallery ([`UploadArea.jsx`](05_Image_Gallery/src/Components/UploadArea.jsx)).

## Tech Stack

* **Frontend Library**: [React](https://reactjs.org/) (v19.1.0)
* **Build Tool**: [Vite](https://vitejs.dev/) (v6.3.5)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4.1.8) with the [`@tailwindcss/vite`](https://www.npmjs.com/package/@tailwindcss/vite) plugin.
* **Linting**: [ESLint](https://eslint.org/) (v9.25.0) with configurations for JavaScript, JSX, React Hooks, and React Refresh.
* **Language**: JavaScript (ES2020, ES Modules)

## Project Structure

```plaintext
05_Image_Gallery/
├── .gitignore         # Specifies intentionally untracked files that Git should ignore
├── eslint.config.js   # ESLint configuration file
├── index.html         # Main HTML entry point for the application
├── LICENSE            # Project's MIT License file
├── package-lock.json  # Records the exact versions of dependencies
├── package.json       # Project metadata, dependencies, and scripts
├── README.md          # This file
├── tailwind.config.js # Tailwind CSS configuration
├── vite.config.js     # Vite configuration file
├── public/            # Static assets (e.g., vite.svg)
│   └── vite.svg
└── src/               # Main source code for the application
    ├── App.css          # Global styles for the App component
    ├── App.jsx          # Root React component
    ├── index.css        # Global CSS styles
    ├── main.jsx         # Main JavaScript entry point, renders the React app
    ├── assets/          # Static assets like images, fonts (e.g., react.svg)
    │   └── react.svg
    └── Components/      # Reusable React components
        ├── GalleryGrid.jsx
        ├── ImageCard.jsx
        ├── ImageModal.jsx
        └── UploadArea.jsx
```

## Setup and Installation

1. **Clone the repository (if applicable):**

    ```bash
    git clone <repository-url>
    cd 05_Image_Gallery
    ```

2. **Install dependencies:**
    Make sure you have [Node.js](https://nodejs.org/) installed. Then, run the following command in the project root directory:

    ```bash
    npm install
    ```

    This will install all the dependencies listed in [`package.json`](05_Image_Gallery/package.json).

## Available Scripts

In the project directory, you can run the following scripts:

* ### `npm run dev`

    Runs the app in development mode using Vite. Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal) to view it in the browser. The page will reload if you make edits.

* ### `npm run build`

    Builds the app for production to the `dist` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

* ### `npm run lint`

    Runs ESLint to analyze the code for potential errors and style issues.

* ### `npm run preview`

    Serves the production build locally to preview the application. This is useful for testing the build before deployment.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
