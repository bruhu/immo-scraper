import React, { useState, useEffect } from 'react';
import ListingCard from './ListingCard';
import data from '../data/data.json';

function Dashboard() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    setListings(data); // Load the data from the JSON file
  }, []);

  return (
    <div className="dashboard">
      {listings.map((listing) => (
        <ListingCard key={listing.plz} listing={listing} />
      ))}
    </div>
  );
}

export default Dashboard;
