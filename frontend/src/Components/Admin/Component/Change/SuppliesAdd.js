import React, { useState } from 'react';
import axios from 'axios';

const SuppliesAdd = () => {
  const [formData, setFormData] = useState({
    Supplier_ID: '',
    Book_ID: '',
    Date_Supplied: '',
    Book_Quantity: '',
    Buy_Cost: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/supplies/', formData);
      console.log('Supplies added successfully:', response.data);
      // Clear form data after submission if needed
      setFormData({
        Supplier_ID: '',
        Book_ID: '',
        Date_Supplied: '',
        Book_Quantity: '',
        Buy_Cost: ''
      });
      
    } catch (error) {
      alert('Invalid Supplies');
      console.error('Error adding supplies:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <h2>Add Supplies</h2>
      <form onSubmit={handleSubmit}>
        <input type="number" name="Supplier_ID" placeholder="Supplier_ID" value={formData.Supplier_ID} onChange={handleChange} />
        <input type="number" name="Book_ID" placeholder="Book_ID" value={formData.Book_ID} onChange={handleChange} />
        <input type="date" name="Date_Supplied" placeholder="Date_Supplied" value={formData.Date_Supplied} onChange={handleChange} />
        <input type="number" name="Book_Quantity" placeholder="Book_Quantity" value={formData.Book_Quantity} onChange={handleChange} />
        <input type="number" name="Buy_Cost" placeholder="Buy_Cost" value={formData.Buy_Cost} onChange={handleChange} />
        <button type="submit">Add Supplies</button>
      </form>
    </div>
  );
};

export default SuppliesAdd;