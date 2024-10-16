import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import Signup from './pages/Signup.js'; 
import Login from './pages/Login.js';
import ForgotPassword from './pages/ForgotPassword.tsx';
import HomeScreen from './pages/HomeScreen.js';

function App() {
  return (

    <Routes>
      <Route path="/" element={<Signup />} /> {/* Add a route for the root path */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path = "/homepage" element={<HomeScreen/>}/>
    </Routes>
  );
}

export default App;
