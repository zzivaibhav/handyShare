// ContentHomeScreen.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SERVER_URL } from '../../constants';
import ProductCard from './ProductCard.js'; // Importing the reusable card component

function ContentHomeScreen({ category }) {
  const [trending, setTrending] = useState([]);
  const [newlyAdded, setNewlyAdded] = useState([{}]);

  useEffect(() => {
    const fetchTrending = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(SERVER_URL + `/api/v1/user/getTrendingByCategory?category=${category}`,{
          headers: {
             
              Authorization: `Bearer ${token}`
          },
          withCredentials: true

      });
        setTrending(response.data?.body || []);
        console.log(response.data)
      } catch (error) {
        console.log("Error while loading trending topics", error);
      }
    };

    const fetchNewListings = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(SERVER_URL + `/api/v1/user/newly-added?category=${category}`,{
          headers: {
             
              Authorization: `Bearer ${token}`
          },
          withCredentials: true

      });
        setNewlyAdded(response.data || []);
        console.log(newlyAdded);
      } catch (error) {
        console.log(error);
      }
    };

    if (category) {
      fetchTrending();
      fetchNewListings();
    }
  }, [category]);

  return (
    <div style={{ display: 'flex', flex: 1, flexDirection: 'column', height: '100%', width: '100%' }}>
      {category ? (
        <div>
          <div style={{
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            width: '100%',
            fontWeight: 'bold',
            fontSize: '170%',
          }}>
            <span>{category}</span>
          </div>

          <span style={{ fontSize: '150%', fontWeight: '500', marginBottom: '1%' }}>Trending products</span>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '2%', overflowX: 'auto',scrollbarWidth:'none', height: '40%' }}>
            {trending?.map((item, index) => (
             
             
              <ProductCard 
                key={index}
                name={item?.product?.name} 
                description={item?.product?.description} 
                rentalPrice={item?.product?.rentalPrice} 
                productImage={item?.product?.productImage}

              />
      
            ))}
          </div>

          <span style={{ fontSize: '150%', fontWeight: '500', marginBottom: '1%' }}>Newly Listed</span>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '2%', overflowX: 'auto',scrollbarWidth:'none', height: '40%' }}>
            {newlyAdded?.map((item, index) => (
              <ProductCard 
                key={index}
                name={item?.name} 
                description={item?.description} 
                rentalPrice={item?.rentalPrice} 
                productImage={item?.productImage}
              />
            ))}
          </div>
        </div>
      ) : (
        <div>Select a category to see products</div>
      )}
    </div>
  );
}

export default ContentHomeScreen;
