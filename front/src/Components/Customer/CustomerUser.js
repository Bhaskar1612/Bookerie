import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './CustomerUser.css';

function CustomerUser() {
  const location = useLocation();
  const [books, setBooks] = useState([]);
  const token = location.state.token;
  const [customerId, setCustomerId] = useState(null);
  const [quantity, setQuantity] = useState({});
  const [name,setName]=useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const customerResponse = await axios.get('http://localhost:8000/customers/me',
        {
          headers: {
            Authorization: `Bearer ${token}` // Include token in request headers
          }
        });
        setCustomerId(customerResponse.data.Customer_ID);
        setName(customerResponse.data.Customer_Name);

        const booksResponse = await axios.get('http://localhost:8000/books/');
        setBooks(booksResponse.data);
      } catch (error) {
        alert('Customer not logged in')
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const handleQuantityChange = (bookId, value) => {
  setQuantity(prevState => ({
    ...prevState,
    [bookId]: value
  }));
};

    const handleAddToCart = async (bookId, bookName) => {
    const cartData = {
      Customer_ID: customerId,
      Book_ID: bookId,
      Quantity: quantity[bookId],
    };

    console.log('Adding book to cart:', bookName); // Debug: Log book name to console

    try {
      // Send POST request to create a new cart entry
      await axios.post('http://localhost:8000/carts/', cartData);
      alert(`"${bookName}" added to cart successfully!`);
    } catch (error) {
      console.error('Error adding book to cart:', error);
      alert('Failed to add book to cart. Please try again later.');
    }
  };

  return (
  <div className="customer-container">
    <h2 className="customer-heading">Welcome {name}</h2>
    <Link to={`/Cart/${customerId}`} className="cart-link">Go to Cart</Link>
    <div className="book-list">
      <h3>Books:</h3>
      {books.map(book => (
        <div className="book-item" key={book[0]}>
          <p className="book-title">{book[1]}</p>
          <div className="book-actions">
            <label className="book-quantity-label" htmlFor={`quantityInput-${book[0]}`}>Quantity:</label>
            <input
              className="book-quantity-input"
              id={`quantityInput-${book[0]}`}
              type="number"
              value={quantity[book[0]] || 0}
              onChange={(e) => handleQuantityChange(book[0], e.target.value)}
            />
            <button className="add-to-cart-button" onClick={() => handleAddToCart(book[0], book[1])}>Add to Cart</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

}

export default CustomerUser;