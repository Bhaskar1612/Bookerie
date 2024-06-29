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
            <tr key={order[0]}>
              <td>{order[0]}</td>
              <td>{order[7]}</td>
              <td>{order[4]+order[5]}</td>
              <td>{order[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
