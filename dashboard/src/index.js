import React from 'react';
import ReactDOM from 'react-dom/client'; // Use the 'client' version for React 18
import './styles/index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root element
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
