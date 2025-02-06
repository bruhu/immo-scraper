import React from 'react';
import Navbar from './components/Navbar';
import ListingCard from './components/ListingCard';
import data from './data/data.json'; // Import your JSON data

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <Navbar />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {data.listings.map((listing, index) => (
            <ListingCard key={index} listing={listing} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
