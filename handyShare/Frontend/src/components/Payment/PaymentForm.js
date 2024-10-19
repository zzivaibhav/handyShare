import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';

const PaymentForm = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      message.success('Payment successful!');
    }, 2000);
  };

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      style={{ marginTop: '20px' }}
    >
      <Form.Item
        label="Name on Card"
        name="name"
        rules={[{ required: true, message: 'Please enter the name on your card' }]}
      >
        <Input placeholder="Enter your name" />
      </Form.Item>
      <Form.Item
        label="Card Number"
        name="cardNumber"
        rules={[{ required: true, message: 'Please enter your card number' }]}
      >
        <Input placeholder="1234 5678 9012 3456" />
      </Form.Item>
      <Form.Item
        label="Expiry Date"
        name="expiry"
        rules={[{ required: true, message: 'Please enter the expiry date' }]}
      >
        <Input placeholder="MM/YY" />
      </Form.Item>
      <Form.Item
        label="CVV"
        name="cvv"
        rules={[{ required: true, message: 'Please enter your CVV' }]}
      >
        <Input placeholder="123" />
      </Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        loading={loading}
        style={{ width: '100%' }}
      >
        Pay Now
      </Button>
    </Form>
  );
};

export default PaymentForm;
