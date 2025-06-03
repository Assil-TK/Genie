// src/routes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';


import PageOne from './pages/PageOne';
import PageTwo from './pages/PageTwo';
import EventPage from "./pages/EventPage";
import PromotionPage from "./pages/PromotionPage";
import Test from "./pages/Test";
import Testtt from "./pages/Testtt";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PageOne />} />
      <Route path="/two" element={<PageTwo />} />
      <Route path="/eventpage" element={<EventPage />} />
      <Route path="/promotionpage" element={<PromotionPage />} />
      <Route path="/test" element={<Test />} />

      <Route path="/testtt" element={<Testtt />} />
    </Routes>
  );
};
export default AppRoutes;