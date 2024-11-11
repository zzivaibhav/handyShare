import React, { useState, useEffect } from 'react';
import { Button, Layout, Menu, Form, Input, message, Table, Modal, Switch } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProfileHeaderBar from '../components/ProfileUpdatePage/ProfileHeaderBar';
import defaultImage from '../components/ProfileUpdatePage/defaultProfileImage.png';
import LendFormPage from '../components/LendingPage/LendFormPage.js';
import EditLendForm from '../components/LendingPage/EditLendForm.js';
import { SERVER_URL } from '../constants.js';

const { Header, Content, Sider } = Layout;

const Profile = () => {
  const navigate = useNavigate();

  // State for profile and lending data
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    address: null,
    phone: '',
    pincode: null,
    imageData: null,
  });
  const [lentItems, setLentItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // State to handle current view
  const [view, setView] = useState('profile');

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${SERVER_URL}/api/v1/user/getUser`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserDetails(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
        message.error('Failed to load user details');
      }
    };
    fetchUserDetails();
  }, []);

  // Fetch lent items
  useEffect(() => {
    if (view === 'products') {
      fetchLentItemsRefresh();
    }
  }, [view]);

  const fetchLentItemsRefresh = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${SERVER_URL}/api/v1/user/listUserItems`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setLentItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching lent items:', error);
      message.error('Failed to refresh lent items');
      setLoading(false);
    }
  };

  // Handle menu click
  const handleMenuClick = (e) => {
    setView(e.key);
  };

  // Handle edit and delete for lent items
  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${SERVER_URL}/api/v1/user/product/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      message.success('Item deleted successfully');
      fetchLentItemsRefresh();
    } catch (error) {
      console.error('Error deleting item:', error);
      message.error('Failed to delete the item');
    }
  };

  const handleUpdate = () => {
    fetchLentItemsRefresh();
    setIsModalVisible(false);
  };

  // Columns for the lending items table
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'rentalPrice',
      key: 'rentalPrice',
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Availability',
      dataIndex: 'available',
      key: 'available',
      render: (available, record) => (
        <Switch
          checked={available}
          onChange={async (checked) => {
            try {
              const token = localStorage.getItem('token');
              await axios.put(`${SERVER_URL}/api/v1/user/product/changeAvailability/${record.id}`, 
                { status: checked }, 
                {
                  headers: { Authorization: `Bearer ${token}` },
                  withCredentials: true,
                }
              );
              message.success(`Product is now ${checked ? 'available' : 'unavailable'}`);
              fetchLentItemsRefresh();
            } catch (error) {
              console.error('Error updating availability:', error);
              message.error('Failed to update availability');
            }
          }}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>Delete</Button>
        </>
      ),
    },
  ];

  // Handle password change
  const onFinishPasswordChange = async (values) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${SERVER_URL}/api/v1/user/changePassword`,
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success(response.data);
    } catch (error) {
      console.error('Password change error:', error);
      message.error('Failed to change password');
    }
  };

  return (
    <div>
      <ProfileHeaderBar />
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
            <Menu.Item key="products">Products</Menu.Item>
            <Menu.Item key="addProduct">Add New Product</Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '20px' }}>
          <Content style={{ padding: '20px', background: '#fff' }}>
            {view === 'profile' && (
              <>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Profile</h1>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={userDetails.imageData || defaultImage}
                    alt="Profile"
                    style={{
                      height: '100px',
                      width: '100px',
                      borderRadius: '50%',
                      marginRight: '20px',
                      border: '2px solid #4CAF50',
                    }}
                  />
                  <div>
                    <p><strong>Name:</strong> {userDetails.name || 'N/A'}</p>
                    <p><strong>Email:</strong> {userDetails.email}</p>
                    <p><strong>Address:</strong> {userDetails.address || 'N/A'}</p>
                    <p><strong>Phone:</strong> {userDetails.phone || 'N/A'}</p>
                    <p><strong>Pincode:</strong> {userDetails.pincode || 'N/A'}</p>
                    <Button type="primary" onClick={() => navigate('/profile-update', { state: { userDetails } })}>
                      Edit
                    </Button>
                  </div>
                </div>
              </>
            )}
            {view === 'changePassword' && (
              <>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Change Password</h1>
                <Form layout="vertical" onFinish={onFinishPasswordChange}>
                  <Form.Item name="currentPassword" label="Current Password" rules={[{ required: true, message: 'Please input your current password!' }]}>
                    <Input.Password />
                  </Form.Item>
                  <Form.Item name="newPassword" label="New Password" rules={[{ required: true, message: 'Please input your new password!' }]}>
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
                    <Button type="primary" htmlType="submit">Submit</Button>
                  </Form.Item>
                </Form>
              </>
            )}
            {view === 'products' && (
              <Table columns={columns} dataSource={lentItems} rowKey="id" loading={loading} />
            )}
            {view === 'addProduct' && (
              <LendFormPage onUpdate={fetchLentItemsRefresh} />
            )}
          </Content>
        </Layout>
      </Layout>

      <Modal
        title="Edit Lent Item"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {editingItem && (
          <EditLendForm
            item={editingItem}
            onUpdate={handleUpdate}
            onCancel={() => setIsModalVisible(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Profile;
