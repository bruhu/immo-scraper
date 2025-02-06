import React, { useState, useEffect } from 'react';
import ListingCard from './ListingCard'; 
import { 
  Select, MenuItem, Box, Container, InputLabel, 
  FormControl, Typography, Checkbox, ListItemText, 
  Slider, Button, Stack 
} from '@mui/material';

const Dashboard = ({ items = [] }) => {
  const [filters, setFilters] = useState({
    districts: [],
    rooms: [],
    rents: [],
    sqm: [0, 100],
    floorLevels: [],
  });

  const [filteredListings, setFilteredListings] = useState(items);

  const districts = [...new Set(items.map(item => item.district))].sort();
  const rooms = [...new Set(items.map(item => item.rooms))].sort((a, b) => a - b);
  const floorLevels = [...new Set(items.map(item => item.floor_level))].sort();

  const priceRanges = [
    { label: "Unter 1000€", value: [0, 1000] },
    { label: "1000€ - 2000€", value: [1000, 2000] },
    { label: "2000€ - 3000€", value: [2000, 3000] },
    { label: "3000€ - 4000€", value: [3000, 4000] },
    { label: "4000€ - 5000€", value: [4000, 5000] },
    { label: "Über 5000€", value: [5000, Infinity] },
  ];

  useEffect(() => {
    const filterListings = () => {
      const result = items.filter((listing) => {
        const matchesDistrict = filters.districts.length === 0 || filters.districts.includes(listing.district);
        const matchesRooms = filters.rooms.length === 0 || filters.rooms.includes(listing.rooms);
        const matchesRent = filters.rents.length === 0 || filters.rents.some(([min, max]) => listing.monthly_rent >= min && listing.monthly_rent <= max);
        const matchesSize = listing.sqm >= filters.sqm[0] && listing.sqm <= filters.sqm[1];
        const matchesFloorLevel = filters.floorLevels.length === 0 || filters.floorLevels.includes(listing.floor_level);

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

  const handleSizeChange = (event, newValue) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      sqm: newValue,
    }));
  };

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
    <Container maxWidth="lg" sx={{ paddingY: 4 }}>
      <Box sx={{ display: 'flex', gap: 4 }}>
        {/* Filters Section (Left) */}
        <Box sx={{ width: '250px', flexShrink: 0 }}>
          <Typography variant="h5" gutterBottom>
            Filter nach
          </Typography>
          <Stack spacing={2}>
            {/* District Filter */}
            <FormControl fullWidth>
              <InputLabel>Viertel</InputLabel>
              <Select name="districts" value={filters.districts} onChange={handleFilterChange} multiple>
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
              <Select name="rooms" value={filters.rooms} onChange={handleFilterChange} multiple>
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
              <Select name="rents" value={filters.rents} onChange={handleFilterChange} multiple>
                {priceRanges.map((range) => (
                  <MenuItem key={range.label} value={range.value}>
                    <Checkbox checked={filters.rents.some(([min, max]) => min === range.value[0] && max === range.value[1])} />
                    <ListItemText primary={range.label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Size (sqm) Filter */}
            <Box>
              <Typography variant="body1">
                Größe (qm): {filters.sqm[0]} - {filters.sqm[1]}
              </Typography>
              <Slider value={filters.sqm} onChange={handleSizeChange} valueLabelDisplay="auto" min={0} max={500} step={10} />
            </Box>

            {/* Floor Level Filter */}
            <FormControl fullWidth>
              <InputLabel>Stockwerk</InputLabel>
              <Select name="floorLevels" value={filters.floorLevels} onChange={handleFilterChange} multiple>
                {floorLevels.map((level) => (
                  <MenuItem key={level} value={level}>
                    <Checkbox checked={filters.floorLevels.includes(level)} />
                    <ListItemText primary={level} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Reset Button */}
            <Button variant="outlined" onClick={resetFilters}>
              Filters zurücksetzen
            </Button>
          </Stack>
        </Box>

        {/* Listings Section (Right) */}
        <Box sx={{ flex: 1 }}>
          <Stack spacing={2}>
            {filteredListings.length > 0 ? (
              filteredListings.map((listing) => (
                <ListingCard key={listing.id} item={listing} />
              ))
            ) : (
              <Box sx={{ textAlign: 'center', paddingY: 5 }}>
                <Typography variant="h6" color="textSecondary">
                  Keine Inserate gefunden.
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
