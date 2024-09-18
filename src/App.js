import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Menu from './Menu';
import Order from './Order';
import './App.css';  // Import the CSS file

function App() {
  const [backendData, setBackendData] = useState('');

  useEffect(() => {
    // Log to check when the useEffect is triggered
    console.log("Fetching data from the backend...");

    axios.get('http://localhost:5000/')
      .then(response => {
        console.log("Backend data received:", response.data);
        setBackendData(response.data);  // Update state with the data
      })
      .catch(error => console.error('Error fetching backend data:', error));
  }, []);  // Empty dependency array ensures it runs only once on component mount

  return (
    <div>
      <h1>Restaurant Food Ordering App</h1>
      <p>{backendData}</p>

      <div className="menu-container">
        <Menu />
      </div>

      <div className="order-container">
        <Order />
      </div>
    </div>
  );
}

export default App;
