// src/routes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { About } from './pages/PageOne';
import Winter from "./pages/PageTwo";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<About />} />

      <Route path="/page-two" element={<Winter />} />
    </Routes>
  );
};
export default AppRoutes;