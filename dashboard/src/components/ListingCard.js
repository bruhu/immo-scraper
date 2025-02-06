import React from 'react';

const ListingCard = ({ listing }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform duration-300">
      <img
        src={listing.image}
        alt={listing.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{listing.title}</h3>
        <p className="text-sm text-gray-600 mt-2">{listing.description}</p>
        <p className="text-lg font-bold text-blue-600 mt-4">${listing.price}</p>
        <div className="text-xs text-gray-500 mt-2">
          <p>{listing.location}</p>
          <p>{listing.bedrooms} Bedrooms</p>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
