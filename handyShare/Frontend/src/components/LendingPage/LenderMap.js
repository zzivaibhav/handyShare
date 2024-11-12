import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { geocodeAddress } from '../../utils/geocode';
import { Spin, Alert } from 'antd';
import L from 'leaflet';

// Fix for default Marker icon issues in Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LenderMap = ({ address }) => {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const coords = await geocodeAddress(address);
        setPosition([coords.lat, coords.lon]);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };

    fetchCoordinates();
  }, [address]);

  if (loading) {
    return <Spin tip="Loading map..." />;
  }

  if (error || !position) {
    return <Alert message="Unable to load map for the provided address." type="error" />;
  }

  return (
    <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>Lender's Location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default LenderMap;
