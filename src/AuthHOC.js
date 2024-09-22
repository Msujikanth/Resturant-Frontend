import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

function AuthHOC({ requiredRole, children }) {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      axios.get('http://localhost:5000/api/auth/user', {
        headers: {
          'Authorization': `Bearer ${token}`  // Ensure token is attached
        }
      })
        .then(response => {
          setUserRole(response.data.role);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching user role:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userRole || userRole !== requiredRole) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default AuthHOC;
