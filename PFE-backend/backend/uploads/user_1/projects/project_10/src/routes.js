// src/routes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';


import PageOne from './pages/PageOne';
import PageTwo from './pages/PageTwo';
import EventPage from "./pages/EventPage";
import PromotionPage from "./pages/PromotionPage";
import Test from "./pages/Test";
import Testtt from "./pages/Testtt";
import Create from "./pages/Create";
import Create1 from "./pages/Create1";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PageOne />} />
      <Route path="/two" element={<PageTwo />} />
      <Route path="/eventpage" element={<EventPage />} />
      <Route path="/promotionpage" element={<PromotionPage />} />
      <Route path="/test" element={<Test />} />
      <Route path="/testtt" element={<Testtt />} />
      <Route path="/create" element={<Create />} />

      <Route path="/create1" element={<Create1 />} />
    </Routes>
  );
};
export default AppRoutes;