// src/components/Dashboard.js

import React, { useState, useEffect } from 'react';
import ListingCard from './ListingCard'; 
import { Select, MenuItem, Box, Container, InputLabel, FormControl, Typography, Checkbox, ListItemText, Slider, Button } from '@mui/material';

const Dashboard = ({ items = [] }) => {
  const [filters, setFilters] = useState({
    districts: [],
    rooms: [],
    rents: [],
    sqm: [0, 100],
    floorLevels: [],
  });

  const [filteredListings, setFilteredListings] = useState(items);

  // Extract unique values for districts, rooms, rents, floor levels from the data
  const districts = [...new Set(items.map(item => item.district))].sort(); // Sort districts alphabetically
  const rooms = [...new Set(items.map(item => item.rooms))].sort((a, b) => a - b); // Sort rooms numerically
  
  // Price ranges
  const priceRanges = [
    { label: "Unter 1000€", value: [0, 1000] },
    { label: "1000€ - 2000€", value: [1000, 2000] },
    { label: "2000€ - 3000€", value: [2000, 3000] },
    { label: "3000€ - 4000€", value: [3000, 4000] },
    { label: "4000€ - 5000€", value: [4000, 5000] },
    { label: "Über 5000€", value: [5000, Infinity] },
  ];

  const floorLevels = [...new Set(items.map(item => item.floor_level))].sort(); // Sort floor levels alphabetically

  useEffect(() => {
    // Apply filters
    const filterListings = () => {
      const result = items.filter((listing) => {
        const matchesDistrict =
          filters.districts.length === 0 || filters.districts.includes(listing.district);

        const matchesRooms =
          filters.rooms.length === 0 || filters.rooms.includes(listing.rooms);

        const matchesRent =
          filters.rents.length === 0 || filters.rents.some((range) => {
            const [min, max] = range;
            return listing.monthly_rent >= min && listing.monthly_rent <= max;
          });

        const matchesSize =
          listing.sqm >= filters.sqm[0] && listing.sqm <= filters.sqm[1];

        const matchesFloorLevel =
          filters.floorLevels.length === 0 || filters.floorLevels.includes(listing.floor_level);

        return matchesDistrict && matchesRooms && matchesRent && matchesSize && matchesFloorLevel;
      });
      setFilteredListings(result);
    };

    filterListings();
  }, [filters, items]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Handle the size (sqm) filter range change
  const handleSizeChange = (event, newValue) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      sqm: newValue,
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      districts: [],
      rooms: [],
      rents: [],
      sqm: [0, 100],
      floorLevels: [],
    });
  };

  return (
    <Box sx={{ width: '100%', paddingTop: '40px' }}> {/* Full width for the main container */}
      <Container sx={{ paddingTop: '40px' }}> {/* Adjust container padding */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
          {/* Filters Section (Left side) */}
          <Box sx={{ flex: 1, minWidth: '250px' }}>
            <Typography variant="h5" gutterBottom>
              Filter nach
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* District Filter */}
              <FormControl fullWidth>
                <InputLabel>Viertel</InputLabel>
                <Select
                  name="districts"
                  value={filters.districts}
                  onChange={handleFilterChange}
                  label="District"
                  multiple
                >
                  {districts.map((district) => (
                    <MenuItem key={district} value={district}>
                      <Checkbox checked={filters.districts.includes(district)} />
                      <ListItemText primary={district} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Rooms Filter */}
              <FormControl fullWidth>
                <InputLabel>Zimmer</InputLabel>
                <Select
                  name="rooms"
                  value={filters.rooms}
                  onChange={handleFilterChange}
                  label="Rooms"
                  multiple
                >
                  {rooms.map((room) => (
                    <MenuItem key={room} value={room}>
                      <Checkbox checked={filters.rooms.includes(room)} />
                      <ListItemText primary={room} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Rent Filter (Price Ranges) */}
              <FormControl fullWidth>
                <InputLabel>Miete</InputLabel>
                <Select
                  name="rents"
                  value={filters.rents}
                  onChange={handleFilterChange}
                  label="Rent"
                  multiple
                >
                  {priceRanges.map((range) => (
                    <MenuItem key={range.label} value={range.value}>
                      <Checkbox checked={filters.rents.some(rentRange => 
                        rentRange[0] === range.value[0] && rentRange[1] === range.value[1]
                      )} />
                      <ListItemText primary={range.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Size (sqm) Filter */}
              <Box sx={{ width: '100%' }}>
                <Typography variant="body1" gutterBottom>
                  Größe (qm): {filters.sqm[0]} - {filters.sqm[1]}
                </Typography>
                <Slider
                  value={filters.sqm}
                  onChange={handleSizeChange}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value} qm`}
                  min={0}
                  max={500}
                  step={10}
                />
              </Box>

              {/* Floor Level Filter */}
              <FormControl fullWidth>
                <InputLabel>Stockwerk</InputLabel>
                <Select
                  name="floorLevels"
                  value={filters.floorLevels}
                  onChange={handleFilterChange}
                  label="Floor Level"
                  multiple
                >
                  {floorLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      <Checkbox checked={filters.floorLevels.includes(level)} />
                      <ListItemText primary={level} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Reset Button */}
              <Button 
                variant="outlined" 
                onClick={resetFilters} 
                sx={{ marginTop: 2 }}
              >
                Filters zurücksetzen
              </Button>
            </Box>
          </Box>

          {/* Listings Section (Right side) */}
          <Box sx={{ flex: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {filteredListings.length > 0 ? (
                filteredListings.map((listing) => (
                  <Box key={listing.id} sx={{ marginBottom: 2 }}>
                    <ListingCard item={listing} />
                  </Box>
                ))
              ) : (
                <Typography>Keine Inserate gefunden.</Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
