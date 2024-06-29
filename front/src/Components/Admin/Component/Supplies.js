
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './this.css';

function Suppliess() {
    const [suppliess, setSuppliess] = useState([]);
    useEffect(() => {
    async function fetchData() {
      try {
        const suppliessResponse = await axios.get('http://localhost:8000/supplies/');
        setSuppliess(suppliessResponse.data);
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
      <h1>Supplies</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Book ID</th>
            <th>Date Supplied</th>
            <th>Quantity Remaining</th>
          </tr>
        </thead>
        <tbody>
          {suppliess.map(supplies => (
            <tr key={supplies[0]}>
              <td>{supplies[0]}</td>
              <td>{supplies[1]}</td>
              <td>{supplies[2]}</td>
              <td>{supplies[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/addSupplies" className="link">Add a Supply</Link>
    </div>
  )
}


export default Suppliess