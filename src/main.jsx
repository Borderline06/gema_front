import './index.css'
import React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext';
import { CatalogProvider } from './context/CatalogContext';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CatalogProvider>
        <App />
      </CatalogProvider>
    </AuthProvider>
  </React.StrictMode>
);