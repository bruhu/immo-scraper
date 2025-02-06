// src/components/Footer.js

import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      sx={{
        width: '100%',
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        paddingTop: 4, 
        paddingBottom: 2, 
        backgroundColor: '#f5f5f5'
      }}
    >
      <Typography variant="body2" color="textSecondary">
        Ein Code Challenge für BizFactory, Februar 2025 |{" "}
        <Link href="https://github.com/bruhu/immo-scraper/" target="_blank" sx={{ display: 'flex', alignItems: 'center' }}>
          GitHub Repo
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
