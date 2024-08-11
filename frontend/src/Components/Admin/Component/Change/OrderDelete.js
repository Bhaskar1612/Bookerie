// DeleteOrderPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderDelete = () => {
  const [pendingOrders, setPendingOrders] = useState([]);


  useEffect(() => {
    async function fetchData() {
      try {
        const ordersResponse = await axios.get('http://localhost:8000/orders/');
        const pending = ordersResponse.data.filter(order => order['Order_Status'] === "Pending");
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
      await axios.put(`http://localhost:8000/orders/${order['Order_ID']}/${order['Customer_ID']}`, {
        Order_ID: order['Order_ID'],
        Customer_ID: order['Customer_ID'],
        Delivery_Partner_ID: order['Delivery_Partner_ID'],
        Order_Status: "Complete",
        Order_Total: order['Order_Total'],
        Delivery_Cost: order['Delivery_Cost'],
        Order_Date: order['Order_Date'],
        Book_ID : order['Book_ID'],
        Quantity :order['Quantity']
       
      });


      const response1 = await axios.get('http://localhost:8000/orders/');
      setPendingOrders(response1.data.filter(o => o['Order_Status']==="Pending"));


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
            <tr key={order['Order_ID']}>
              <td>{order['Order_ID']}</td>
              <td>{order['Customer_ID']}</td>
              <td>{order['Delivery_Partner_ID']}</td>
              <td><button onClick={() => handleCompleteOrder(order)}>Complete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>

  );
};

export default OrderDelete;
