// src/routes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { About } from './pages/PageOne';
import Winter from "./pages/PageTwo";
import PageTest from "./pages/PageTest";
import Page2 from "./pages/Page2";
import Test from "./pages/Test";
import Testt from "./pages/Testt";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<About />} />
      <Route path="/page-two" element={<Winter />} />
      <Route path="/pagetest" element={<PageTest />} />
      <Route path="/page2" element={<Page2 />} />
      <Route path="/test" element={<Test />} />

      <Route path="/testt" element={<Testt />} />
    </Routes>
  );
};
export default AppRoutes;