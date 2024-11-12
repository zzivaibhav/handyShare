import React, { useEffect, useState } from "react";
import axios from "axios";
import { Layout } from 'antd';
import HeaderBar from '../components/ProfileUpdatePage/ProfileHeaderBar.js'; // Import HeaderBar component
import FeedbackForm from '../components/Feedback/FeedbackForm';

const { Header, Content, Footer } = Layout;

const FeedbackPage = ({ productId, userId }) => {
  const [feedbacks, setFeedbacks] = useState([]);

  // Fetch feedback data for the product
  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(`/api/v1/all/feedback/product/${productId}`);
      setFeedbacks(response.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  // Submit new feedback and refresh the feedback list
  const handleSubmitFeedback = (newFeedback) => {
    setFeedbacks([...feedbacks, newFeedback]);
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
          <FeedbackForm productId={productId} userId={userId} onSubmitFeedback={handleSubmitFeedback} />
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
                  <p className="mt-2">{feedback.feedbackText}</p>
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
