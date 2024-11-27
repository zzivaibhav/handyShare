import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract token and role from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const role = urlParams.get('role');

    if (token) {
      // Save the token and role to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role || 'user'); // Default to 'user' if role is not provided

      // Navigate to the appropriate page based on role
      const targetPath = role === 'admin' ? '/admin' : '/homepage';
      
      // Clean up the URL and navigate
      window.history.replaceState({}, document.title, targetPath);
      navigate(targetPath, { replace: true });
    } else {
      // If no token is found, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  // Show a loading state while processing
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Processing login...</p>
    </div>
  );
};

export default OAuth2RedirectHandler;