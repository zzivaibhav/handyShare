import React, { useState, useEffect } from 'react';
import { Button, Layout, Menu, Form, Input, message } from 'antd';
import axios from 'axios'; // Import Axios
import ProfileHeaderBar from '../components/ProfileUpdatePage/ProfileHeaderBar'; 
import defaultImage from '../components/ProfileUpdatePage/defaultProfileImage.png'; 
import { useNavigate } from 'react-router-dom'; 

const { Header, Content, Sider } = Layout;

const Profile = () => {
  const navigate = useNavigate(); 

  // State to hold user details
  const [userDetails, setUserDetails] = useState({
    name: '', 
    email: '', 
    address: null, 
    phone: '',
    pincode: null, 
    imageData: null,
  });

  // State to handle the current view (Profile or Change Password)
  const [view, setView] = useState('profile');

  // Fetch user details from API using Axios
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the access token from localStorage

        const response = await axios.get('http://localhost:8080/api/v1/user/getUser', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the access token in the Authorization header

          },
        });
        setUserDetails(response.data); // Update state with the fetched user details
      } catch (error) {
        console.error('Error fetching user details:', error);
        message.error('Failed to load user details'); // Show error message if request fails
      }
    };

    fetchUserDetails();
  }, []);

  // Handle menu item click
  const handleMenuClick = (e) => {
    setView(e.key);
  };

  // Handle password change form submission
  const onFinishPasswordChange = async (values) => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  console.log(values.currentPassword)
      // Send request to the API to change the password
      const response = await axios.patch(
        'http://localhost:8080/api/v1/user/changePassword',
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        }
      );
  
      message.success(response.data); // Show success message
    } catch (error) {
      console.error('Password change error:', error);
      message.error('Failed to change password'); // Show error message if request fails
    }
  };
  

  // Navigate to the Profile Update page with user details
  const handleEditClick = () => {
    navigate('/profile-update', { state: { userDetails } }); 
  };

  return (
    <Layout>
      <Header>
        <ProfileHeaderBar/>
      </Header>
      <Layout>
        <Sider width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['profile']}
            style={{ height: '100%', borderRight: 0 }}
            onClick={handleMenuClick}
          >
            <Menu.Item key="profile">Profile</Menu.Item>
            <Menu.Item key="changePassword">Change Password</Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '20px' }}>
          <Content style={{ padding: '20px', background: '#fff' }}>
            {view === 'profile' ? (
              <>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Profile</h1>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={userDetails.imageData || defaultImage} // Use the imported default image
                    alt="Profile"
                    style={{
                      height: '100px',
                      width: '100px',
                      borderRadius: '50%', // Circular image
                      marginRight: '20px',
                      border: '2px solid #4CAF50', // Border for visibility
                    }}
                  />
                  <div>
                    <p><strong>Name:</strong> {userDetails.name || 'N/A'}</p>
                    <p><strong>Email:</strong> {userDetails.email}</p>
                    <p><strong>Address:</strong> {userDetails.address || 'N/A'}</p>
                    <p><strong>Phone:</strong> {userDetails.phone || 'N/A'}</p>
                    <p><strong>Pincode:</strong> {userDetails.pincode || 'N/A'}</p>
                    <Button 
                        type="primary" 
                        onClick={handleEditClick} // Call the edit function
                        style={{ marginTop: '10px' }}  
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Change Password</h1>
                <Form
                  layout="vertical"
                  onFinish={onFinishPasswordChange}
                >
                  <Form.Item
                    name="currentPassword"
                    label="Current Password"
                    rules={[{ required: true, message: 'Please input your current password!' }]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <Form.Item
                    name="newPassword"
                    label="New Password"
                    rules={[{ required: true, message: 'Please input your new password!' }]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <Form.Item
                    name="confirmPassword"
                    label="Confirm New Password"
                    rules={[
                      { required: true, message: 'Please confirm your new password!' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('The two passwords do not match!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Form.Item>
                </Form>
              </>
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Profile;
