import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import Signup from './pages/Signup.tsx'; 
import Login from './pages/Login.tsx';
import ForgotPassword from './pages/ForgotPassword.tsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Signup />} /> {/* Add a route for the root path */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}

export default App;
