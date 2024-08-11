
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Customers() {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
    async function fetchData() {
      try {
        const customersResponse = await axios.get('http://localhost:8000/customers/');
        setCustomers(customersResponse.data);
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
      <h1>Customers</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer['Customer_ID']}>
              <td>{customer['Customer_ID']}</td>
              <td>{customer['Customer_Name']}</td>
              <td>{customer['Customer_Email']}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


export default Customers