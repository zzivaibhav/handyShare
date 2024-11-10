import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message, Select, Steps, InputNumber, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { SERVER_URL } from '../../constants.js';

const { Option } = Select;
const { Step } = Steps;

const EditLendForm = ({ item, onUpdate, onCancel }) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rentalPrice: 0,
    category: '',
    image: null,
    existingImage: '',
  });

  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${SERVER_URL}/api/v1/user/allCategories`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });

        const uniqueCategories = response.data
          .filter(category => category)
          .map(category => category.name)
          .filter((value, index, self) => self.indexOf(value) === index);

        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        message.error('Failed to fetch categories');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setFormData({
      name: item.name || '',
      description: item.description || '',
      rentalPrice: item.rentalPrice || 0,
      category: item.category || '',
      image: null,
      existingImage: item.productImage || '',
    });
    
    setCurrentStep(0);
    
    form.setFieldsValue({
      name: item.name,
      description: item.description,
      rentalPrice: item.rentalPrice,
      category: item.category
    });
  }, [item, form]);

  const steps = [
    {
      title: 'Item Description',
      content: (
        <>
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select 
              placeholder="Select a category"
              value={formData.category} 
              onChange={(value) => setFormData({ ...formData, category: value })}
            >
              {categories.map((cat) => (
                <Option key={cat} value={cat}>{cat}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter the name' }]}
          >
            <Input 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please enter the description' }]}
          >
            <Input.TextArea 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[
              { required: true, message: 'Please enter the price' },
              { type: 'number', min: 0.01, message: 'Price must be greater than 0' }
            ]}
          >
            <InputNumber 
              min={0.01} 
              step={0.01}
              precision={2}
              value={formData.rentalPrice} 
              onChange={(value) => setFormData({ ...formData, rentalPrice: value })}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Image',
      content: (
        <>
          <Form.Item
            label="Product Image"
            name="image"
          >
            <div>
              {/* Show existing image preview */}
              {formData.existingImage && !formData.image && (
                <div style={{ marginBottom: '16px' }}>
                  <p>Current Image:</p>
                  <img 
                    src={formData.existingImage} 
                    alt="Current product" 
                    style={{ maxWidth: '200px', marginBottom: '8px' }} 
                  />
                </div>
              )}
              
              {/* Show new image preview if selected */}
              {formData.image && (
                <div style={{ marginBottom: '16px' }}>
                  <p>New Image:</p>
                  <img 
                    src={URL.createObjectURL(formData.image)} 
                    alt="New product" 
                    style={{ maxWidth: '200px', marginBottom: '8px' }} 
                  />
                </div>
              )}

              <Upload
                beforeUpload={(file) => {
                  setFormData({ ...formData, image: file });
                  return false;
                }}
                onRemove={() => setFormData({ ...formData, image: null })}
                fileList={formData.image ? [formData.image] : []}
              >
                <Button icon={<UploadOutlined />}>
                  {formData.existingImage ? 'Change Image' : 'Upload Image'}
                </Button>
              </Upload>
            </div>
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Product Summary',
      content: (
        <Card title="Summary" bordered={false}>
          <p><strong>Name:</strong> {formData.name}</p>
          <p><strong>Description:</strong> {formData.description}</p>
          <p><strong>Price:</strong> ${formData.rentalPrice}</p>
          <p><strong>Category:</strong> {formData.category}</p>
          {(formData.image || formData.existingImage) && (
            <div>
              <strong>Image:</strong>
              <br />
              <img 
                src={formData.image ? URL.createObjectURL(formData.image) : formData.existingImage} 
                alt="Product" 
                style={{ maxWidth: '200px', marginTop: '10px' }} 
              />
            </div>
          )}
        </Card>
      ),
    }
  ];

  const next = () => {
    form.validateFields().then(() => {
      setCurrentStep(currentStep + 1);
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      const formToSend = new FormData();
      formToSend.append('name', formData.name);
      formToSend.append('description', formData.description);
      formToSend.append('rentalPrice', formData.rentalPrice);
      formToSend.append('category', formData.category);
      
      if (formData.image) {
        formToSend.append('image', formData.image);
      }

      const token = localStorage.getItem('token');
      const response = await axios.put(`${SERVER_URL}/api/v1/user/product/update/${item.id}`, formToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });

      if (response.data) {
        message.success('Item updated successfully!');
        onUpdate();
        onCancel();
      }
    } catch (error) {
      console.error('Error updating product:', error);
      message.error('Failed to update product: ' + (error.response?.data || error.message));
    }
  };

  return (
    <div>
      <Steps current={currentStep} style={{ marginBottom: '20px' }}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <Form
        form={form}
        layout="vertical"
      >
        {steps[currentStep].content}
      </Form>
      <div style={{ marginTop: 24 }}>
        {currentStep < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {currentStep > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Back
          </Button>
        )}
        {currentStep === steps.length - 1 && (
          <Button type="primary" onClick={handleSubmit}>
            Submit
          </Button>
        )}
        <Button style={{ marginLeft: '8px' }} onClick={() => { 
          form.resetFields(); 
          setCurrentStep(0); 
          setFormData({
            name: '',
            description: '',
            rentalPrice: 0,
            category: '',
            image: null,
            existingImage: ''
          }); 
          setFileList([]);
        }}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default EditLendForm;
