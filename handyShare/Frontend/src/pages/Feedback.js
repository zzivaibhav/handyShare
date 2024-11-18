import React, { useEffect, useState } from "react";
import axios from "axios";
import { Layout } from 'antd';
import HeaderBar from '../components/ProfileUpdatePage/ProfileHeaderBar.js'; // Import HeaderBar component
import FeedbackForm from '../components/Feedback/FeedbackForm';

const { Header, Content, Footer } = Layout;

const FeedbackPage = ({ productId, userId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState(null);

  // Fetch feedback data for the product
  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/v1/user/feedback/product/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      setFeedbacks(response.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  // Submit new feedback and refresh the feedback list
  const handleSubmitFeedback = async (event) => {
    event.preventDefault();
  
    if (!reviewText || !rating) {
      alert("Review text and rating are required.");
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');  // Get userId from localStorage
  
      const reviewData = {
        productId: productId,  // From props
        userId: userId,        // From localStorage
        reviewText: reviewText, // From state
        rating: rating,        // From state
        image: image,           // From state (you may need to upload the image separately)
      };
  
      const formData = new FormData();
      formData.append("productId", productId);
      formData.append("userId", userId);
      formData.append("reviewText", reviewText);
      formData.append("rating", rating);
      if (image) formData.append("image", image);
  
      const response = await axios.post('http://localhost:8080/api/v1/user/review-create', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',  // Ensure the content type is set correctly for file uploads
        },
        withCredentials: true,
      });
  
      const { data } = response;
      if (data.success) {
        alert("Review submitted successfully!");
        setFeedbacks([...feedbacks, data.review]);
        setReviewText("");  // Reset review form
        setRating(0);       // Reset rating
        setImage(null);      // Reset image
      } else {
        alert("Failed to submit review. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Error submitting feedback. Please try again.");
    }
  };
  

  useEffect(() => {
    fetchFeedbacks();
  }, [productId]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header */}
      <Header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: '#3B7BF8',
        }}
      >
        <HeaderBar />
      </Header>

      {/* Main content */}
      <Content style={{ padding: '100px 50px', marginTop: '64px' }}>
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            background: '#fff',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h1 className="text-2xl font-bold mb-6">Product Feedback</h1>

          {/* Feedback Form */}
          <form onSubmit={handleSubmitFeedback}>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review"
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="4"
            />
            <div className="mt-4">
              <label>Rating: </label>
              <input
                type="number"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                min="1"
                max="5"
                className="w-12 p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mt-4">
              <label>Upload Image (optional): </label>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="p-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Submit Review
            </button>
          </form>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Feedbacks:</h2>
          {feedbacks.length === 0 ? (
            <p>No feedback available for this product.</p>
          ) : (
            <div>
              {feedbacks.map((feedback) => (
                <div key={feedback.id} className="mb-4 p-4 border rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">{feedback.userId}</div>
                    <div className="ml-2 text-sm text-gray-600">Rating: {feedback.rating}</div>
                  </div>
                  <p className="mt-2">{feedback.reviewText}</p>
                  {feedback.image && (
                    <img
                      src={`/path/to/images/${feedback.image}`} // Adjust image path
                      alt="Feedback Image"
                      className="mt-2 w-32 h-32 object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Content>

      {/* Footer */}
      <Footer style={{ textAlign: 'center' }}>
        HandyShare ©{new Date().getFullYear()} Created by Group G02
      </Footer>
    </Layout>
  );
};

export default FeedbackPage;
