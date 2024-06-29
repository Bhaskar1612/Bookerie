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
      const randomIndex = Math.floor(Math.random() * partners.length);
      const Delivery_Partner = partners[randomIndex];

    // Fetch the latest order ID
      const Response = await axios.get('http://localhost:8000/orders/');
      const orders = Response.data;
      const lastorder = orders[orders.length - 1];
      const lastOrderId = lastorder ? lastorder[0]: 0;
      

      console.log(lastOrderId);
      // Step 4: Create the order with selected delivery partner and incremented order ID
      const orderResponse = await axios.post('http://localhost:8000/orders/', {
        Order_ID: lastOrderId+1,
        Customer_ID: userId,
        Delivery_Partner_ID: Delivery_Partner[0],
        Order_Status: 'Pending', 
        Order_Total: 1000,
        Delivery_Cost:250,
        Order_Date:'2024-04-02',
        Book_ID: cart[1],
        Quantity: cart[2],

        
      });
      
      const supplyResponse = await axios.get(`http://localhost:8000/suppliesIndividual/${cart[1]}`)
      const supplies = supplyResponse.data
      console.log(supplies);

      let supply = supplies[0];
      for (let i = 1; i < supplies.length; i++) {
        if (supplies[i][3] > supply[3]) { // comparing quantities
          supply = supplies[i];
      }
    }
      
      await axios.put(`http://localhost:8000/supplies/${supply[0]}/${cart[1]}`,{
        Supplier_ID: supply[0],
        Book_ID: cart[1],
        Date_Supplied: supply[2],
        Book_Quantity: supply[3]-cart[2],
        Buy_Cost: supply[4]
      })

      



      // Delete the item from the cart
      await axios.delete(`http://localhost:8000/carts/${userId}/${cart[1]}`);


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
            <tr key={cart[0]+cart[1]}>
              <td>{cart[1]}</td>
              <td>{cart[2]}</td>
              <td><button className="cart-button" onClick={() => handleOrder(cart)}>Place Order</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Cart;

