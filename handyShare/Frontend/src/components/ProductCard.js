import React from 'react';
import { motion } from 'framer-motion';
import { Card, Tag } from 'antd';

const ProductCard = ({ 
  name, 
  description, 
  rentalPrice, 
  productImage, 
  productID, 
  onClick,
  available = true 
}) => (
  <motion.div 
    whileHover={{ scale: 1.02, y: -5 }}
    whileTap={{ scale: 0.98 }}
    style={{
      width: 280,
      opacity: available ? 1 : 0.7,
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
    onClick={onClick}
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
      {!available && (
        <Tag 
          color="error" 
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
          }}
        >
          Unavailable
        </Tag>
      )}
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

export default ProductCard;
