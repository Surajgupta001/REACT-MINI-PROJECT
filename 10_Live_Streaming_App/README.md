# Live Streaming App

This project is a React-based live streaming application built using Vite. It leverages the ZegoCloud UIKit Prebuilt SDK to enable real-time video and audio streaming.

## Features

- **Room-based Streaming:** Users can create or join live streaming rooms using a unique Room ID.
- **Live Video and Audio:** Provides real-time video and audio communication within the rooms.
- **Host and Audience Roles:** Supports different roles for participants (though currently hardcoded to Host in the `Room.jsx` component).
- **Shareable Links:** Generates a shareable link for others to join the room.
- **Responsive Design:** The streaming interface adapts to the full viewport width and height.

## Project Structure

The project has the following structure:

```plaintext
10_Live_Streaming_App/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/         # (Likely for images, media - currently empty)
│   ├── Component/
│   │   └── Pages/
│   │       ├── Home.jsx    # Landing page to join a room
│   │       └── Room.jsx    # Live streaming room interface
│   ├── App.css         # Styles for App component
│   ├── App.jsx         # Main application component with routing
│   ├── index.css       # Global styles
│   └── main.jsx        # Application entry point
├── .env                # Environment variables (VITE_APP_ID, VITE_SERVER_SECRET)
├── .gitignore          # Specifies intentionally untracked files
├── eslint.config.js    # ESLint configuration
├── index.html          # Main HTML file
├── package-lock.json   # Records exact versions of dependencies
├── package.json        # Project metadata and dependencies
├── README.md           # This file
└── vite.config.js      # Vite configuration
```

Key files and their roles:

- **`src/Component/Pages/Home.jsx`**: The landing page where users can enter a Room ID to join a stream.
- **`src/Component/Pages/Room.jsx`**: The component responsible for rendering the live streaming interface using ZegoCloud UIKit. It fetches the `roomId` from the URL parameters and initializes the ZegoCloud SDK.
- **`src/App.jsx`**: The main application component that sets up routing using `react-router-dom`. It defines routes for the `Home` and `Room` pages.
- **`src/main.jsx`**: The entry point of the application. It renders the `App` component within a `BrowserRouter`.
- **`.env`**: Stores environment variables, specifically `VITE_APP_ID` and `VITE_SERVER_SECRET` required for ZegoCloud authentication.
- **`package.json`**: Lists project dependencies (like `react`, `react-router-dom`, `@zegocloud/zego-uikit-prebuilt`) and scripts.

## How it Works

1. **Environment Setup**: The application requires `VITE_APP_ID` and `VITE_SERVER_SECRET` to be defined in the `.env` file. These are used to authenticate with the ZegoCloud service.
2. **Joining a Room**:
    - Users land on the `Home` page.
    - They enter a `roomId` into the input field.
    - Clicking "Join Room" navigates them to `/room/:roomId`.
3. **Streaming Page (`Room.jsx`)**:
    - The `Room` component extracts the `roomId` from the URL.
    - It generates a `kitToken` using `ZegoUIKitPrebuilt.generateKitTokenForTest` with the `appID`, `serverSecret`, `roomId`, and randomly generated user ID and user name.
    - It initializes the `ZegoUIKitPrebuilt` instance with the generated `kitToken`.
    - The `joinRoom` method is called to connect the user to the specified room.
        - The `container` option specifies the DOM element where the video interface will be rendered.
        - The `scenario` is set to `ZegoUIKitPrebuilt.LiveStreaming`.
        - The `role` is currently set to `ZegoUIKitPrebuilt.Host`. This could be made dynamic based on application logic (e.g., first user is host, others are audience).
        - `sharedLinks` are configured to allow copying the room link.

## Getting Started

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd 10_Live_Streaming_App
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**
    Create a `.env` file in the root of the `10_Live_Streaming_App` directory and add your ZegoCloud App ID and Server Secret:

    ```env
    VITE_APP_ID=YOUR_ZEGOCLOUD_APP_ID
    VITE_SERVER_SECRET="YOUR_ZEGOCLOUD_SERVER_SECRET"
    ```

    Replace `YOUR_ZEGOCLOUD_APP_ID` and `YOUR_ZEGOCLOUD_SERVER_SECRET` with your actual credentials.
4. **Run the development server:**

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run preview`: Serves the production build locally for preview.

## Key Technologies

- **React**: A JavaScript library for building user interfaces.
- **Vite**: A fast build tool and development server.
- **React Router DOM**: For client-side routing.
- **ZegoCloud UIKit Prebuilt**: SDK for easily integrating live streaming features.
- **ESLint**: For code linting and maintaining code quality.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE:1) file for details.
