// src/routes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';


import PageOne from './pages/PageOne';
import PageTwo from './pages/PageTwo';
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PageOne />} />
      <Route path="/two" element={<PageTwo />} />
     
    </Routes>
  );
};
export default AppRoutes;