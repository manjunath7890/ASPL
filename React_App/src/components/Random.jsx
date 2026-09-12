import React, { useState } from 'react';

const RandomMap = () => {
  const [location, setLocation] = useState({ lat: 28.6139, lng: 77.2090 }); // Default: New Delhi

  const generateRandomLocation = () => {
    const lat = (Math.random() * 180 - 90).toFixed(4);   // -90 to +90
    const lng = (Math.random() * 360 - 180).toFixed(4);  // -180 to +180
    setLocation({ lat, lng });
  };

const mapUrl = `https://maps.google.com/?q=${location.lat},${location.lng}&z=10&output=embed`;
  return (
    <div>
      <h3>Random Location Map</h3>
      <iframe
        title="Random Google Map"
        width="100%"
        height="340.9rem"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={mapUrl}
      ></iframe>

      <button onClick={generateRandomLocation} style={{ marginTop: '1rem' }}>
        Generate Random Location
      </button>
    </div>
  );
};

export default RandomMap;
