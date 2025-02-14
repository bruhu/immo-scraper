import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const ListingCard = ({ item }) => {
  return (
    <Card sx={{
      display: 'flex',
      borderRadius: 2,
      boxShadow: 0,
      margin: 2,
      padding: 2,
      alignItems: 'center'
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
          Verfügbar ab: {item.available_from}
          </Typography>
          <Typography variant="body2" color="text.primary" sx={{ marginBottom: 1 }}>
            <strong>Miete:</strong> {item.monthly_rent}€
          </Typography>
          <Typography variant="body2" color="text.primary" sx={{ marginBottom: 1 }}>
            <strong>Stadt:</strong> {item.plz} {item.city}
          </Typography>
          <Typography variant="body2" color="text.primary" sx={{ marginBottom: 1 }}>
            <strong>Viertel:</strong> {item.district}
          </Typography>
          <Typography variant="body2" color="text.primary" sx={{ marginBottom: 1 }}>
            <strong>Größe:</strong> {item.sqm} qm
          </Typography>
          <Typography variant="body2" color="text.primary" sx={{ marginBottom: 1 }}>
            <strong>Zimmer:</strong> {item.rooms}
          </Typography>
          <Typography variant="body2" color="text.primary" sx={{ marginBottom: 1 }}>
            <strong>Miete/qm:</strong> {item.sqm_price}€
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
};

export default ListingCard;
