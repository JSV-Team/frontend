import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home/Home';
import Match from '../pages/Match/Match';
import Friends from '../pages/Friends/Friends';
import Notifications from '../pages/Notifications/Notifications';
import Home_0 from '../pages/Home_0/Home_0';
import Register from '../pages/Register/Register';
function AppRouter() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home_0 />} />
          <Route path="/match" element={<Match />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default AppRouter;
