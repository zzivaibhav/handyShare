import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { Form, Button, Input, notification } from 'antd';

const PaymentForm = ({ onSuccess, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState(null); 

  const handleOnboard = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/v1/all/payment/onboard', {
        name,
        email,
      });

      const generatedCustomerId = response.data.customerId;
      setCustomerId(generatedCustomerId); // Save customerId in state

      notification.success({
        message: 'Onboarding Successful',
        description: `Customer onboarded with ID: ${response.data.customerId}`,
      });
    } catch (error) {
      notification.error({
        message: 'Onboarding Failed',
        description: error.response?.data?.message || 'An error occurred.',
      });
    }
  };

  const handlePayment = async () => {
    if (!stripe || !elements) {
      notification.error({ message: 'Stripe.js has not loaded yet.' });
      return;
    }
  
    const cardElement = elements.getElement(CardElement);
  
    const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });
  
    if (paymentMethodError) {
      notification.error({
        message: 'Payment Error',
        description: paymentMethodError.message,
      });
      return;
    }
  
    setLoading(true);
  
    try {
      // Save the card to the customer in Stripe
      await saveCardToCustomer(paymentMethod.id);
  
      // Proceed with payment
      const response = await axios.post('http://localhost:8080/api/v1/all/payment/charge', {
        amount: parseInt(amount) * 100,
        currency: 'CAD',
        paymentMethodId: paymentMethod.id,
      });
  
      const { clientSecret } = response.data;
  
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret);
  
      if (confirmError) {
        notification.error({
          message: 'Payment Error',
          description: confirmError.message,
        });
      } else if (paymentIntent.status === 'succeeded') {
        notification.success({
          message: 'Payment Successful',
          description: `Payment for CAD ${amount} succeeded!`,
        });
        onSuccess();
      }
    } catch (error) {
      console.error('Payment processing error:', error.response?.data || error.message);
      notification.error({
        message: 'Payment Processing Error',
        description: error.response?.data?.error || 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };  

  const saveCardToCustomer = async (paymentMethodId) => {
    if (!customerId) {
      notification.error({
        message: 'Customer ID Missing',
        description: 'Please onboard the customer before saving the card.',
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/v1/all/payment/save-card', {
        paymentMethodId,
        customerId, 
      });
  
      notification.success({
        message: 'Card Saved',
        description: response.data.message,
      });
    } catch (error) {
      console.error('Error saving card:', error.response?.data || error.message);
      notification.error({
        message: 'Error Saving Card',
        description: error.response?.data?.error || 'Something went wrong',
      });
    }
  };  

  // return (
  //   <Form onFinish={handleOnboard}>
  //     <Form.Item label="Name">
  //       <Input value={name} onChange={(e) => setName(e.target.value)} required />
  //     </Form.Item>
  //     <Form.Item label="Email">
  //       <Input value={email} onChange={(e) => setEmail(e.target.value)} required />
  //     </Form.Item>
  //     <Button type="primary" htmlType="submit">
  //       Onboard Customer
  //     </Button>
  //     <CardElement />
  //     <Button type="primary" onClick={handlePayment} loading={loading} disabled={!customerId}>
  //       Pay Now
  //     </Button>
  //   </Form>
  // );
  return (
    <Form onFinish={handleOnboard} style={{ maxWidth: '400px', margin: 'auto' }}>
      <Form.Item label="Name" required>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            style={{ flex: 1 }} 
          />
          <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
        </div>
      </Form.Item>
      <Form.Item label="Email" required>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ flex: 1 }} 
          />
          <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
        </div>
      </Form.Item>
      <Button 
        type="primary" 
        htmlType="submit" 
        style={{ marginBottom: '20px' }} // Adds spacing between the button and the CardElement
      >
        Onboard Customer
      </Button>
      <div style={{ marginBottom: '20px' }}>
        <CardElement />
      </div>
      <Button 
        type="primary" 
        onClick={handlePayment} 
        loading={loading} 
        disabled={!customerId}
      >
        Pay Now
      </Button>
    </Form>
  );  
};

export default PaymentForm;