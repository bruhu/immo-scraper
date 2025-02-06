import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="sticky" sx={{ boxShadow: 'none', backgroundColor: '#0081a7' }}>
      <Toolbar sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 16px' }}>
        {/* Main Title */}
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'white' }}>
          Immo Scraper
        </Typography>
        {/* Subtitle */}
        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: 0 }}>
          Probetag Challenge Front/Backend
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
