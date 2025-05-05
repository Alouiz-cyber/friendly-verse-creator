
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { LanguageProvider } from './contexts/LanguageContext';
import { LovableBadge } from './components/LovableBadge';

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
      <LovableBadge />
    </LanguageProvider>
  </React.StrictMode>
);
