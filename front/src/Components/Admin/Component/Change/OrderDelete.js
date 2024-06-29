// DeleteOrderPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderDelete = () => {
  const [pendingOrders, setPendingOrders] = useState([]);


  useEffect(() => {
    async function fetchData() {
      try {
        const ordersResponse = await axios.get('http://localhost:8000/orders/');
        const pending = ordersResponse.data.filter(order => order[3] === "Pending");
        console.log(pending.data);
        setPendingOrders(pending);


      } catch (error) {
        alert('Some data cannot be fetched');
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  async function handleCompleteOrder(order) {
    console.log(order[0],order[1]);
    try {
      await axios.put(`http://localhost:8000/orders/${order[0]}/${order[1]}`, {
        Order_ID: order[0],
        Customer_ID: order[1],
        Delivery_Partner_ID: order[2],
        Order_Status: "Complete",
        Order_Total: order[4],
        Delivery_Cost: order[5],
        Order_Date: order[6],
        Book_ID : order[7],
        Quantity :order[8]
       
      });


      const response1 = await axios.get('http://localhost:8000/orders/');
      setPendingOrders(response1.data.filter(o => o[3]==="Pending"));


      alert('Order updated successfully');
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order ');
    }
  }


  return (
    <div>
      <h1>Complete Orders</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer ID</th>
            <th>Delivery Partner ID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pendingOrders.map(order => (
            <tr key={order[0]}>
              <td>{order[0]}</td>
              <td>{order[1]}</td>
              <td>{order[2]}</td>
              <td><button onClick={() => handleCompleteOrder(order)}>Complete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>

  );
};

export default OrderDelete;
