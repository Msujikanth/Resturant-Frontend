import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RestaurantDashboard.css'; // Importing the CSS file

const RestaurantDashboard = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editItemId, setEditItemId] = useState(null);
  const [newItemData, setNewItemData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    availability: true,
    image: null,
  });

  const [activeTab, setActiveTab] = useState('menu'); // For switching between tabs

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

  // Fetch orders from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  // Menu Management Functions (add, edit, delete)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItemData({
      ...newItemData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setNewItemData({
      ...newItemData,
      image: e.target.files[0],
    });
  };

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
      setNewItemData({
        name: '',
        price: '',
        description: '',
        category: '',
        availability: true,
        image: null,
      });
      document.getElementById('file-input').value = null;

      const response = await axios.get('http://localhost:5000/menu');
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this item?'
    );

    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/menu/${itemId}`);
        const response = await axios.get('http://localhost:5000/menu');
        setMenuItems(response.data);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleEditItem = (item) => {
    setEditItemId(item._id);
    setNewItemData({
      name: item.name,
      price: item.price,
      description: item.description,
      category: item.category,
      availability: item.availability,
      image: null,
    });
  };

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
      setEditItemId(null);
      setNewItemData({
        name: '',
        price: '',
        description: '',
        category: '',
        availability: true,
        image: null,
      });
      document.getElementById('file-input').value = null;

      const response = await axios.get('http://localhost:5000/menu');
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  // Order Management Functions (update status)
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}`, {
        status: newStatus,
      });

      const response = await axios.get('http://localhost:5000/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="restaurant-dashboard">
      {/* Tabs for switching between sections */}
      <div className="tabs">
        <button
          className={activeTab === 'menu' ? 'active-tab' : ''}
          onClick={() => handleTabClick('menu')}
        >
          Menu Management
        </button>
        <button
          className={activeTab === 'orders' ? 'active-tab' : ''}
          onClick={() => handleTabClick('orders')}
        >
          Order Management
        </button>
      </div>

      {/* Tab content for Menu Management */}
      {activeTab === 'menu' && (
        <div className="menu-management">
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
              id="file-input"
              type="file"
              name="image"
              onChange={handleImageChange}
            />
            <button type="submit">
              {editItemId ? 'Save Changes' : 'Add Item'}
            </button>
          </form>

          <div className="menu-items-list">
            <h3>Menu Items</h3>
            <ul>
              {menuItems.map((item) => (
                <li key={item._id}>
                  <h4>{item.name}</h4>
                  <p>Price: ${item.price}</p>
                  <p>Category: {item.category}</p>
                  {item.imageUrl && (
                    <img
                      src={`http://localhost:5000${item.imageUrl}`}
                      alt={item.name}
                    />
                  )}
                  <div className="button-group">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditItem(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteItem(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tab content for Order Management */}
      {activeTab === 'orders' && (
        <div className="orders-management">
          <h3>Orders</h3>
          {orders.length === 0 ? (
            <p>No orders available.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Items</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.customerName}</td>
                    <td>
                      {order.items.map((item) => (
                        <span key={item.name}>
                          {item.name} (x{item.quantity}){' '}
                        </span>
                      ))}
                    </td>
                    <td>${order.totalPrice}</td>
                    <td>{order.status}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleUpdateOrderStatus(order._id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Ready for Pickup">
                          Ready for Pickup
                        </option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default RestaurantDashboard;
