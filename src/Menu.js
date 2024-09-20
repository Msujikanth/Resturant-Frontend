import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Menu.css'; // Assuming you'll add some CSS for styling

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
      <div className="menu-grid">
        {menuItems.map((item) => (
          <div className="menu-item" key={item._id}>
            {/* Display the image if it exists */}
            {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="menu-image" />}
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>Price: ${item.price}</p>
            <p>Category: {item.category}</p>
            <p>Available: {item.availability ? 'Yes' : 'No'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
