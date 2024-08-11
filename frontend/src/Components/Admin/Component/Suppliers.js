
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './this.css';

function Suppliers() {
    const [suppliers, setSuppliers] = useState([]);
    useEffect(() => {
    async function fetchData() {
      try {
        const suppliersResponse = await axios.get('http://localhost:8000/suppliers/');
        setSuppliers(suppliersResponse.data);
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
      <h1>Suppliers</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map(supplier => (
            <tr key={supplier['Supplier_ID']}>
              <td>{supplier['Supplier_ID']}</td>
              <td>{supplier['Supplier_Name']}</td>
              <td>{supplier['Supplier_Email']}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/addSupplier" className="link">Add a Supplier</Link>
    </div>
  )
}


export default Suppliers