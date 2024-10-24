import { Button } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/Input-field.js';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [message, setMessage] = useState(''); // For success/error message
  const [messageType, setMessageType] = useState(''); // To differentiate between success and error
  const [showPassword, setShowPassword] = useState(false);


  const handleSubmit = async () => {
    if (!name || !email || !password || !acceptTerms) {
      setMessage('Please fill in all fields and accept the terms.');
      setMessageType('error');
      return;
    }
  
    setLoading(true);
    setMessage(''); // Clear any previous messages
  
    const payload = {
      name: name,
      email: email,
      password: password,
    };
  
    try {
      console.log('Sending data to API: ', payload);
  
      const response = await fetch('http://172.17.0.99:8080/api/v1/all/register', {
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
          setMessage('Registration successful! Please check your email for verification.');
          setMessageType('success');
        } else {
          const textData = await response.text();
          console.log('Registration successful:', textData);
          setMessage(textData); // Display plain text response
          setMessageType('success');
        }
        setTimeout(() => navigate('/login'), 3000);
      } else {
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.error('Registration failed:', errorData);
          setMessage(`Registration failed: ${errorData.message}`);
          setMessageType('error');
        } else {
          const textError = await response.text();
          console.error('Registration failed:', textError);
          setMessage(`Registration failed: ${textError}`);
          setMessageType('error');
        }
      }
    } catch (error) {
      console.error('Error occurred during registration:', error);
      setMessage(`Error occurred: ${error.message}`);
      setMessageType('error');
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

          {/* Display success or error messages */}
          {message && (
            <div className={`text-center py-2 ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </div>
          )}

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
            <div className="relative">
              <InputField
                label="Create Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
                <span
                className="absolute right-2 top-7 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
              </span>
            </div>
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

          <p className="mt-4 text-center text-sm text-[#4f4f4f]">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-[#333333] hover:underline"
            >
              Log in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
