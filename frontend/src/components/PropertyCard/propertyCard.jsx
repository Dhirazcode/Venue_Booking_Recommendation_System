import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './propertyCard.css';

const PropertyCard = ({ venueId }) => {
  const [venueData, setVenueData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/get_venuefuser?param=${venueId}`);
        setVenueData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (venueId) {
      fetchData();
    }
  }, [venueId]);

  if (!venueData) {
    return <div>Loading...</div>; // Display loading indicator while fetching data
  }

  const { name, address, cuisines, capacity, price_per_person, stars } = venueData;

  return (
    <div className="property-card">
      <div className="property-details">
        <h3>{name}</h3>
        <p>Address: {address}</p>
        <p>Cuisines: {cuisines.join(', ')}</p>
        <p>Capacity: {capacity}</p>
        <p>Price Per Person: {price_per_person}</p>
        <p>Stars: {stars}</p>
      </div>
    </div>
  );
};

export default PropertyCard;
