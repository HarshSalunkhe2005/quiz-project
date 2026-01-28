import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // No folder here, just ./App
import './styles/App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)