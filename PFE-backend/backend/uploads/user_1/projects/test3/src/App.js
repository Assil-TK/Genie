// src/App.js
import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import AppRoutes from './routes';

const App = () => {
  return (
    <BrowserRouter>
      <h1>Server-Side Rendering Examples</h1>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/articles">Articles</Link></li>
      </ul>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
