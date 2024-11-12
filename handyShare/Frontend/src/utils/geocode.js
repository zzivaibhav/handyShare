import axios from 'axios';

/**
 * Geocodes an address to latitude and longitude using Nominatim.
 * @param {string} address - The address to geocode.
 * @returns {Promise<{ lat: number, lon: number }>} - The latitude and longitude.
 */
export const geocodeAddress = async (address) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        limit: 1,
      },
    });

    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { lat: parseFloat(lat), lon: parseFloat(lon) };
    } else {
      throw new Error('No results found for the provided address.');
    }
  } catch (error) {
    console.error('Geocoding Error:', error);
    throw error;
  }
};
