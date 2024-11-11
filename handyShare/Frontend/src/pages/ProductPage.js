import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderBar from '../components/ProfileUpdatePage/ProfileHeaderBar.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { message } from 'antd';
import { MailOutlined, PhoneOutlined, StarFilled } from '@ant-design/icons';

const ProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const MAX_HOURS = 24;

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id || id === 'null') {
        setError('Invalid product ID.');
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const productResponse = await axios.get(`http://localhost:8080/api/v1/user/product/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        setProduct(productResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Error loading product details.');
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  const handleRentNow = async () => {
    if (!selectedDate) {
      message.warning('Please select a date to proceed with the rental.');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const hours = product.transactionTime || 2;
      const totalAmount = product.rentalPrice * hours;
  
      const borrowData = {
        product: {
          id: parseInt(id)
        },
        duration: hours,
        amount: totalAmount,
        penalty: Math.ceil(totalAmount * 0.5) // 50% of total amount as penalty
      };
  
      const response = await axios.post(
        'http://localhost:8080/api/v1/user/borrowProduct',
        borrowData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
  
      if (response.status === 200 || response.status === 201) {
        message.success('Rental request processed successfully!');
        navigate('/rent-summary', {
          state: {
            product,
            hours: hours,
            selectedDate,
            borrowDetails: response.data
          }
        });
      }
    } catch (error) {
      console.error('Rental error:', error);
      message.error(error.response?.data?.message || 'Failed to process rental request. Please try again.');
    }
  };
  if (loading) return <div className="p-8 mt-16 animate-pulse text-blue-600">Loading...</div>;
  if (error) return <div className="p-8 mt-16 text-red-500 font-semibold">{error}</div>;
  if (!product) return <div className="p-8 mt-16">Product not found.</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <HeaderBar />
      <main className="flex-grow p-8 mt-16 grid gap-8 sm:grid-cols-1 lg:grid-cols-3">

        {/* Left Section: Product Image and Description */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {product.productImage ? (
            <img src={product.productImage} alt={product.name} className="w-full h-64 object-cover rounded-md mb-4 shadow-lg" />
          ) : (
            <div className="w-full h-64 bg-gray-300 rounded-md flex items-center justify-center shadow-md">
              <span className="text-gray-500">No Image Available</span>
            </div>
          )}
          <h3 className="heading-lg mb-2">Description</h3>
          <p className="text-gray-600">{product.description}</p>
          <h3 className="heading-lg mt-6">Reviews</h3>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} className="mt-2 text-gray-600">
                <p><strong>{review.user}:</strong> {review.comment}</p>
              </div>
            ))
          ) : (
            <p>No reviews available.</p>
          )}
        </div>

        {/* Middle Section: Product Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="heading-lg text-gray-800">{product.name}</h2>
          <p className="text-lg text-gray-600 mb-4">Price: <span className="font-semibold">${product.rentalPrice}/hour</span></p>
          <p className="text-gray-600">Transaction Time: <span className="font-semibold">{product.transactionTime || '2'}</span> hours</p>

          {/* Hours Selector */}
          <div className="mt-4">
            <label className="block text-lg font-medium mb-2">Select Hours:</label>
            <select
              value={product.transactionTime}
              onChange={(e) => setProduct({ ...product, transactionTime: Number(e.target.value) })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {[...Array(MAX_HOURS)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i + 1 === 1 ? 'hour' : 'hours'}
                </option>
              ))}
            </select>
          </div>

          {/* Total Price Display */}
          <p className="mt-2 text-lg font-semibold">
            Total Price: ${(product.rentalPrice * (product.transactionTime || 1)).toFixed(2)}
          </p>

          {/* Date Picker for Rental Date */}
          <div className="mt-6">
            <label className="block text-lg font-medium mb-2">Select Rental Date:</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="MMMM d, yyyy"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholderText="Choose a date"
              minDate={new Date()}
            />
          </div>

          {/* Rent Now Button */}
          <button
            onClick={handleRentNow}
            className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Rent Now
          </button>
        </div>

        {/* Right Section: Lender Information */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          {product.lender ? (
            <div className="w-full">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Lender Information</h3>
              
              {/* Lender Profile Picture */}
              <div className="flex justify-center">
                {product.lender.imageData ? (
                  <img
                    src={product.lender.imageData}
                    alt={product.lender.name}
                    className="w-24 h-24 rounded-full object-cover mb-4 shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                    <span className="text-gray-500">No Image Available</span>
                  </div>
                )}
              </div>

              {/* Lender Details */}
              <div className="text-center space-y-2">
                <p className="text-lg flex items-center justify-center"><MailOutlined className="mr-2" /> {product.lender.email}</p>
                {product.lender.phone && (
                  <p className="text-lg flex items-center justify-center"><PhoneOutlined className="mr-2" /> {product.lender.phone}</p>
                )}
                {product.lender.rating && (
                  <p className="text-lg flex items-center justify-center">
                    <StarFilled className="text-yellow-500 mr-2" /> {product.lender.rating} ★
                  </p>
                )}
              </div>

              {/* Lender's Location */}
              <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-2 text-center">Lender's Location</h3>
              <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center">
                <span className="text-gray-500">Map Placeholder</span>
              </div>
            </div>
          ) : (
            <p>Loading lender information...</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductPage;
