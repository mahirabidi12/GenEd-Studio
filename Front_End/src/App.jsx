import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SignUp from './pages/SignUp';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<div className="p-8">Create Page (Coming Soon)</div>} />
            <Route path="/templates" element={<div className="p-8">Templates Page (Coming Soon)</div>} />
            <Route path="/dashboard" element={<div className="p-8">Dashboard Page (Coming Soon)</div>} />
            <Route path="/login" element={<div className="p-8">Login Page (Coming Soon)</div>} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<div className="p-8">404 - Page Not Found</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
