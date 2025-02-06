import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column', 
        justifyContent: 'center',
        alignItems: 'center',
        paddingY: 2,
        backgroundColor: '#f5f5f5',
      }}
    >
      <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', maxWidth: '600px' }}>
        Eine Code Challenge für BizFactory, Februar 2025.
        <br />
        <Link
          href="https://github.com/bruhu/immo-scraper/"
          target="_blank"
          sx={{
            display: 'inline-block',
            textDecoration: 'underline',
            color: 'primary.main'
          }}
        >
          GitHub Repository
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
