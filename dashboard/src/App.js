import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard'; // Assuming you already have the path correct
import Navbar from './components/Navbar';
import data from './data/data.json'; // Import the JSON file directly

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Load the data from the JSON file on initial render
    setItems(data); // Assuming data is an array of objects
  }, []);

  return (
    <div className="App">
      <Navbar />
      <Dashboard items={items} />
    </div>
  );
}

export default App;
