import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link,useParams } from 'react-router-dom';

import './Cart.css'

const Cart = () => {
  const { userId } = useParams();
  const [carts, setCarts] = useState([]);

  useEffect(() => {
    
    async function fetchCarts() {
      try {
        const response = await axios.get(`http://localhost:8000/carts/${userId}`);
        setCarts(response.data);
      } catch (error) {
        console.error('Error fetching carts:', error);
      }
    }
    fetchCarts();
  }, [userId]);

  async function handleOrder(cart) {
    
    try {
      const deliveryPartnerResponse = await axios.get('http://localhost:8000/delivery-partners/');
      const partners = deliveryPartnerResponse.data;
      const Delivery_Partner = partners[partners.length - 1];

    // Fetch the latest order ID
      const Response = await axios.get('http://localhost:8000/orders/');
      const orders = Response.data;
      const lastorder = orders[orders.length - 1];
      const lastOrderId = lastorder ? lastorder['Order_ID']: 0;
      

      // Step 4: Create the order with selected delivery partner and incremented order ID
      const orderResponse = await axios.post('http://localhost:8000/orders/', {
        Order_ID: lastOrderId+1,
        Customer_ID: userId,
        Delivery_Partner_ID: Delivery_Partner['Partner_ID'],
        Order_Status: 'Pending', 
        Order_Total: 1000,
        Delivery_Cost:250,
        Order_Date:'2024-04-02',
        Book_ID: cart['Book_ID'],
        Quantity: cart['Quantity'],

        
      });
      
      const supplyResponse = await axios.get(`http://localhost:8000/suppliesIndividual/${cart['Book_ID']}`)
      const supplies = supplyResponse.data
      

      let supply = supplies[0];
      for (let i = 1; i < supplies.length; i++) {
        if (supplies[i]['Book_Quantity'] > supply['Book_Quantity']) { // comparing quantities
          supply = supplies[i];
      }
    }
      
      await axios.put(`http://localhost:8000/supplies/${supply['Supplier_ID']}/${cart['Book_ID']}`,{
        Supplier_ID: supply['Supplier_ID'],
        Book_ID: cart['Book_ID'],
        Date_Supplied: supply['Date_Supplied'],
        Book_Quantity: supply['Book_Quantity']-cart['Quantity'],
        Buy_Cost: supply['Buy_Cost']
      })

      



      // Delete the item from the cart
      await axios.delete(`http://localhost:8000/carts/${userId}/${cart['Book_ID']}`);


      alert('Order Place Successfully');
      console.log('Order created:', orderResponse.data);

      const response = await axios.get(`http://localhost:8000/carts/${userId}`);
      setCarts(response.data);

      // Handle success or navigate to another page
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Order Falied. Book not available at the moment.');
    }
  };

    return (
    <div className="cart-container">
      <h2 className="cart-heading">Cart</h2>
      <Link to={`/orders/${userId}`} className="orders-link">Your Orders</Link> 
      <table className="table">
        <thead>
          <tr>
            <th>Book ID</th>
            <th>Quantity</th>
            <th>Place Order</th>
          </tr>
        </thead>
        <tbody>
          {carts.map(cart => (
            <tr key={cart['Customer_ID']+cart['Book_ID']}>
              <td>{cart['Book_ID']}</td>
              <td>{cart['Quantity']}</td>
              <td><button className="cart-button" onClick={() => handleOrder(cart)}>Place Order</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Cart;

