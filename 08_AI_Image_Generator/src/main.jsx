import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ImageGeneratorProvider } from './Context/Context.jsx'; // Updated path

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ImageGeneratorProvider>
      <App />
    </ImageGeneratorProvider>
  </React.StrictMode>,
)
