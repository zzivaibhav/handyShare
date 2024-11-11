import React, { useState, useEffect } from 'react';
import { Layout, Menu, Card, Select, Input, Pagination } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import HeaderBar from '../components/ProfileUpdatePage/ProfileHeaderBar.js';

dayjs.extend(duration);

const { Content, Sider } = Layout;
const { Option } = Select;

const BorrowingPage = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [view, setView] = useState('borrowings');
  const [sortOrder, setSortOrder] = useState('Newest');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchBorrowedProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/v1/user/borrowedProducts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setBorrowings(response.data);
      } catch (err) {
        console.error('Error fetching borrowed products:', err);
      }
    };

    fetchBorrowedProducts();
  }, []);

  const AnalogTimer = ({ endDate }) => {
    const calculateTimeLeft = () => {
      const now = dayjs();
      const end = dayjs(endDate);
      const timeLeft = dayjs.duration(end.diff(now));
      return {
        days: timeLeft.days(),
        hours: timeLeft.hours(),
        minutes: timeLeft.minutes(),
        seconds: timeLeft.seconds(),
      };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearInterval(timer);
    }, [endDate]);

    return (
      <div>
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </div>
    );
  };

  const filteredBorrowings = borrowings.filter((borrowing) =>
    borrowing.product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const sortedBorrowings = [...filteredBorrowings].sort((a, b) => {
    return sortOrder === 'Newest'
      ? new Date(b.timerStart) - new Date(a.timerStart)
      : new Date(a.timerStart) - new Date(b.timerStart);
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedBorrowings.slice(indexOfFirstItem, indexOfLastItem);

  const handleMenuClick = (e) => {
    setView(e.key);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <HeaderBar />
      <Layout>
        <Sider width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['borrowings']}
            style={{ height: '100%', borderRight: 0 }}
            onClick={handleMenuClick}
          >
            <Menu.Item key="borrowings">My Borrowings</Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '20px' }}>
          <Content style={{ padding: '20px', background: '#fff' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Your Borrowed Items</h1>
            
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '10px' }}>Sort:</span>
              <Select
                defaultValue={sortOrder}
                onChange={handleSortChange}
                style={{ width: 120, marginRight: '10px' }}
              >
                <Option value="Newest">Newest</Option>
                <Option value="Oldest">Oldest</Option>
              </Select>
              <Input
                placeholder="Search by name"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={handleSearchChange}
                style={{ marginBottom: '8px', width: '300px', marginTop: '10px' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {currentItems.map((borrowing) => (
                <Card key={borrowing.id} style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Product section */}
                    <div style={{ flex: 2, display: 'flex', alignItems: 'center' }}>
                      <img
                        src={borrowing.product.productImage}
                        alt="product"
                        style={{ width: '100px', height: '100px', marginRight: '20px', borderRadius: '5px' }}
                      />
                      <div>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{borrowing.product.name}</h3>
                        <p style={{ margin: '5px 0', fontSize: '14px' }}>{borrowing.product.description}</p>
                        <p style={{ margin: '5px 0', fontSize: '14px' }}>Price: {borrowing.product.rentalPrice} AED/day</p>
                        <p style={{ margin: '5px 0', fontSize: '14px' }}>
                          Duration: {dayjs(borrowing.timerEnd).diff(dayjs(borrowing.timerStart), 'days')} days
                        </p>
                      </div>
                    </div>

                    {/* Timer section */}
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ 
                        display: 'inline-block',
                        padding: '10px',
                        borderRadius: '50%',
                        border: '2px solid #e0e0e0',
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
                      }}>
                        <AnalogTimer endDate={borrowing.timerEnd} />
                      </div>
                    </div>

                    {/* Lender section */}
                    <div style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      background: '#f0f0f0',
                      borderRadius: '8px',
                      padding: '15px'
                    }}>
                      <img
                        src={borrowing.product.lender.imageData}
                        alt="Lender"
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          marginBottom: '10px'
                        }}
                      />
                      <p style={{ fontSize: '14px', fontWeight: 'bold' }}>{borrowing.product.lender.name}</p>
                      <p style={{ fontSize: '12px', color: '#888' }}>{borrowing.product.lender.email}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={sortedBorrowings.length}
              onChange={handlePageChange}
              style={{ marginTop: '20px', textAlign: 'right' }}
            />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default BorrowingPage;