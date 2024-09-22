import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';  // Added Navigate for redirection
import Menu from './Menu';
import Order from './Order';
import RestaurantDashboard from './RestaurantDashboard';
import Login from './Login';  // Assuming you have a Login component
import AuthHOC from './AuthHOC';  // Importing the AuthHOC
import './App.css';

function App() {
  const [backendData, setBackendData] = useState('');

  // Adding Axios interceptors
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');  // Get the token from localStorage
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;  // Attach token to Authorization header
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          console.error('Unauthorized, redirecting to login...');
          window.location.href = '/login';  // Redirect to login if 401 Unauthorized
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Fetching data from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/')
      .then(response => setBackendData(response.data))
      .catch(error => console.error('Error fetching backend data:', error));
  }, []);

  return (
    <Router>
      <div>
        <h1>Restaurant Food Ordering App</h1>
        <p>{backendData}</p>

        <Routes>
          {/* Default Route: Redirect to login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Public Route for Login */}
          <Route path="/login" element={<Login />} />

          {/* Protected Route for Restaurant Dashboard */}
          <Route
            path="/dashboard"
            element={
              <AuthHOC requiredRole="restaurant">
                <RestaurantDashboard />
              </AuthHOC>
            }
          />

          {/* Protected Route for Customer */}
          <Route
            path="/menu"
            element={
              <AuthHOC requiredRole="customer">
                <div>
                  <Menu />
                  <Order />
                </div>
              </AuthHOC>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
