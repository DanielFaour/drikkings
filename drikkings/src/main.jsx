import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import ScrollToTop from './components/ScrollTop.js';


ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter basename='/'>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </>
);
