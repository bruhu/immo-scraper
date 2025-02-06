import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import data from './data/data.json';

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(data);
  }, []);

  return (
    <div className="App">
      <div className="content-wrapper">  {/* Wrapper for dynamic content */}
        <Navbar />
        <Dashboard items={items} />
      </div>
      <Footer />
    </div>
  );
}

export default App;
