import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Order = () => {
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState([{ name: '', quantity: 1 }]);
  const [menuItems, setMenuItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

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

  const handleItemChange = (index, event) => {
    const updatedItems = [...items];
    updatedItems[index].name = event.target.value;
    setItems(updatedItems);
  };

  const handleQuantityChange = (index, event) => {
    const updatedItems = [...items];
    updatedItems[index].quantity = event.target.value;
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { name: '', quantity: 1 }]);
  };

  useEffect(() => {
    let total = 0;
    items.forEach((item) => {
      const menuItem = menuItems.find((menu) => menu.name === item.name);
      if (menuItem) {
        total += menuItem.price * item.quantity;
      }
    });
    setTotalPrice(total);
  }, [items, menuItems]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/order', {
        customerName,
        items,
        totalPrice,
      });
      alert('Order placed successfully');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    }
  };

  return (
    <div>
      <h2>Place Order</h2>
      <form onSubmit={handleSubmit} className="order-form">
        <div>
          <label>Customer Name:</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>
        {items.map((item, index) => (
          <div key={index}>
            <label>Menu Item:</label>
            <select value={item.name} onChange={(e) => handleItemChange(index, e)} required>
              <option value="">Select an item</option>
              {menuItems.map((menuItem) => (
                <option key={menuItem._id} value={menuItem.name}>
                  {menuItem.name}
                </option>
              ))}
            </select>
            <label>Quantity:</label>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(index, e)}
              min="1"
              required
            />
          </div>
        ))}
        <button type="button" onClick={addItem}>
          Add Another Item
        </button>
        <div className="order-total">
          <h3>Total Price: ${totalPrice}</h3>
        </div>
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
};

export default Order;
