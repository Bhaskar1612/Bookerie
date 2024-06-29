import React, { useState } from 'react';
import axios from 'axios';

const BookAdd = () => {
  const [formData, setFormData] = useState({
    Book_ID: '',
    Book_Name: '',
    Book_Author: '',
    Book_Price: '',
    Book_Genre: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/books/', formData);
      console.log('Book added successfully:', response.data);
      // Clear form data after submission if needed
      setFormData({
        Book_ID: '',
        Book_Name: '',
        Book_Author: '',
        Book_Price: '',
        Book_Genre: '',
        Book_Rating: '',
      });
    } catch (error) {
      alert('Book not in Supplies')
      console.error('Error adding book:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <h2>Add Book</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="Book_ID" placeholder="Book ID" value={formData.Book_ID} onChange={handleChange} />
        <input type="text" name="Book_Name" placeholder="Book Name" value={formData.Book_Name} onChange={handleChange} />
        <input type="text" name="Book_Author" placeholder="Book Author" value={formData.Book_Author} onChange={handleChange} />
        <input type="number" name="Book_Price" placeholder="Book Price" value={formData.Book_Price} onChange={handleChange} />
        <input type="number" name="Book_Genre" placeholder="Book Genre" value={formData.Book_Genre} onChange={handleChange} />
        <input type="number" name="Book_Rating" placeholder="Book Rating" value={formData.Book_Rating} onChange={handleChange} />
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default BookAdd;
