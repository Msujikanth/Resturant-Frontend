import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RestaurantDashboard.css'; // Importing the CSS file

const RestaurantDashboard = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [editItemId, setEditItemId] = useState(null);
  const [newItemData, setNewItemData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    availability: true,
    image: null,  // Add image field
  });

  // Fetch the menu items from the backend
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

  // Handle changes in the form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItemData({
      ...newItemData,
      [name]: value,
    });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setNewItemData({
      ...newItemData,
      image: e.target.files[0],  // Store the selected image file
    });
  };

  // Handle adding a new menu item
  const handleAddItem = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', newItemData.name);
    formData.append('price', newItemData.price);
    formData.append('description', newItemData.description);
    formData.append('category', newItemData.category);
    formData.append('availability', newItemData.availability);
    if (newItemData.image) {
      formData.append('image', newItemData.image);
    }

    try {
      await axios.post('http://localhost:5000/menu', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setNewItemData({ name: '', price: '', description: '', category: '', availability: true, image: null });

      // Clear the file input field
      document.getElementById('file-input').value = null;
      
      // Fetch the updated menu after adding
      const response = await axios.get('http://localhost:5000/menu');
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  // Handle deleting a menu item with confirmation
  const handleDeleteItem = async (itemId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/menu/${itemId}`);
        // Fetch the updated menu after deleting
        const response = await axios.get('http://localhost:5000/menu');
        setMenuItems(response.data);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  // Handle setting up the edit form
  const handleEditItem = (item) => {
    setEditItemId(item._id);
    setNewItemData({
      name: item.name,
      price: item.price,
      description: item.description,
      category: item.category,
      availability: item.availability,
      image: null,  // Reset image input for edit
    });
  };

  // Handle saving the edited item
  const handleSaveItem = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', newItemData.name);
    formData.append('price', newItemData.price);
    formData.append('description', newItemData.description);
    formData.append('category', newItemData.category);
    formData.append('availability', newItemData.availability);
    if (newItemData.image) {
      formData.append('image', newItemData.image);
    }

    try {
      await axios.put(`http://localhost:5000/menu/${editItemId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setEditItemId(null); // Reset the edit state
      setNewItemData({ name: '', price: '', description: '', category: '', availability: true, image: null });
      
      // Clear the file input field
      document.getElementById('file-input').value = null;

      // Fetch the updated menu after editing
      const response = await axios.get('http://localhost:5000/menu');
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  return (
    <div className="restaurant-dashboard">
      {/* Add or Edit Menu Item Form */}
      <form onSubmit={editItemId ? handleSaveItem : handleAddItem}>
        <h3>{editItemId ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newItemData.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newItemData.price}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newItemData.description}
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={newItemData.category}
          onChange={handleChange}
        />
        <input
          id="file-input"  // Give an ID for resetting
          type="file"
          name="image"
          onChange={handleImageChange}
        />
        <button type="submit">{editItemId ? 'Save Changes' : 'Add Item'}</button>
      </form>

      {/* Menu Items List */}
      <div className="menu-items-list">
        <h3>Menu Items</h3>
        <ul>
          {menuItems.map((item) => (
            <li key={item._id}>
              <h4>{item.name}</h4>
              <p>Price: ${item.price}</p>
              <p>Category: {item.category}</p>
              {item.image && <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.name} />}
              <div className="button-group">
                <button className="edit-btn" onClick={() => handleEditItem(item)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDeleteItem(item._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
