# Real-Time Chat Application

This is a real-time chat application built with React, Vite, and the Zego ZIM Web SDK. It allows users to communicate with each other instantly.

## Features

* Real-time text messaging
* User authentication (implied by the use of user-specific tokens)
* Responsive user interface

## Technologies Used

* **Frontend:** React.js
* **Build Tool:** Vite
* **Routing:** React Router DOM (`react-router-dom`)
* **Real-Time Communication:** ZEGOCLOUD ZIM SDK (`zego-zim-web`)
* **Icons:** React Icons (`react-icons`)
* **Linting:** ESLint
* **Styling:** CSS

## Setup and Installation

1. **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd 09_Real_Time_Chat_App
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

    Or if you use Yarn:

    ```bash
    yarn install
    ```

3. **Set up Environment Variables:**
    Create a `.env` file in the root of the `09_Real_Time_Chat_App` directory and add the following environment variables. These are typically obtained from your ZEGOCLOUD project dashboard.

    ```env
    VITE_APP_ID=YOUR_ZEGOCLOUD_APP_ID
    VITE_TOKEN_A=YOUR_USER_A_TOKEN
    VITE_TOKEN_B=YOUR_USER_B_TOKEN
    ```

    * `VITE_APP_ID`: Your ZEGOCLOUD application ID.
    * `VITE_TOKEN_A`: A ZIM token for a test user (e.g., User A).
    * `VITE_TOKEN_B`: A ZIM token for another test user (e.g., User B).

    **Note:** The `.env` file is included in `.gitignore` and should not be committed to the repository.

## Available Scripts

In the project directory, you can run the following scripts:

* ### `npm run dev`

    Runs the app in development mode. Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal) to view it in the browser. The page will reload if you make edits.

* ### `npm run build`

    Builds the app for production to the `dist` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

* ### `npm run lint`

    Lints the project files using ESLint to check for code quality and style issues.

* ### `npm run preview`

    Serves the production build locally from the `dist` folder. This is a good way to check if the production build works correctly before deploying.

## Project Structure

```plainext
09_Real_Time_Chat_App/
├── .env                # Environment variables (ignored by Git)
├── .gitignore          # Specifies intentionally untracked files that Git should ignore
├── eslint.config.js    # ESLint configuration
├── index.html          # Main HTML entry point for Vite
├── LICENSE             # MIT License file
├── package-lock.json   # Records exact versions of dependencies
├── package.json        # Project metadata, scripts, and dependencies
├── public/             # Static assets
│   ├── default-avatar.png
│   └── vite.svg
├── README.md           # This file
├── src/                # Main application source code
│   ├── App.css
│   ├── App.jsx         # Main App component
│   ├── index.css       # Global styles
│   ├── main.jsx        # Entry point for the React application
│   ├── assets/         # Image assets, etc.
│   └── components/     # Reusable React components
│       ├── ChatHeader.jsx
│       ├── Login.jsx
│       ├── MessageInput.jsx
│       └── MessageList.jsx
└── vite.config.js      # Vite configuration file
```

## Learn More

* [React Documentation](https://reactjs.org/)
* [Vite Documentation](https://vitejs.dev/)
* [ZEGOCLOUD ZIM SDK Documentation](https://docs.zegocloud.com/article/14159)
* [React Router DOM Documentation](https://reactrouter.com/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE:1) file for details.
