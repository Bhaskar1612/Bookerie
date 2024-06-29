
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
            <tr key={customer[0]}>
              <td>{customer[0]}</td>
              <td>{customer[1]}</td>
              <td>{customer[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


export default Customers