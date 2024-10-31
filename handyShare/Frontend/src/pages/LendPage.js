import React, { useState, useEffect } from 'react';
import HeaderBar from '../components/ProfileUpdatePage/ProfileHeaderBar.js';
import LendFormPage from '../components/LendingPage/LendFormPage.js'; 
import { Layout, Menu, Table, Button, Modal, message } from 'antd';
import axios from 'axios';
import { SERVER_URL } from '../constants.js';


const { Content, Sider } = Layout;

const LendPage = () => {
  const [view, setView] = useState('lendings');
  const [loading, setLoading] = useState(true);
  const [lentItems, setLentItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {

    const fetchLentItems = async () => {
      try {
        const response = await axios.get(SERVER_URL+"/api/v1/all/lending/items")
        setLentItems(response.data); // Add the fetched data
        setLoading(false);
      } catch (error) {
        console.error('Error fetching lent items:', error);
        message.error('Failed to load lent items');
        setLoading(false);
      }
    };

    fetchLentItems();
  }, []);

  const fetchLentItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/v1/all/lending/items');
      setLentItems(response.data);
    } catch (error) {
      console.error('Error fetching lent items:', error);
      message.error('Failed to load lent items');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/all/lending/item/${id}`);
      message.success('Item deleted successfully');
      fetchLentItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      message.error('Failed to delete item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingItem(null);
  };

  const handleUpdate = async (updatedItem) => {
    try {
      await axios.put(`http://localhost:8080/api/v1/all/lending/item/${updatedItem.id}`, updatedItem);
      message.success('Item updated successfully');
      setIsModalVisible(false);
      setEditingItem(null);
      fetchLentItems();
    } catch (error) {
      console.error('Error updating item:', error);
      message.error('Failed to update item');
    }
  };

  const columns = [
    {
      title: 'Item Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Price (per hour)',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Availability',
      dataIndex: 'availability',
      key: 'availability',
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

  const handleMenuClick = (e) => {
    setView(e.key);
  };

  return (
    <div>
      <HeaderBar />
      <Layout>
        <Sider width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['lendings']}
            style={{ height: '100%', borderRight: 0 }}
            onClick={handleMenuClick}
          >
            <Menu.Item key="lendings">Lendings</Menu.Item>
            <Menu.Item key="newLending">New Lending</Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '20px' }}>
          <Content style={{ padding: '20px', background: '#fff' }}>
            {view === 'lendings' ? (
              <>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Your Lent Items</h1>
                <Table 
                  columns={columns} 
                  dataSource={lentItems} 
                  loading={loading} 
                  rowKey="id" 
                />
              </>
            ) : (
              <LendFormPage onProductAdded={fetchLentItems} />
            )}
          </Content>
        </Layout>
      </Layout>

      {/* Edit Modal */}
      <Modal
        title="Edit Lent Item"
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        {editingItem && (
          <LendFormPage 
            item={editingItem} 
            onUpdate={handleUpdate} 
            onCancel={handleModalCancel} 
            isEditing={true} 
          />
        )}
      </Modal>
    </div>
  );
};

export default LendPage;
