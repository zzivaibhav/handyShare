import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Layout, Button, Input, Skeleton, message } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaBox, FaChartLine, FaPlus, FaSpinner, FaCat, FaDog, FaFish } from 'react-icons/fa';
import { SERVER_URL } from '../constants.js';
import  AnimatedHeader   from '../components/Header.js';
import LoadingScreen from '../components/common/LoadingScreen';

const { Header, Content, Sider } = Layout;

const EnhancedHomeScreen = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [trending, setTrending] = useState([]);
  const [newlyAdded, setNewlyAdded] = useState([]);
  const [hasProducts, setHasProducts] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const role = urlParams.get('role');
    
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (!localStorage.getItem('token')) {
      navigate('/login');
    }

    fetchCategories();
  }, [navigate]);

  useEffect(() => {
    if (selectedCategory) {
      fetchTrending();
      fetchNewListings();
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    setCategoryLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(SERVER_URL + "/api/v1/user/allCategories", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setCategories(response.data);
      message.success('Categories loaded successfully');
    } catch (error) {
      console.error("Error fetching categories", error);
      message.error('Failed to load categories');
    } finally {
      setCategoryLoading(false);
      setPageLoading(false);
    }
  };

  const fetchTrending = async () => {
    setTrendingLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(SERVER_URL + `/api/v1/user/getTrendingByCategory?category=${selectedCategory}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setTrending(response.data?.body || []);
      setHasProducts(response.data?.body?.length > 0);
    } catch (error) {
      message.error('Failed to load trending products');
      setHasProducts(false);
    } finally {
      setTrendingLoading(false);
    }
  };

  const fetchNewListings = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(SERVER_URL + `/api/v1/user/newly-added?category=${selectedCategory}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setNewlyAdded(response.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleViewProductsClick = () => {
    navigate('/products');
  };

  const filteredTrending = trending.filter(item => 
    item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNewlyAdded = newlyAdded.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const CategoryButton = ({ category }) => (
    <motion.div
      whileHover={{ scale: 1.02, backgroundColor: '#ffffff' }}
      whileTap={{ scale: 0.98 }}
      className="mb-3"
    >
      <Button 
        style={{
          width: '100%',
          height: '60px',
          background: 'rgba(59, 123, 248, 0.05)',
          border: '1px solid rgba(59, 123, 248, 0.1)',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '500',
          color: '#2c3e50',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '0 20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        }}
        onClick={() => handleCategorySelect(category.name)}
      >
        {category.name}
      </Button>
    </motion.div>
  );

  const ProductCard = ({ name, description, rentalPrice, productImage, productID }) => (
    <motion.div 
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      style={{
        width: 280,
        background: '#ffffff',
        borderRadius: '16px',
        padding: '16px',
        marginRight: '24px',
        marginBottom: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        border: '1px solid rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease'
      }}
      onClick={() => navigate(`/product/${productID}`)}
    >
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <img 
          src={productImage || '/placeholder.svg'} 
          alt={name} 
          style={{ 
            width: '100%', 
            height: 200, 
            objectFit: 'cover', 
            borderRadius: '12px',
            backgroundColor: '#f8f9fa'
          }} 
        />
        <div 
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            background: 'rgba(59, 123, 248, 0.9)',
            padding: '8px 12px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600'
          }}
        >
          ${rentalPrice}/hr
        </div>
      </div>
      <h3 style={{ 
        fontSize: '18px',
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: '8px',
        lineHeight: '1.4'
      }}>
        {name}
      </h3>
      <p style={{ 
        color: '#64748b',
        fontSize: '14px',
        lineHeight: '1.6',
        height: '44px',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
      }}>
        {description}
      </p>
    </motion.div>
  );

  return (
    <>
      {pageLoading && <LoadingScreen tip="Setting up your dashboard..." />}
      <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            background: '#3B7BF8',
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            
          }}
        >
         <AnimatedHeader/>
        </motion.header>

        <Layout style={{ 
          marginTop: '80px', 
          background: '#f8fafc',
          padding: '24px 40px'
        }}>
          <Sider 
            width={280} 
            style={{ 
              background: 'transparent',
              marginRight: '24px'
            }}
          >
            <div style={{
              padding: '24px 16px',
              background: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '1px solid rgba(0,0,0,0.06)'
              }}>
                Categories
              </h2>
              {categories.map((category, index) => (
                <CategoryButton key={index} category={category} />
              ))}
            </div>
          </Sider>

          <Layout style={{ background: 'transparent' }}>
            <Content style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Skeleton active paragraph={{ rows: 4 }} />
                  </motion.div>
                ) : selectedCategory ? (
                  <motion.div
                    key={selectedCategory}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2>{selectedCategory}</h2>
                    {
                      <>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <h3><FaChartLine /> Trending Products</h3>
                          <div style={{ display: 'flex', overflowX: 'auto' }}  >
                            {filteredTrending.map((item, index) => (
                              <ProductCard
                                key={index}
                                productID = {item.product.id}
                                name={item.product.name}
                                description={item.product.description}
                                rentalPrice={item.product.rentalPrice}
                                productImage={item.product.productImage}
                               
                              />
                            ))}
                          </div>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        >
                          <h3><FaBox /> Newly Listed</h3>
                          <div style={{ display: 'flex', overflowX: 'auto' }}>
                            {filteredNewlyAdded.map((item, index) => (
                              <ProductCard
                                key={index}
                                name={item.name}
                                productID={item.id}
                                description={item.description}
                                rentalPrice={item.rentalPrice}
                                productImage={item.productImage}
                              />
                            ))}
                          </div>
                        </motion.div>
                      </>
                     }
                  </motion.div>
                ) : (
                  <motion.div
                    key="no-selection"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{ textAlign: 'center', padding: '50px' }}
                  >
                    <FaSpinner className="animate-spin" style={{ fontSize: '48px', color: '#3B7BF8' }} />
                    <h2>Select a category to view products</h2>
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.div
                style={{ 
                  marginTop: '40px', 
                  textAlign: 'center',
                  padding: '20px'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  type="primary" 
                  onClick={handleViewProductsClick} 
                  size="large"
                  style={{
                    height: '48px',
                    padding: '0 32px',
                    fontSize: '16px',
                    fontWeight: '500',
                    borderRadius: '12px',
                    background: '#3B7BF8',
                    boxShadow: '0 4px 12px rgba(59, 123, 248, 0.2)'
                  }}
                >
                  Browse All Products
                </Button>
              </motion.div>
            </Content>
          </Layout>
        </Layout>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{
            textAlign: 'center',
            background: '#ffffff',
            padding: '24px',
            borderTop: '1px solid rgba(0,0,0,0.06)',
            color: '#64748b',
            fontSize: '14px'
          }}
        >
          HandyShare ©{new Date().getFullYear()} - Share What You Have
        </motion.footer>
      </Layout>
    </>
  );
};

export default EnhancedHomeScreen;

