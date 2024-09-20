import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Menu from './Menu';
import Order from './Order';
import RestaurantDashboard from './RestaurantDashboard';
import './App.css';

function App() {
  const [backendData, setBackendData] = useState('');
  const [userRole, setUserRole] = useState('');  // State to store user role

  useEffect(() => {
    // Fetching data from the backend
    axios.get('http://localhost:5000/')
      .then(response => setBackendData(response.data))
      .catch(error => console.error('Error fetching backend data:', error));

    // Fetching the user's role using the stored token
    const token = localStorage.getItem('token');  // Assuming token is stored in localStorage after login
    if (token) {
      axios.get('http://localhost:5000/api/auth/user', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(response => setUserRole(response.data.role))
      .catch(error => console.error('Error fetching user role:', error));
    }
  }, []);  // Empty dependency array ensures it runs only once on component mount

  return (
    <div>
      <h1>Restaurant Food Ordering App</h1>
      <p>{backendData}</p>

      {/* Conditionally rendering components based on user role */}
      {userRole === 'restaurant' && (
        <div className="restaurant-dashboard">
          <h2>Restaurant Dashboard</h2>
          <RestaurantDashboard />
        </div>
      )}

      {userRole === 'customer' && (
        <div className="customer-dashboard">
          <h2>Customer Menu</h2>
          <Menu />
          <Order />
        </div>
      )}

      {!userRole && (
        <div>
          <h2>Loading...</h2>
        </div>
      )}
    </div>
  );
}

export default App;
