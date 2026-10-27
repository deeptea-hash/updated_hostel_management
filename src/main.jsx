import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './auth.jsx';
import { StoreProvider } from './store.jsx';
import { ToastHost } from './toast.jsx';
import './styles.css';
createRoot(document.getElementById('root')).render(<BrowserRouter><AuthProvider><StoreProvider><App /><ToastHost /></StoreProvider></AuthProvider></BrowserRouter>);
