import React, { useState,useEffect } from 'react';
import axios from 'axios';

const PartnerAdd = () => {
  const [formData, setFormData] = useState({
    Partner_ID: '',
    Partner_Name: '',
    Partner_Email: '',
    Partner_Phone: '',
    Partner_Password: '',
    Partner_Rating: ''
  });

  useEffect(() => {
    async function fetchLastPartnerId() {
      try {
        const response = await axios.get('http://localhost:8000/delivery-partners/');
        const partners = response.data;
        const lastPartner = partners[partners.length - 1];
        const lastId = lastPartner ? lastPartner[0]: 0;
        setFormData(prevState => ({
          ...prevState,
          Partner_ID: lastId + 1
        }));
      } catch (error) {
        console.error('Error fetching last admin ID:', error);
      }
    }

    fetchLastPartnerId();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/delivery-partners/', formData);
      console.log('Delivery partner added successfully:', response.data);
      // Clear form data after submission if needed
      setFormData({
        Partner_ID: '',
        Partner_Name: '',
        Partner_Email: '',
        Partner_Phone: '',
        Partner_Password: '',
        Partner_Rating: ''
      });
    } catch (error) {
      alert('Invalid Partner')
      console.error('Error adding delivery partner:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <h2>Add Delivery Partner</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="Partner_Name" placeholder="Partner Name" value={formData.Partner_Name} onChange={handleChange} />
        <input type="text" name="Partner_Email" placeholder="Partner Email" value={formData.Partner_Email} onChange={handleChange} />
        <input type="text" name="Partner_Phone" placeholder="Partner Phone" value={formData.Partner_Phone} onChange={handleChange} />
        <input type="text" name="Partner_Password" placeholder="Partner Password" value={formData.Partner_Password} onChange={handleChange} />
        <input type="number" name="Partner_Rating" placeholder="Partner Rating" value={formData.Partner_Rating} onChange={handleChange} />
        <button type="submit">Add Delivery Partner</button>
      </form>
    </div>
  );
};

export default PartnerAdd;
