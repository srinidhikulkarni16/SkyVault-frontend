import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '92874053402-7b6een5mei4v3f1d1cb7mdp4sp7a0nj9.apps.googleusercontent.com';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: 'var(--surface-3)',
              color: 'var(--text-1)',
              border: '1px solid var(--border)',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.875rem',
              borderRadius: '10px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            },
            success: { iconTheme: { primary: '#2ECC71', secondary: 'var(--surface-3)' } },
            error:   { iconTheme: { primary: '#F55',    secondary: 'var(--surface-3)' } },
          }}
        />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);