  import React, { useState, useEffect } from 'react';
  import { Layout, Menu, Card, Select, Input, Pagination, Modal, Button, Upload, notification } from 'antd';
  import { SearchOutlined, UploadOutlined } from '@ant-design/icons';
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
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [returnedItems, setReturnedItems] = useState(new Set());
    const [selectedBorrowId, setSelectedBorrowId] = useState(null);

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

    const AnalogTimer = ({ startDate, endDate }) => {
      const calculateTimeLeft = () => {
        const now = dayjs();
        const start = dayjs(startDate);
        const end = dayjs(endDate);

        if (now.isBefore(start) || now.isAfter(end)) {
          return null;
        }

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
      }, [startDate, endDate]);

      if (!timeLeft) return null;

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

    const showReturnModal = (borrowId) => {
      setSelectedBorrowId(borrowId);
      setIsModalVisible(true);
    };
    const handleFileChange = (info) => {
      setSelectedFile(info.file.originFileObj);
    };
    
    const calculateBreakdown = (borrowing) => {
      const penalty = borrowing.penalty || 0; // Ensure penalty has a default value of 0 if not provided
      const totalPayment = borrowing.totalPayment || 0; // Ensure totalPayment has a default value of 0 if not provided
      const platformFees = totalPayment * 0.02; // 2% platform fees
      const productCharge = totalPayment - penalty - platformFees; // Calculate product charge
    
      return { productCharge, penalty, platformFees, totalPayment };
    };
    

    const handleCancel = () => {
      setIsModalVisible(false);
      setSelectedFile(null);
      setSelectedBorrowId(null);
    };

    const handleReturnSubmit = async () => {
      if (!selectedFile) {
        notification.error({ message: 'Please select an image to proceed.' });
        return;
      }
    
      // Check file size (e.g., max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        notification.error({ message: 'File size exceeds the limit of 5MB.' });
        return;
      }
    
      // Check file type (e.g., only allow image files)
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(selectedFile.type)) {
        notification.error({ message: 'Only image files are allowed.' });
        return;
      }
    
      const formData = new FormData();
      formData.append('borrowId', selectedBorrowId);
      formData.append('productImage', selectedFile);
    
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:8080/api/v1/user/product/ReturnedBorrower', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
    
        setReturnedItems((prev) => new Set(prev).add(selectedBorrowId));
        notification.success({ message: 'Product returned successfully!' });
      } catch (error) {
        notification.error({ message: 'Failed to return product' });
        console.error(error);
      } finally {
        handleCancel();
      }
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
              {currentItems.map((borrowing) => {
  const isReturned = borrowing.returnImage || borrowing.returnByBorrowerTime;
  const breakdown = calculateBreakdown(borrowing);

  return (
    <Card key={borrowing.id} style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

            {/* Payment Breakdown */}
            <div style={{ marginTop: '10px', fontSize: '14px' }}>
              <p>Product Charge: {breakdown.productCharge.toFixed(2)} AED</p>
              <p>Penalty: {breakdown.penalty.toFixed(2)} AED</p>
              <p>Platform Fees (2%): {breakdown.platformFees.toFixed(2)} AED</p>
              <p>Total Payment: {breakdown.totalPayment.toFixed(2)} AED</p>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, textAlign: 'center' }}>
          {isReturned ? (
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: '#e0e0e0',
                display: 'inline-block',
              }}
            />
          ) : (
            <div
              style={{
                display: 'inline-block',
                padding: '10px',
                borderRadius: '50%',
                border: '2px solid #e0e0e0',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <AnalogTimer startDate={borrowing.timerStart} endDate={borrowing.timerEnd} />
            </div>
          )}
        </div>

        <Button
          type="primary"
          onClick={() => showReturnModal(borrowing.id)}
          disabled={isReturned}
          style={isReturned ? { backgroundColor: '#d9d9d9', borderColor: '#d9d9d9', color: '#8c8c8c' } : {}}
        >
          {isReturned ? 'Returned' : 'Return Product'}
        </Button>
      </div>
    </Card>
  );
})}


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

        <Modal
    title="Return Product"
    visible={isModalVisible}
    onOk={handleReturnSubmit}
    onCancel={handleCancel}
    okText="Submit"
  >
    <p>Please upload an image of the returned product:</p>
    <Upload
  beforeUpload={(file) => {
    setSelectedFile(file); // Set the selected file
    return false; // Prevent automatic upload
  }}
  onRemove={() => setSelectedFile(null)} // Clear selected file on removal
  fileList={selectedFile ? [selectedFile] : []} // Display the selected file
  accept="image/*"
>
  <Button icon={<UploadOutlined />}>Select Image</Button>
</Upload>

  </Modal>
      </div>
    );
  };

  export default BorrowingPage;
