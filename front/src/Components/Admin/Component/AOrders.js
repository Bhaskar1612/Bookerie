
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AOrders() {
    const [orders, setOrders] = useState([]);
    useEffect(() => {
    async function fetchData() {
      try {
        const ordersResponse = await axios.get('http://localhost:8000/orders/');
        setOrders(ordersResponse.data);
      }
      catch(error){
        alert('Some data cannot be fetched');
        console.error('Error fetching data:', error);
      }
    }
      fetchData();
  }, []);

    return (
       <div className="Section">
      <h1>Orders</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer ID</th>
            <th>Delivery Partner ID</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order[0]}>
              <td>{order[0]}</td>
              <td>{order[1]}</td>
              <td>{order[2]}</td>
              <td>{order[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br></br>
      <Link to="/deleteOrder" className="link">Complete an Order</Link>
      <br></br>
      <br></br>
    </div>
  )
}


export default AOrders