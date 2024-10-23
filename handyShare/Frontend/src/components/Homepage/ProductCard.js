import React from 'react';

function ProductCard({ name, description, rentalPrice, productImage }) {
  const placeholderImage = 'path_to_placeholder_image'; // Path to the placeholder image

  return (
    <div 
      style={{
        minHeight: '100%', 
        width: "25%", 
        background: '#3B7BF8', 
        borderRadius: '10px', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        display: 'flex', 
        flexShrink: 0, 
        flexDirection: 'column',
        padding: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        color: 'white'
      }}
    >
      {/* Image section */}
      <div style={{
        height: '250px', 
        width: '100%', 
        background: '#d9d9d9', 
        borderRadius: '10px', 
        marginBottom: '10px',
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
      }}>
        <img 
          src={productImage || placeholderImage}  // Use productImage if available, otherwise show placeholder
          alt={name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} 
        />
      </div>

      {/* Name, description, and price section */}
      <div style={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '5px', textAlign: 'center' }}>
        {name}
      </div>

      <p style={{ textAlign: 'center', fontSize: '14px', fontWeight: 'normal', marginBottom: '5px' }}>
        {description}
      </p>

      <div style={{ fontSize: '18px', textAlign: 'center' }}>
        ${rentalPrice}/hr
      </div>
    </div>
  );
}

export default ProductCard;
