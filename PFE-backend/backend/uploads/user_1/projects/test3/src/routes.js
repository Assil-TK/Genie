// src/routes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Articles } from './pages/Articles';

import Testi from "./pages/Testi";

import Test from "./pages/Test";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/articles" element={<Articles />} />
      <Route path="/testi" element={<Testi />} />

      <Route path="/test" element={<Test />} />
    </Routes>
  );
};

export default AppRoutes;
