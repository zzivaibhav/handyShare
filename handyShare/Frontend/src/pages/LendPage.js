import React, { useState, useEffect } from 'react';
import { Layout, Menu, Card, Button, Modal, message, Row, Col, Switch } from 'antd';
import axios from 'axios';
import { SERVER_URL } from '../constants.js';
import LendPageHeader from '../components/LendingPage/LendPageHeader.js';
import { Link } from 'react-router-dom';

const { Content, Sider } = Layout;

const LendPage = () => {
  const [view, setView] = useState('lendings');
  const [loading, setLoading] = useState(true);
  const [lentItems, setLentItems] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    // Fetch lent items when component mounts
    fetchLentItemsRefresh();
  }, []);

  const fetchLentItemsRefresh = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${SERVER_URL}/api/v1/user/lendedProducts`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setLentItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching lent items:', error);
      message.error('Failed to refresh lent items');
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    fetchLentItemsRefresh();
    setIsModalVisible(false);
  };

  return (
    <Layout>
      <LendPageHeader />
      <Layout>
        <Sider>
          <Menu selectedKeys={[view]} onClick={(e) => setView(e.key)}>
            <Menu.Item key="lendings">Rented Products</Menu.Item>
            <Menu.Item key="add">Add New Product</Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            {view === 'lendings' && (
              <Row gutter={16}>
                {lentItems.map((item) => (
                  <Col span={8} key={item.product.id}>
                    <Card
                      hoverable
                      cover={<img alt="product" src={item.product.productImage} />}
                      actions={[
                        <Button type="link">
                          Borrower: {item.borrower.name}
                        </Button>,
                        <Button type="link" danger>
                          Return Item
                        </Button>,
                        <Switch
                          checked={item.product.available}
                          onChange={async (checked) => {
                            try {
                              const token = localStorage.getItem('token');
                              await axios.put(`${SERVER_URL}/api/v1/user/product/changeAvailability/${item.product.id}`, 
                                { status: checked },
                                {
                                  headers: { Authorization: `Bearer ${token}` },
                                  withCredentials: true
                                }
                              );
                              message.success(`Product is now ${checked ? 'available' : 'unavailable'}`);
                              fetchLentItemsRefresh(); // Refresh the list after changing availability
                            } catch (error) {
                              console.error('Error updating availability:', error);
                              message.error('Failed to update availability');
                            }
                          }}
                        />
                      ]}
                    >
                      <Card.Meta
                        title={item.product.name}
                        description={
                          <>
                            <p>{`Rental Price: $${item.product.rentalPrice.toFixed(2)}`}</p>
                            <p>{`Available: ${item.product.available ? 'Yes' : 'No'}`}</p>
                            <p>{`Duration: ${item.duration} hours`}</p>
                            <p>{`Total Amount: $${item.amount}`}</p>
                          </>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
            {view === 'add' && (
              <div>Add New Product Form Here</div> // Replace with your component for adding new products
            )}
          </Content>
        </Layout>
      </Layout>

      {/* Edit Modal for Updates */}
      <Modal
        title="Update Lent Item"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {/* Your form for editing the lent product */}
      </Modal>
    </Layout>
  );
};

export default LendPage;
