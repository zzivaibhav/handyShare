import { Button } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/Input-field.js';

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false); 

  const handleSubmit = async () => {
    // Check if all fields are filled before submission
    if (!name || !email || !password || !acceptTerms) {
      alert('Please fill in all fields and accept the terms.');
      return;
    }
  
    setLoading(true);
  
    const payload = {
      name: name,
      email: email,
      password: password,
    };
  
    try {
      console.log('Sending data to API: ', payload);
  
      const response = await fetch('http://localhost:8080/api/v1/all/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      console.log('API Response:', response);
  
      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (response.ok) {
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('Registration successful:', data);
          alert('Registration successful!');
        } else {
          const textData = await response.text();
          console.log('Registration successful:', textData);
          alert(textData); // Handle plain text responses
        }
        navigate('/login');
      } else {
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.error('Registration failed:', errorData);
          alert(`Registration failed: ${errorData.message}`);
        } else {
          const textError = await response.text();
          console.error('Registration failed:', textError);
          alert(`Registration failed: ${textError}`);
        }
      }
    } catch (error) {
      console.error('Error occurred during registration:', error);
      alert(`Error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f2f2f2' }}>
      <div className="flex w-full max-w-6xl bg-white rounded-lg shadow-2xl overflow-hidden">
        <div className="w-2/5 flex items-center justify-center" style={{ backgroundColor: '#fff' }}>
          <img src="Assets/Logo.png" alt="Logo" />
        </div>

        <div className="w-3/5 p-10">
          <h1 className="text-4xl font-semibold text-left text-[#333333]">Create an Account</h1>
          <p className="text-left text-[#808080] mt-2 mb-8">
            Join handyShare to explore unique rental opportunities!
          </p>
          <form className="space-y-6">
            <InputField
              label="Full Name"
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <InputField
              label="Email Address"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <InputField
              label="Create Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="h-5 w-5 text-[#333333] border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-[#4f4f4f]">
                I agree to the{' '}
                <a href="/terms" className="text-[#333333] hover:underline">Terms of Service</a>{' '}
                and{' '}
                <a href="/privacy" className="text-[#333333] hover:underline">Privacy Policy</a>
              </label>
            </div>

            <Button
              type="button" // Change this to type="button"
              className="w-full bg-[#333333] text-white py-3 rounded-lg"
              onClick={handleSubmit} // Use onClick to submit
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </form>

          {/* Remaining code */}
        </div>
      </div>
    </div>
  );
}