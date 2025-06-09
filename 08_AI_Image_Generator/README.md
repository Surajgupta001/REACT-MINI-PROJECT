# AI Image Generator

This project is a web application built with React and Vite that allows users to generate images based on text prompts using AI models. It leverages the Hugging Face API for its image generation capabilities.

## Overview

The AI Image Generator provides a user-friendly interface to interact with powerful AI models. Users can input a descriptive text prompt, and the application will generate a corresponding image. The application also features a gallery to display previously generated images.

## Features

* **Text-to-Image Generation**: Users can enter text prompts to generate unique images.
* **Image Display**: View the generated image directly within the application.
* **Prompt Input Form**: A dedicated form for users to submit their image generation requests.
* **Loading Indicator**: Shows a loader while the AI is processing the request and generating the image.
* **History Gallery**: (Assumed based on `HistoryGallery` component) Displays a collection of previously generated images.

## Technologies Used

* **Frontend**:
  * [React](https://reactjs.org/) (v18+)
  * [Vite](https://vitejs.dev/)
  * JavaScript (ESM)
* **Styling**:
      * CSS (as seen from `.css` files in components)
* **Linting**:
      * [ESLint](https://eslint.org/) with plugins for React hooks and refresh.
* **AI Model Integration**:
      * [Hugging Face API](https://huggingface.co/docs/api-inference/index) (inferred from `VITE_HF_API_TOKEN`)

## Project Structure

The project follows a standard Vite + React structure:

```plaintext
08_AI_Image_Generator/
├── public/                   # Static assets
├── src/                      # Source files
│   ├── Component/            # React components
│   │   ├── PromptForm/       # Component for submitting prompts
│   │   ├── ImageDisplay/     # Component for displaying generated images
│   │   ├── HistoryGallery/   # Component for showing image history
│   │   └── Loader/           # Loading indicator component
│   ├── Context/              # React context for state management
│   │   └── Context.jsx
│   ├── gemini.js             # Potentially for Gemini API interaction or utility
│   ├── App.jsx               # Main application component
│   ├── main.jsx              # Entry point of the application
│   └── index.css             # Global styles
├── .env                      # Environment variables (e.g., API keys)
├── LICENSE                   # Project License
├── index.html                # Main HTML file
├── vite.config.js            # Vite configuration
├── package.json              # Project dependencies and scripts
└── README.md                 # This file
```

## Setup and Installation

1. **Clone the repository (if applicable):**

    ```bash
    git clone <repository-url>
    cd 08_AI_Image_Generator
    ```

2. **Install dependencies:**
    Make sure you have Node.js and npm (or yarn/pnpm) installed.

    ```bash
    npm install
    ```

    or

    ```bash
    yarn install
    ```

    or

    ```bash
    pnpm install
    ```

3. **Set up Environment Variables:**
    Create a `.env` file in the root of the `08_AI_Image_Generator` directory and add your Hugging Face API token:

    ```env
    VITE_HF_API_TOKEN=your_hugging_face_api_token_here
    ```

    Replace `your_hugging_face_api_token_here` with your actual Hugging Face API token.

## Available Scripts

In the project directory, you can run the following scripts:

* **`npm run dev`**:
    Runs the app in development mode with Hot Module Replacement (HMR).
    Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal) to view it in the browser.

* **`npm run build`**:
    Builds the app for production to the `dist` folder.
    It correctly bundles React in production mode and optimizes the build for the best performance.

* **`npm run lint`**:
    Lints the project files using ESLint to check for code quality and style issues.

* **`npm run preview`**:
    Serves the production build locally to preview the application.

## How to Use

1. Ensure you have completed the Setup and Installation steps, including adding your `VITE_HF_API_TOKEN` to the `.env` file.
2. Start the development server: `npm run dev`.
3. Open your browser and navigate to the local development URL.
4. Enter a text prompt in the input field describing the image you want to generate.
5. Submit the prompt. The application will display a loader while the image is being generated.
6. Once generated, the image will be displayed.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
