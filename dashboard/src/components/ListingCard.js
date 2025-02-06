import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const ListingCard = ({ item }) => {
  return (
    <Card sx={{
      display: 'flex',
      borderRadius: 2,
      boxShadow: 0, // Remove shadow
      margin: 2,
      padding: 2,
      alignItems: 'center' // Vertically align the content
    }}>
      {/* Image Section with Fallback Message */}
      <Box
        sx={{
          width: 200,
          height: 150,
          marginRight: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f0f0f0',
          borderRadius: 1,
          textAlign: 'center'
        }}
      >
        {(item.image && item.image !== "Keine Fotos vorhanden") ? (
          <img
            src={item.image}
            alt={item.listing_title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 4
            }}
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            Keine Fotos vorhanden
          </Typography>
        )}
      </Box>

      {/* Text Section */}
      <Box sx={{ flex: 1 }}>
        <CardContent>
          <Typography variant="h6" component="div" sx={{ marginBottom: 1 }}>
            {item.listing_title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
            {item.listing_details}
          </Typography>
          <Typography variant="body2" color="text.primary">
            <strong>Monthly Rent:</strong> €{item.monthly_rent}
          </Typography>
          <Typography variant="body2" color="text.primary">
            <strong>Location:</strong> {item.location}
          </Typography>
          <Typography variant="body2" color="text.primary">
            <strong>Size:</strong> {item.sqm} m²
          </Typography>
          <Typography variant="body2" color="text.primary">
            <strong>Rooms:</strong> {item.rooms}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
};

export default ListingCard;
