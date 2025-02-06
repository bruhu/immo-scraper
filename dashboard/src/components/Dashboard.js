import React from 'react';
import ListingCard from './ListingCard';

const Dashboard = ({ items }) => {
  return (
    <div className="dashboard">
      <h1>Welcome to the Dashboard</h1>
      <div className="listing-container">
        {items.length > 0 ? (
          items.map((item, index) => (
            <ListingCard key={index} item={item} />
          ))
        ) : (
          <p>No items available</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
