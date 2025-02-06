import React, { useState, useEffect } from 'react';
import ListingCard from './ListingCard'; 
import { Select, MenuItem, Box, Container, InputLabel, FormControl, Typography, Checkbox, ListItemText } from '@mui/material';

const Dashboard = ({ items = [] }) => {
  const [filters, setFilters] = useState({
    districts: [],
    rooms: [],
    rents: [],
  });

  const [filteredListings, setFilteredListings] = useState(items);

  // Extract unique values for districts, rooms, and rents from the data
  const districts = [...new Set(items.map(item => item.district))];
  const rooms = [...new Set(items.map(item => item.rooms))];
  const rents = [...new Set(items.map(item => item.monthly_rent))];

  useEffect(() => {
    // Apply filters based on selected options
    const filterListings = () => {
      const result = items.filter((listing) => {
        const matchesDistrict =
          filters.districts.length === 0 || filters.districts.includes(listing.district);

        const matchesRooms =
          filters.rooms.length === 0 || filters.rooms.includes(listing.rooms);

        const matchesRent =
          filters.rents.length === 0 || filters.rents.includes(listing.monthly_rent);

        return matchesDistrict && matchesRooms && matchesRent;
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

  return (
    <Container>
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h5" gutterBottom>
          Filter nach
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
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

          {/* Rent Filter */}
          <FormControl fullWidth>
            <InputLabel>Miete</InputLabel>
            <Select
              name="rents"
              value={filters.rents}
              onChange={handleFilterChange}
              label="Rent"
              multiple
            >
              {rents.map((rent) => (
                <MenuItem key={rent} value={rent}>
                  <Checkbox checked={filters.rents.includes(rent)} />
                  <ListItemText primary={`€${rent}`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}> {/* Display in a single column */}
        {filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <Box key={listing.id} sx={{ marginBottom: 2 }}> {/* Cards in one column */}
              <ListingCard item={listing} />
            </Box>
          ))
        ) : (
          <Typography>No listings match the selected filters.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
