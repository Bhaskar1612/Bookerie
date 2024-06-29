import React, { useState ,useEffect} from 'react';
import axios from 'axios';

const SupplierAdd = () => {
  const [formData, setFormData] = useState({
    Supplier_ID: '',
    Supplier_Name: '',
    Supplier_Email: '',
    Supplier_Phone: ''
  });

  useEffect(() => {
    async function fetchLastSupplierId() {
      try {
        const response = await axios.get('http://localhost:8000/suppliers/');
        const suppliers = response.data;
        const lastSupplier = suppliers[suppliers.length - 1];
        const lastId = lastSupplier ? lastSupplier[0]: 0;
        setFormData(prevState => ({
          ...prevState,
          Supplier_ID: lastId + 1
        }));
      } catch (error) {
        console.error('Error fetching last admin ID:', error);
      }
    }

    fetchLastSupplierId();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/suppliers/', formData);
      console.log('Supplier added successfully:', response.data);
      // Clear form data after submission if needed
      setFormData({
        Supplier_ID: '',
        Supplier_Name: '',
        Supplier_Email: '',
        Supplier_Phone: ''
      });
    } catch (error) {
      alert('Invalid Supplier');
      console.error('Error adding supplier:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <h2>Add Supplier</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="Supplier_Name" placeholder="Supplier Name" value={formData.Supplier_Name} onChange={handleChange} />
        <input type="text" name="Supplier_Email" placeholder="Supplier Email" value={formData.Supplier_Email} onChange={handleChange} />
        <input type="text" name="Supplier_Phone" placeholder="Supplier Phone" value={formData.Supplier_Phone} onChange={handleChange} />
        <button type="submit">Add Supplier</button>
      </form>
    </div>
  );
};

export default SupplierAdd;
