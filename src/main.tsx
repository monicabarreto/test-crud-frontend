import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Se não tiver, você pode apagar essa linha
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
