import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import data from './data/data.json';

// Custom MUI theme
const theme = createTheme({
  typography: {
    fontFamily: '"Funnel Sans", sans-serif;'
  },
});

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(data);
  }, []);

  return (
    <ThemeProvider theme={theme}>
    <div className="App">
      <div className="content-wrapper">
        <Navbar />
        <Dashboard items={items} />
      </div>
      <Footer />
    </div>
    </ThemeProvider>
  );
}

export default App;
