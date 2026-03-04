import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home/Home';
import Match from '../pages/Match/Match';
import Friends from '../pages/Friends/Friends';
import Notifications from '../pages/Notifications/Notifications';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/match" element={<MainLayout><Match /></MainLayout>} />
        <Route path="/friends" element={<MainLayout noContainer><Friends /></MainLayout>} />
        <Route path="/notifications" element={<MainLayout><Notifications /></MainLayout>} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
