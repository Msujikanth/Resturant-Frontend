import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);

  // Fetch the menu from the backend
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get('http://localhost:5000/menu');
        setMenuItems(response.data);
      } catch (error) {
        console.error('Error fetching menu:', error);
      }
    };

    fetchMenu();
  }, []);

  return (
    <div>
      <h1>Menu</h1>
      <ul>
        {menuItems.map((item) => (
          <li key={item._id}>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>Price: ${item.price}</p>
            <p>Category: {item.category}</p>
            <p>Available: {item.availability ? 'Yes' : 'No'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Menu;
