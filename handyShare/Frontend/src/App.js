import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import Signup from './pages/signup.tsx'; 
import Login from './pages/Login.tsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Signup />} /> {/* Add a route for the root path */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
