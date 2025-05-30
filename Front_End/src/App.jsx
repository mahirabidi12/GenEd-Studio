import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './context/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Form from './pages/Form';
import VideoDisplay from './pages/VideoDisplay';
import EditPrompt from './pages/EditPrompt';

const App = () => {
  return (
    <UserProvider>

      <BrowserRouter>
        <div className="min-h-screen bg-gray-900 text-white">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/video" element={<VideoDisplay />} />
              <Route path="/create" element={
                <ProtectedRoute>
                  <Form />
                </ProtectedRoute>
              } />
              <Route path="/templates" element={<div className="p-8">Templates Page (Coming Soon)</div>} />
              <Route path="/dashboard" element={<div className="p-8">Dashboard Page (Coming Soon)</div>} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/edit-prompt" element={
                <ProtectedRoute>
                  <EditPrompt />
                </ProtectedRoute>
              } />
              <Route path="*" element={<div className="p-8">404 - Page Not Found</div>} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
