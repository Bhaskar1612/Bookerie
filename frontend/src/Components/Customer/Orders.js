// Orders.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Orders = () => {
  const { userId } = useParams();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        console.log(userId);
        const response = await axios.get(`http://localhost:8000/ordersIndividual/${userId}`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    }
    fetchOrders();
  }, [userId]);

  return (
    <div>
      <h2>Your Ongoing Orders</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Book ID</th>
            <th>Total Cost</th>
            <th>Satus</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order['Order_ID']}>
              <td>{order['Order_ID']}</td>
              <td>{order['Book_ID']}</td>
              <td>{order['Delivery_Cost']+order['Order_Total']}</td>
              <td>{order['Order_Status']}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
